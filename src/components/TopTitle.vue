<template>
  <div class="top-title">{{ $t(title) }}</div>
</template>
<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
const title = computed(() => {
  var route = useRoute();
  // console.log(route.name);
  // console.log("nav." + route.name);
  return "nav." + route.name;
});
</script>

<style>
.top-title {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: 45px;
  margin-bottom: -25px;
  font-size: 38px;
  font-weight: 700;
  color: var(--color-text);
  a {
    font-size: 13px;
    font-weight: 600;
    opacity: 0.68;
  }
}
</style>
