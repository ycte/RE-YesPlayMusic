<template>
  <div id="app">
    <!-- <Navbar v-if="showNavbar" /> -->
    <!-- TODO: root 的样式搬到 layout 里去 -->
    <router-view id="root" />
    <!-- <transition name="slide-up"> -->
    <!-- <Navbar /> -->
    <Player v-if="enablePlayer" v-show="showPlayer" ref="player" />
    <!-- </transition> -->
    <!-- TODO: 分离出独立组件，学 Player 的做法 -->
    <div class="navigation-links">
      <div class="navlink-items">
        <div class="navlink-item">
          <q-icon :name="ionCaretForwardCircle" class="svg-icon"></q-icon>
          <router-link to="/" :class="{ active: $route.name === 'home' }">
            {{ $t("nav.home") }}
          </router-link>
        </div>
        <div class="navlink-item">
          <q-icon :name="ionCaretForwardCircle" class="svg-icon"></q-icon>
          <router-link
            to="/explore"
            :class="{ active: $route.name === 'explore' }"
          >
            {{ $t("nav.explore") }}
          </router-link>
        </div>
        <div class="navlink-item">
          <q-icon :name="ionCaretForwardCircle" class="svg-icon"></q-icon>
          <router-link
            to="/library"
            :class="{ active: $route.name === 'library' }"
          >
            {{ $t("nav.library") }}
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import Navbar from "src/components/Navbar.vue";
import { defineComponent } from "vue";
import { isAccountLoggedIn, isLooseLoggedIn } from "src/utils/auth";
import { mapActions, mapState } from "pinia";
import pinia from "src/stores";
import useStore from "src/stores/store";
import Player from "src/components/Player.vue";
import { ionCaretForwardCircle } from "@quasar/extras/ionicons-v7";
// const store = useStore(pinia());
// console.log(useStore());

export default defineComponent({
  name: "App",
  components: {
    Player,
    // Navbar,
  },
  data() {
    return {
      // isElectron: process.env.IS_ELECTRON, // true || undefined
      userSelectNone: false,
      ionCaretForwardCircle,
    };
  },
  computed: {
    ...mapState(useStore, {
      showLyrics: "showLyrics",
      settings: "settings",
      player: "player",
      enableScrolling: "enableScrolling",
    }),
    isAccountLoggedIn() {
      return isAccountLoggedIn();
    },
    showPlayer() {
      console.log(
        "showPlayer",
        [
          "mv",
          "loginUsername",
          "login",
          "loginAccount",
          "lastfmCallback",
        ].includes(this.$route.name) === false
      );
      return (
        [
          "mv",
          "loginUsername",
          "login",
          "loginAccount",
          "lastfmCallback",
        ].includes(this.$route.name) === false
      );
    },
    enablePlayer() {
      // console.log(useStore);
      const store = useStore();
      // console.log("enablePlayer", store.player.player);
      // console.log("enablePlayer", this.player.player);
      // console.log("this.player.enabled", this.player.player.enabled);
      // console.log("this.$route", this.$route.name !== "lastfmCallback");
      return (
        this.player.player.enabled && this.$route.name !== "lastfmCallback"
      );
    },
    showNavbar() {
      return this.$route.name !== "lastfmCallback";
    },
  },
  created() {
    // if (this.isElectron) ipcRenderer(this);
    window.addEventListener("keydown", this.handleKeydown);
    this.fetchData();
  },
  methods: {
    // handleKeydown(e) {
    //   if (e.code === "Space") {
    //     if (e.target.tagName === "INPUT") return false;
    //     if (this.$route.name === "mv") return false;
    //     e.preventDefault();
    //     this.player.playOrPause();
    //   }
    // },
    ...mapActions(useStore, [
      "fetchLikedSongs",
      "fetchLikedSongsWithDetails",
      "fetchLikedPlaylist",
    ]),
    fetchData() {
      // console.log("fetchData");
      if (!isLooseLoggedIn()) return;
      // console.log("!isLooseLoggedIn");
      // fetchLikedSongs();
      // this.$store.dispatch("fetchLikedSongs");
      // this.$store.dispatch("fetchLikedSongsWithDetails");
      // this.$store.dispatch("fetchLikedPlaylist");
      // if (isAccountLoggedIn()) {
      //   this.$store.dispatch("fetchLikedAlbums");
      //   this.$store.dispatch("fetchLikedArtists");
      //   this.$store.dispatch("fetchLikedMVs");
      //   this.$store.dispatch("fetchCloudDisk");
      // }
    },
    // handleScroll() {
    //   this.$refs.scrollbar.handleScroll();
    // },
  },
});
</script>

<style>
#root {
  margin-left: 5%;
  margin-top: 0px;
  margin-right: 5%;
  margin-bottom: 120px;
  /* background: black; */
}
#app {
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
  a:link {
    color: black;
  }
  a:visited {
    color: black;
  }
  a:hover {
    color: black;
  }
  a:active {
    color: black;
  }
}
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
  text-align: center;
  /* justify-content: space-around; */
  backdrop-filter: saturate(180%) blur(30px);
  background-color: var(--color-navbar-bg);
  grid-template-columns: repeat(3, 1fr);
  .navlink-item {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    /* vertical-align: middle; */
  }
}
.q-icon {
  width: 20px;
  height: 20px;
}
</style>
