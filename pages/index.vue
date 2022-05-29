<template>
  <div class="page">
    <div class="container">
      <h1>hello, world!</h1>
    </div>
  </div>
</template>

<script>
import setThemeMixin from "@/mixins/setThemeMixin";

export default { 
  name: "MainPage",
  mixins: [setThemeMixin],
  middleware: "checkAuth",
};
</script>