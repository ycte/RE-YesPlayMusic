<!-- eslint-disable n/prefer-global/process -->
<!-- eslint-disable no-console -->
<script setup>
import { storeToRefs } from 'pinia'
import { computed, onMounted, watch } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'
import useStore from './stores/store'
import {
  isAccountLoggedIn as AccountLoggedIn,
  isLooseLoggedIn as LooseLoggedIn,
} from './utils/auth'
import Player from './components/PlayerBelow.vue'
import NavBarButton from './components/NavBarBelow.vue'
import LyricsView from './views/LyricsView.vue'

const store = useStore()
const route = useRoute()
const { showLyrics, settings, player, enableScrolling } = storeToRefs(store)
// TODO: debug showLyrics
watch(showLyrics, () => {
  console.log('> App.vue-store-showLyrics:', showLyrics.value)
})
const isAccountLoggedIn = computed(() => AccountLoggedIn)
const isLooseLoggedIn = computed(() => LooseLoggedIn)
const showPlayer = computed(() => {
  // console.log(
  //   "showPlayer",
  //   [
  //     "mv",
  //     "loginUsername",
  //     "login",
  //     "loginAccount",
  //     "lastfmCallback",
  //   ].includes(route.name) === false
  // )
  return (
    ['mv', 'loginUsername', 'login', 'loginAccount', 'lastfmCallback'].includes(
      route.name,
    ) === false
  )
})
const enablePlayer = computed(() => {
  // return (
  //   this.player.player.enabled && route.name !== "lastfmCallback"
  // )
  return true
})
const showNavbar = computed(() => route.name !== 'lastfmCallback')

onMounted(() => {
  // TODO: Vue3 eventListener for vercel deploy
  console.log('>APP onActivated test process:', process.env)
  console.log('>APP onActivated test showLyrics:', showLyrics.value)

  // console.log('>APP onActivated test player:', player.value.player.playOrPause)
  // console.log('>APP onActivated test isLogin:', isLooseLoggedIn.value, isAccountLoggedIn.value)
  window.addEventListener('keydown', handleKeydown)
  // TODO: fetch data
  // fetchData();
})
function handleKeydown(e) {
  console.log('>handleKeydown', e)
  if (e.code === 'Space') {
    if (e.target.tagName === 'INPUT')
      return false
    if (route.name === 'mv')
      return false
    e.preventDefault()
    player.value.player.playOrPause()
  }
}
function fetchData() {
  // console.log('fetchData')
  if (!isLooseLoggedIn.value)
    return
  console.log('!isLooseLoggedIn:', !isLooseLoggedIn.value)
  store.fetchLikedSongs()
  store.fetchLikedSongs()
  store.fetchLikedSongsWithDetails()
  store.fetchLikedPlaylist()
  if (isAccountLoggedIn.value) {
    store.fetchLikedAlbums()
    store.fetchLikedArtists()
    store.fetchLikedMVs()
    store.fetchCloudDisk()
  }
}
// TODO: handle scroll
// function handleScroll() {
//   this.$refs.scrollbar.handleScroll()
// }
</script>

<template>
  <!-- area for router-view and top-level components -->
  
  <div id="root">
    <!-- <h1>hhhh</h1> -->
    <RouterView />
  </div>
  <Player v-if="enablePlayer" v-show="showPlayer" />
  <NavBarButton v-show="showNavbar" />
  <!-- <Transition v-show="showLyrics">
    <LyricsView></LyricsView>
  </Transition> -->
</template>

<style scoped>
#root {
  
  margin-left: -32px;
  margin-right: -32px;
  margin-top: -32px;
  margin-bottom: 120px;
  /* background-color: black; */
}

#app {
  /* display: fixed;
  left: 0;
  right: 0;
  top: 0; */
  /* width: 100%; */
  /* display: flex; */
  margin-left: -10%;
  font-family: Avenir, Helvetica, Arial, sans-serif;
}
a {
  /* //去掉下换线 */
  text-decoration: none;
  margin-right: 5%;
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
