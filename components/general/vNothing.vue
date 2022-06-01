<template>
  <div class="nothing">
    <span class="nothing__text">{{ text }}</span>
  </div>
</template>

<script>
  export default {
    name: "NothingComponent",
    props: {
      text: {
        type: String,
        default: "Ничего нет",
      },
    },
  };
</script>