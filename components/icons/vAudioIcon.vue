<template>
  <svg
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    :class="classNames.join(' ')"
  >
    <title />
    <path
      d="M20,7V17a3,3,0,1,1-2-2.82V7a1,1,0,0,0-1-1H10v9a3,3,0,1,1-2-2.82V4h9A3,3,0,0,1,20,7Z"
    />
  </svg>
</template>

<script>
  export default {
    name: "AudioIconComponent",
    props: {
      classNames: {
        type: Array,
        default: () => [],
      },
    },
  };
</script>