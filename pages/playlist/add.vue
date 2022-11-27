<template>
  <div class="gaps-t-b playlist">
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
  import vAddPlaylistForm from "@/components/vAddPlaylistForm";

  export default {
    name: "AddPlaylistPage",
    components: { vAddPlaylistForm, },
    layout: "default",
    data() {
      return { pendingAdd: false, };
    },
    head: { title: "Добавление плейлиста", },
    computed: {
      getToken() {
        return this.$store.getters["auth/getToken"];
      },
    },
    methods: {
      /**
       * Handles an emit to add a playlist
       * @param {object} data playlist we want to add
       */
      add(data) {
        const fd = new FormData();
        const token = this.getToken;

        Object.keys(data).map((key) => fd.append(key, data[key]));
        
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