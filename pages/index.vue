<template>
  <div class="page">
    <div class="container">
      <h1>hello, world!</h1>
    </div>
  </div>
</template>

<script>
  import audioControlsMixin from "@/mixins/audioControlsMixin";

  export default { 
    name: "MainPage",
    mixins: [audioControlsMixin],
    layout: "default",
  };
</script>