<template>
  <div class="bar-container">
    <div class="navigation-links">
      <div class="navlink-items">
        <!-- TODO: active nav -->
        <ButtonIcon :class="{ active: $route.name === 'home' }">
          <div class="navlink-item">
            <q-icon :name="ionCaretForwardCircle" class="svg-icon"></q-icon>
            <router-link to="/" :class="{ active: $route.name === 'home' }">
              {{ $t("nav.home") }}
            </router-link>
          </div>
        </ButtonIcon>
        <ButtonIcon>
          <div class="navlink-item">
            <q-icon :name="ionMusicalNotes" class="svg-icon"></q-icon>
            <router-link
              to="/explore"
              :class="{ active: $route.name === 'explore' }"
            >
              {{ $t("nav.explore") }}
            </router-link>
          </div>
        </ButtonIcon>
        <ButtonIcon>
          <div class="navlink-item">
            <q-icon :name="ionAlbums" class="svg-icon"></q-icon>
            <router-link
              to="/library"
              :class="{ active: $route.name === 'library' }"
            >
              {{ $t("nav.library") }}
            </router-link>
          </div>
        </ButtonIcon>
      </div>
    </div>
  </div>
</template>
<script setup>
import {
  ionCaretForwardCircle,
  ionAlbums,
  ionMusicalNotes,
} from "@quasar/extras/ionicons-v7";
import ButtonIcon from "./ButtonIcon.vue";
</script>
<style>
.navigation-links {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
}
.navlink-items {
  display: grid;
  width: 100%;
  height: 50px;
  /* margin-top: -5px; */
  margin-left: 2px;
  text-align: center;
  /* justify-content: space-around; */
  backdrop-filter: saturate(180%) blur(30px);
  background-color: var(--color-navbar-bg);
  grid-template-columns: repeat(3, 1fr);
  /* vertical-align: middle; */

  .navlink-item {
    margin-top: -9px;
    /* width: 33%; */
    height: 36px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    .q-icon {
      margin-top: 7px;
      width: 20px;
      height: 20px;
    }
  }
}
a {
  /* //去掉下换线 */
  text-decoration: none;

  /* //文字颜色更改 */
  color: black;
}
.router-link-exact-active {
  color: black;
}
.router-link-active {
  color: black;
}
</style>
