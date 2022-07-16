import Vue from "vue";

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

function checkOnValid(models) {
  this.$invalid = models.some(Boolean);
}

const validationPlugin = {
  install(globalVue) {
    globalVue.mixin({
      created() {
        if (this.validations !== undefined) {
          Object.assign(this.validations, { $invalid: false, });

          Object.keys(this.validations).map((key) => {
            if (!/^\$/.test(key)) {
              const rules = this.validations[key].rules;
              const updates = {
                $invalid: false,
                $watchRules: Object.keys(rules).reduce((acc, rule) => {
                  if (rules[rule]) {
                    acc[rule] = false;
                  }

                  return acc;
                }, {}),
              };

              Object.keys(updates).map((k) => this.validations[key][k] = updates[k]);

              this.$watch(`validations.${key}.model`, () => {
                this.watchingRules(key);
                checkModelsOnValid.call(this.validations[key]);

                const models = Object
                  .keys(this.validations)
                  .filter((k) => !/^\$/.test(k))
                  .map((k) => this.validations[k].$invalid);

                checkOnValid.call(this.validations, models);
              }, { immediate: true, deep: true, });
            }
          });
        }
      },
      methods: {
        minLength(val, num) {
          return val.length >= num;
        },
        isEmail(val) {
          return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(val);
        },
        maxLength(val, num) {
          return val.length <= num;
        },
        sameAs(model, key) {
          return model === this.validations[key].model;
        },
        isRequired(model) {
          return Boolean(model.length);
        },
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