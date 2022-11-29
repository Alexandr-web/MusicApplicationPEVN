<template>
  <vForm
    :classes="['auth__form']"
    :fields="fields"
    :pending="pendingRegistration"
    text-button="Зарегистрироваться"
    @sendReq="registration"
  />
</template>

<script>
  import vForm from "@/components/vForm";

  export default {
    name: "RegistrationPage",
    components: { vForm, },
    layout: "auth",
    data() {
      return {
        pendingRegistration: false,
        fields: {
          avatar: {
            title: "Загрузить аватар",
            type: "file",
            typeFile: "img",
            isAvatar: true,
            accept: ["image/jpeg", "image/png", "image/jpg", "image/webp"],
            required: true,
          },
          name: {
            title: "Имя",
            placeholder: "Написать имя",
            matchRegexpStr: "^.{6,16}$",
            type: "text",
            required: true,
          },
          email: {
            title: "Email пользователя",
            placeholder: "Написать email",
            matchRegexpStr: "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$",
            type: "text",
            required: true,
          },
          password: {
            title: "Пароль",
            placeholder: "Написать пароль",
            matchRegexpStr: "^.{6,}$",
            type: "password",
            required: true,
          },
        },
      };
    },
    head: { title: "Регистрация", },
    methods: {
      /**
       * Handles an emit for user registration
       * @param {object} data User data
       */
      registration(data) {
        if (Object.values(data).length !== Object.keys(this.fields).length) {
          alert("Все поля должны быть заполнены!");
          return;
        }

        const fd = new FormData();
        
        // Fill form data
        Object.keys(data).map((key) => {
          const item = data[key];

          if (typeof item !== "object") {
            fd.append(key, item);
          } else {
            fd.append(key, item["file" in item ? "file" : "model"]);
          }
        });

        const res = this.$store.dispatch("auth/registration", fd);

        this.pendingRegistration = true;

        res.then(({ ok, message, }) => {
          this.pendingRegistration = false;
          
          alert(message);
          if (ok) {
            this.$router.push("/auth/login");
          }
        }).catch((err) => {
          throw err;
        });
      },
    },
  };
</script>