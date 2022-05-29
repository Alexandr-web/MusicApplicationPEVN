<template>
  <div class="default__layout">
    <vHeader />
    <vSidebar />
    <main class="main-content">
      <Nuxt />
    </main>
  </div>
</template>

<script>
import setThemeMixin from "@/mixins/setThemeMixin";
import vHeader from "@/components/vHeader";
import vSidebar from "@/components/vSidebar";

export default {
  name: "DefaultLayout",
  components: {
    vHeader,
    vSidebar,
  },
  mixins: [setThemeMixin],
  middleware: "checkAuth",
};
</script>