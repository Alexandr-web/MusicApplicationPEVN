<template>
  <svg
    id="Layer_1"
    style="enable-background:new 0 0 512 512;"
    version="1.1"
    viewBox="0 0 512 512"
    xml:space="preserve"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    :class="classNames.filter(Boolean).join(' ')"
  ><g><path d="M128,96v320l256-160L128,96L128,96z" /></g></svg>
</template>

<script>
  export default {
    name: "PlayIconComponent",
    props: {
      classNames: {
        type: Array,
        default: () => [],
      },
    },
  };
</script>