<template>
  <div class="nothing">
    <span class="nothing__text">{{ text }}</span>
    <nuxt-link
      v-if="link"
      class="nothing__link"
      :to="link.to"
    >
      {{ link.text }}
    </nuxt-link>
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
      link: {
        type: Object, 
        default: () => {}, 
      },
    },
  };
</script>