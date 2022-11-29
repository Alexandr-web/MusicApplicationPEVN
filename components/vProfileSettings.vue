<template>
  <div class="profile__tab-block profile__tab-settings">
    <vForm
      :class="['profile__form']"
      :pending="pendingEdit"
      :fields="fields"
      text-button="Сохранить"
      @sendReq="edit"
    />
  </div>
</template>

<script>
  import vForm from "@/components/vForm";

  export default { 
    name: "ProfileSettingsComponent",
    components: { vForm, },
    data() {
      return {
        pendingEdit: false,
        fields: {
          avatar: {
            title: "Загрузить аватар",
            type: "file",
            typeFile: "img",
            isAvatar: true,
            accept: ["image/jpeg", "image/png", "image/jpg", "image/webp"],
          },
          name: {
            title: "Имя",
            type: "text",
            placeholder: "Написать имя",
            matchRegexpStr: "^.{4,16}$",
          },
          email: {
            title: "Email пользователя",
            placeholder: "Написать email",
            type: "text",
            matchRegexpStr: "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$",
          },
          password: {
            title: "Пароль",
            placeholder: "Написать пароль",
            type: "text",
            matchRegexpStr: "^.{6,}$",
          },
        },
      };
    },
    computed: {
      getToken() {
        return this.$store.getters["auth/getToken"];
      },
      getUser() {
        return this.$store.getters["profile/getUser"];
      },
    },
    // Filling the data with the initial value in the form
    created() {
      Object.keys(this.fields).map((key) => {
        if (key !== "password" && key in this.getUser) {
          this.fields[key][this.fields[key].type === "file" ? "src" : "model"] = this.getUser[key];
        }
      });
    },
    methods: {
      /**
       * Handles an emit to edit user data
       * @param {object} data User data to be changed
       */
      edit(data) {
        if (!Object.keys(data).length) {
          alert("Хотя бы одно поле должно быть заполнено");
          return;
        }

        const fd = new FormData();
        const { id, } = this.$route.params;
        const token = this.getToken;

        // Fill form data
        Object.keys(data).map((key) => {
          const item = data[key];

          if (typeof item !== "object") {
            fd.append(key, item);
          } else {
            const dataItem = item["file" in item ? "file" : "model"];

            if (dataItem) {
              fd.append(key, dataItem);
            }
          }
        });
        
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