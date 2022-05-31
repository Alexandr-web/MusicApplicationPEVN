<template>
  <div class="profile__tab-block profile__tab-settings">
    <vProfileSettingsForm
      :pending="pendingEdit"
      @edit="edit"
    />
  </div>
</template>

<script>
  import vProfileSettingsForm from "@/components/profile/vProfileSettingsForm";

  export default { 
    name: "ProfileSettingsComponent",
    components: { vProfileSettingsForm, },
    data() {
      return { pendingEdit: false, };
    },
    methods: {
      edit(data) {
        const fd = new FormData();
        const { id, } = this.$route.params;
        const token = this.$store.getters["auth/getToken"];

        Object.keys(data).map((key) => data[key] && fd.append(key, data[key]));
        
        const res = this.$store.dispatch("profile/edit", { fd, userId: id, token, });

        this.pendingEdit = true;

        res.then(({ message, }) => {
          this.pendingEdit = false;
          alert(message);
        }).catch((err) => {
          throw err;
        });
      },
    },
  };
</script>