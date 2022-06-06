<template>
  <div class="audio page">
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
  import vAudioFormAdd from "@/components/audio/vAudioFormAdd";

  export default {
    name: "AudioAddPage",
    components: { vAudioFormAdd, },
    data() {
      return { pendingAdd: false, };
    },
    methods: {
      add(data) {
        if (Object.values(data).every(Boolean) && [data.poster, data.audio].every((file) => file instanceof File)) {
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
        } else {
          alert("Все поля должны быть заполнены");
        }
      },
    },
  };
</script>