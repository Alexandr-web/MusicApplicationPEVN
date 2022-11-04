<template>
  <div class="audio gaps-t-b">
    <div class="container">
      <div class="audio__inner">
        <vAudioFormAdd
          :pending="pendingAdd"
          @add="add"
        />
      </div>
    </div>
  </div>
</template>

<script>
  import vAudioFormAdd from "@/components/vAudioFormAdd";

  export default {
    name: "AudioAddPage",
    components: { vAudioFormAdd, },
    data() {
      return { pendingAdd: false, };
    },
    head: { title: "Добавление аудио", },
    methods: {
      /**
       * Receives data from the form and sends a request to add a audio
       * @param {object} data Required data for audio (poster, name, audio file, ...)
       */
      add(data) {
        const fd = new FormData();
        const token = this.$store.getters["auth/getToken"];

        Object.keys(data).map((key) => fd.append(key, data[key]));

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