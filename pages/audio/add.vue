<template>
  <div class="audio gaps-t-b">
    <div class="container">
      <div class="audio__inner">
        <vForm
          :classes="['audio__form']"
          :fields="fields"
          text-button="Добавить"
          :pending="pendingAdd"
          :is-audio="true"
          @sendReq="add"
        />
      </div>
    </div>
  </div>
</template>

<script>
  import vForm from "@/components/vForm";

  export default {
    name: "AudioAddPage",
    components: { vForm, },
    data() {
      return {
        pendingAdd: false,
        fields: {
          name: {
            title: "Название",
            placeholder: "Написать название",
            matchRegexpStr: "^.{3,16}$",
            type: "text",
            required: true,
          },
          audio: {
            title: "Загрузить аудио",
            type: "file",
            typeFile: "audio",
            accept: ["audio/mp3", "audio/ogg", "audio/wav", "audio/flac"],
            required: true,
          },
          poster: {
            title: "Загрузить постер",
            type: "file",
            typeFile: "img",
            accept: ["image/jpeg", "image/png", "image/jpg", "image/webp"],
            isPoster: true,
            required: true,
          },
        },
      };
    },
    head: { title: "Добавление аудио", },
    computed: {
      getToken() {
        return this.$store.getters["auth/getToken"];
      },
    },
    methods: {
      /**
       * Receives data from the form and sends a request to add a audio
       * @param {object} data Required data for audio (poster, name, audio file, ...)
       */
      add(data) {
        if (!Object.keys(this.fields).every((key) => key in data)) {
          alert("Все поля должны быть заполнены");
          return;
        }

        const fd = new FormData();
        const token = this.getToken;

        Object.keys(data).map((key) => {
          const item = data[key];

          if (typeof item === "object") {
            fd.append(key, item["file" in item ? "file" : "model"]);
          } else {
            fd.append(key, item);
          }
        });

        const res = this.$store.dispatch("audio/add", { token, fd, });

        this.pendingAdd = true;

        res.then(({ ok, message, }) => {
          this.pendingAdd = false;

          alert(message);
          
          if (ok) {
            this.$router.push("/");
          }
        }).catch((err) => {
          throw err;
        });
      },
    },
  };
</script>