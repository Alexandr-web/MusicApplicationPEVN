<template>
  <div
    class="nothing"
    :class="{
      'nothing--gaps': gaps,
    }"
  >
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
      gaps: Boolean,
      link: {
        type: Object, 
        default: () => {}, 
      },
    },
  };
</script>