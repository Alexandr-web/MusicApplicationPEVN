<template>
  <svg
    id="Layer_1_1_"
    style="enable-background:new 0 0 16 16;"
    version="1.1"
    viewBox="0 0 16 16"
    xml:space="preserve"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    :class="classNames.filter(Boolean).join(' ')"
  ><polygon points="1,1 1,15 12,8 " /><rect
    height="16"
    width="1"
    x="13"
  /><rect
    height="16"
    width="1"
    x="15"
  /></svg>
</template>

<script>
  export default {
    name: "NextIconComponent",
    props: {
      classNames: {
        type: Array,
        default: () => [],
      },
    },
  };
</script>