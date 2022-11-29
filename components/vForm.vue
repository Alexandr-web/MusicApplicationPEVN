<template>
  <form
    class="form"
    :class="classes.filter(Boolean).join(' ')"
    enctype="multipart/form-data"
    @submit.prevent="sendReq"
  >
    <div
      v-for="(fieldKey, index) in getFieldsKeys"
      :key="index"
      class="form__field"
    >
      <label
        v-if="fields[fieldKey].type === 'file'"
        class="form__label"
        :for="fieldKey"
      >
        <input
          :id="fieldKey"
          :name="fieldKey"
          class="input__file"
          type="file"
          :accept="fields[fieldKey].accept.join(',')"
          @change="loadFile($event, fieldKey)"
        >
        <div
          v-if="fields[fieldKey].typeFile === 'img'"
          :class="{
            'form__block-poster': fields[fieldKey].isPoster,
            'form__block-avatar': fields[fieldKey].isAvatar,
          }"
        >
          <span
            v-if="!fields[fieldKey].isAvatar || !dataForm[fieldKey].src"
            class="input__file-style input__file-style"
          >{{ fields[fieldKey].title }}</span>
          <img
            v-if="dataForm[fieldKey].src"
            class="form__file-img"
            :src="dataForm[fieldKey].src"
            :class="{
              'form__avatar': fields[fieldKey].isAvatar,
              'form__poster': fields[fieldKey].isPoster,
            }"
          />
        </div>
        <div
          v-if="fields[fieldKey].typeFile === 'audio'"
          class="form__block-audio"
        >
          <span class="input__file-style input__file-style">{{ fields[fieldKey].title }}</span>
          <audio
            v-if="dataForm[fieldKey].src"
            class="form__audio"
            :src="dataForm[fieldKey].src"
            controls
            @loadedmetadata="audioIsLoaded($event)"
          ></audio>
        </div>
      </label>
      <label
        v-else
        class="form__label"
        :for="fieldKey"
      >
        <h4 class="form__field-title">{{ fields[fieldKey].title }}</h4>
        <input
          :id="fieldKey"
          v-model.trim="dataForm[fieldKey].model"
          :name="fieldKey"
          :placeholder="fields[fieldKey].placeholder || ''"
          :type="fields[fieldKey].type"
          :class="{
            'input--invalid': !fieldIsMatch(fieldKey),
          }"
          class="form__input input"
        >
      </label>
    </div>
    <slot name="additionalField"></slot>
    <button
      class="form__submit"
      type="submit"
      :disabled="pending"
    >{{ textButton }}</button>
  </form>
</template>

<script>
  import getAudioTimeMixin from "@/mixins/getAudioTimeMixin";

  export default {
    name: "FormComponent",
    mixins: [getAudioTimeMixin],
    props: {
      classes: {
        type: Array,
        default: () => ([]),
      },
      fields: {
        type: Object,
        required: true,
      },
      textButton: {
        type: String,
        required: true,
      },
      pending: {
        type: Boolean,
        required: true,
      },
      isAudio: {
        type: Boolean,
        default: false,
      },
    },
    data: () => ({
      dataForm: {},
      audio: {
        time: "",
        duration: 0,
      },
    }),
    computed: {
      getFieldsKeys() {
        return Object.keys(this.fields);
      },
      getDataFormKeys() {
        return Object.keys(this.dataForm);
      },
      getValidateFields() {
        return this.getDataFormKeys
          .filter((key) => {
            if (this.fields[key].required || ("model" in this.dataForm[key] && this.dataForm[key].model.length)) {
              return this.fieldIsMatch(key);
            }

            return true;
          }).reduce((acc, key) => {
            acc[key] = this.dataForm[key];
            
            return acc;
          }, {});
      },
    },
    // Creating similar elements in the dataForm object that contain the keys needed to check the validation
    created() {
      this.getFieldsKeys.map((key) => {
        if (this.fields[key].type !== "file") {
          this.dataForm[key] = { model: this.fields[key].model || "", };
        } else {
          this.dataForm[key] = {
            file: null,
            src: this.fields[key].src || "",
          };
        }
      });
    },
    methods: {
      /**
       * Records the time and duration of a song when it is fully loaded
       * @param {object} e Event object
       */
      audioIsLoaded(e) {
        const duration = e.currentTarget.duration;

        this.audio = {
          time: this.getValidTime(duration),
          duration,
        };
      },
      /**
       * Validity check field
       * @param {string} key The key of the field element that we will check
       */
      fieldIsMatch(key) {
        const itemForm = this.dataForm[key];
        const field = this.fields[key];
        
        if (field.required || ("model" in itemForm && itemForm.model.length)) {
          // For the field that contains the file
          if (field.type === "file") {
            return itemForm.file instanceof File;
          }
          
          // For normal string values
          const regexp = new RegExp(field.matchRegexpStr);

          return regexp.test(itemForm.model);
        }

        return true;
      },
      // Sends values that pass validation
      sendReq() {
        this.$emit("sendReq", this.isAudio ? { ...this.audio, ...this.getValidateFields, } : this.getValidateFields);
      },
      /**
       * Replacing the value of the dataForm element by key
       * @param {string} key dataForm object key
       * @param {string} val The new value for the element of the dataForm object
       */
      setOneKeyAtDataForm(key, val) {
        this.dataForm = this.getDataFormKeys.reduce((acc, dataKey) => {
          if (dataKey !== key) {
            acc[dataKey] = this.dataForm[dataKey];
          } else {
            acc[key] = val;
          }

          return acc;
        }, {});
      },
      /**
       * Loads a file and puts its data into the dataForm[fieldKey] element
       * @param {object} e Event object
       * @param {string} fieldKey Element key of the dataForm object
       */
      loadFile(e, fieldKey) {
        const file = e.currentTarget.files[0];

        if (file) {
          // Clear
          this.setOneKeyAtDataForm(fieldKey, {
            ...this.dataForm[fieldKey],
            file: null,
            src: null,
          });

          const blob = new Blob([file], { type: file.type, });
          const url = URL.createObjectURL(blob);

          this.setOneKeyAtDataForm(fieldKey, {
            ...this.dataForm[fieldKey],
            file,
            src: url,
          });
        }
      },
    },
  };
</script>