<template>
  <svg
    :class="classNames.filter(Boolean).join(' ')"
    viewBox="0 0 48 48"
    xmlns="http://www.w3.org/2000/svg"
  ><path d="M12 38h8V10h-8v28zm16-28v28h8V10h-8z" /><path
    d="M0 0h48v48H0z"
    fill="none"
  /></svg>
</template>

<script>
  export default {
    name: "PauseIconComponent",
    props: {
      classNames: {
        type: Array,
        default: () => [],
      },
    },
  };
</script>