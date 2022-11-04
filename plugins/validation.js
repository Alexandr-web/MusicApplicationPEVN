import Vue from "vue";

// Checks the result of checking all rules and writes it to the $invalid key
function checkModelsOnValid() {
  const keysRules = Object.keys(this.rules);

  if (!keysRules.includes("required")) {
    if (!this.model.length) {
      this.$invalid = false;
    } else {
      this.$invalid = !Object.values(this.$watchRules).every(Boolean);
    }
  } else {
    this.$invalid = !Object.values(this.$watchRules).every(Boolean);
  }
}

const validationPlugin = {
  install(globalVue) {
    globalVue.mixin({
      mounted() {
        if (this.validations !== undefined) {
          // Update the validations object with the $invalid key
          Object.assign(this.validations, { $invalid: false, });

          Object.keys(this.validations).map((key) => {
            if (!/^\$/.test(key)) {
              const rules = this.validations[key].rules;
              const updates = {
                $invalid: false,
                // Rule object to watch
                $watchRules: Object.keys(rules).reduce((acc, rule) => {
                  if (rules[rule]) {
                    acc[rule] = false;
                  }

                  return acc;
                }, {}),
              };

              // Update the elements of the validations object with the updates object
              Object.keys(updates).map((k) => this.validations[key][k] = updates[k]);

              // Monitor element model changes
              this.$watch(`validations.${key}.model`, () => {
                // Checking if the rules are followed
                this.watchingRules(key);

                // Checks the result of checking all rules of the ONE MODEL and writes it to the $invalid key
                checkModelsOnValid.call(this.validations[key]);

                // Get the value of $invalid keys of ALL MODELS
                const modelsInvalid = Object
                  .keys(this.validations)
                  .filter((k) => !/^\$/.test(k))
                  .map((k) => this.validations[k].$invalid);

                this.validations.$invalid = modelsInvalid.some(Boolean);
              }, { immediate: true, deep: true, });
            }
          });
        }
      },
      methods: {
        /**
         * Checks for minimum length
         * @param {string} val Model value
         * @param {number} num Minimum length
         * @returns {boolean} Is the length of the model a minimum
         */
        minLength(val, num) {
          return val.length >= num;
        },
        /**
         * Checks for email
         * @param {string} val Model value
         * @returns {boolean} Is email
         */
        isEmail(val) {
          return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(val);
        },
        /**
         * Checks for maximum length
         * @param {string} val Model value
         * @param {number} num Maximum length
         * @returns {boolean} Is the length of the model a maximum
         */
        maxLength(val, num) {
          return val.length <= num;
        },
        /**
         * Compares value
         * @param {string} model Model value
         * @param {string} key The key by which object to compare
         * @returns {boolean} The meaning of the two models is the same
         */
        sameAs(model, key) {
          return model === this.validations[key].model;
        },
        /**
         * Checks if the model contains at least one character
         * @param {string} val Model value
         * @returns {boolean} Contains at least one character
         */
        isRequired(val) {
          return Boolean(val.length);
        },
        /**
         * Finds available rules, which checks for validity
         * @param {string} key Validations object key
         */
        watchingRules(key) {
          const rules = this.validations[key].rules;
          const model = this.validations[key].model;

          Object.keys(rules).map((rule) => {
            const valRule = this.validations[key].rules[rule];

            switch (rule) {
              case "email":
                this.validations[key].$watchRules[rule] = this.isEmail(model);
                break;
              case "minLength":
                this.validations[key].$watchRules[rule] = this.minLength(model, valRule);
                break;
              case "maxLength":
                this.validations[key].$watchRules[rule] = this.maxLength(model, valRule);
                break;
              case "sameAs":
                this.validations[key].$watchRules[rule] = this.sameAs(model, valRule);
                break;
              case "required":
                this.validations[key].$watchRules[rule] = this.isRequired(model);
                break;
            }
          });
        },
      },
    });
  },
};

Vue.use(validationPlugin);