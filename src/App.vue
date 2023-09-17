<template>
  <div id="app">
    <router-view id="root" />
    <!-- TODO: transition -->
    <Player v-if="enablePlayer" v-show="showPlayer" ref="player" />
    <NavBarButton v-show="showNavbar" />
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { isAccountLoggedIn, isLooseLoggedIn } from "src/utils/auth";
import { mapActions, mapState } from "pinia";
import useStore from "src/stores/store";
import Player from "src/components/Player.vue";
import NavBarButton from "./components/NavBarButton.vue";

export default defineComponent({
  name: "App",
  components: {
    Player,
    NavBarButton,
  },
  data() {
    return {
      // isElectron: process.env.IS_ELECTRON, // true || undefined
      userSelectNone: false,
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
      // console.log(
      //   "showPlayer",
      //   [
      //     "mv",
      //     "loginUsername",
      //     "login",
      //     "loginAccount",
      //     "lastfmCallback",
      //   ].includes(this.$route.name) === false
      // );
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
  width: 95%;
  margin-left: 5%;
  margin-right: 5%;
  margin-bottom: 120px;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
  /* margin-top: 60px; */
}
/* .container {
  width: 400px;
  height: 300px;
  margin: 30px auto;
  box-shadow: 0 0 2px gray;
  padding: 20px;
  overflow: scroll;
}

.scroll {
  width: 1400px;
  height: 1300px;
}

.container::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

.container::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom right, #4d7fff 0%, #1a56ff 100%);
  border-radius: 5px;
}

.container::-webkit-scrollbar-track {
  background-color: #ddd;
  border: 1px solid #ccc;
}

.container::-webkit-scrollbar-button {
  background-color: #4d7fff;
  border-radius: 5px;
}

.container::-webkit-scrollbar-button:hover {
  background-color: #999999;
} */

.q-icon {
  width: 20px;
  height: 20px;
}
</style>
