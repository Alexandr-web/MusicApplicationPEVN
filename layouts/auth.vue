<template>
  <div class="auth page">
    <div class="container">
      <div class="auth__inner">
        <div class="auth__center">
          <header class="auth__header">
            <nav class="auth__header-nav">
              <ul class="auth__header-list">
                <li class="auth__header-list-item">
                  <nuxt-link
                    class="auth__header-list-link"
                    to="/auth/login"
                    exact-active-class="auth__header-list-link--active"
                  >
                    Вход
                  </nuxt-link>
                </li>
                <li class="auth__header-list-item">
                  <nuxt-link
                    class="auth__header-list-link"
                    to="/auth/registration"
                    exact-active-class="auth__header-list-link--active"
                  >
                    Регистрация
                  </nuxt-link>
                </li>
              </ul>
            </nav>
          </header>
          <main class="auth__main">
            <Nuxt />
          </main>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import setThemeMixin from "@/mixins/setThemeMixin";

  export default {
    name: "EmptyLayout",
    mixins: [setThemeMixin],
    middleware: "checkAlreadyAuth",
  };
</script>