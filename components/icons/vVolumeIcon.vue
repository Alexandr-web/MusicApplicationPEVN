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
  ><polygon points="10,16 10,0 3,5 0,5 0,11 3,11 " /><path d="M11,13.91c2.837-0.477,5-2.938,5-5.91s-2.163-5.433-5-5.91v1.011C13.279,3.566,15,5.585,15,8s-1.721,4.434-4,4.899V13.91z" /><path d="M11,9.722v1.094c1.163-0.413,2-1.512,2-2.816s-0.837-2.403-2-2.816v1.094C11.595,6.625,12,7.263,12,8  C12,8.737,11.595,9.375,11,9.722z" /></svg>
</template>

<script>
  export default {
    name: "VolumeIconComponent",
    props: {
      classNames: {
        type: Array,
        default: () => [],
      },
    },
  };
</script>