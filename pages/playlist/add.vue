<template>
  <div class="page playlist">
    <div class="container">
      <div class="playlist__inner">
        <vAddPlaylistForm
          :pending="pendingAdd"
          @add="add"
        />
      </div>
    </div>
  </div>
</template>

<script>
  import vAddPlaylistForm from "@/components/playlist/vAddPlaylistForm";

  export default {
    name: "AddPlaylistPage",
    components: { vAddPlaylistForm, },
    layout: "default",
    data() {
      return { pendingAdd: false, };
    },
    methods: {
      add(data) {
        const fd = new FormData();
        const token = this.$store.getters["auth/getToken"];

        Object.keys(data).map((key) => key !== "audio" && fd.append(key, data[key]));

        fd.append("audio", JSON.stringify(data.audio));
        
        const res = this.$store.dispatch("playlist/add", { token, fd, });

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