<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <!-- TODO: show navbar -->
      <Navbar v-show="showNav" />

      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref, computed, onMounted } from "vue";
import Navbar from "src/components/Navbar.vue";

export default defineComponent({
  name: "MainLayout",

  components: {
    Navbar,
  },

  setup() {
    const leftDrawerOpen = ref(false);
    const scrollToTop = ref(window.scrollY);
    const showNav = computed(() => {
      // console.log(window.scrollY);
      // console.log(scrollToTop.value);
      return scrollToTop.value !== 0;
    });
    // onMounted(() => {
    //   // console.log(window);
    //   window.addEventListener("scroll", scrollToTop.value);
    //   console.log(scrollToTop.value);
    // });
    return {
      leftDrawerOpen,
      showNav,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
});
</script>

<style></style>
