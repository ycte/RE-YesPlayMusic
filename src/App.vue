<template>
  <router-view id="root" />
  <!-- <transition name="slide-up"> -->
  <Player v-if="enablePlayer" v-show="showPlayer" ref="player" />
  <!-- </transition> -->
</template>

<script>
import { defineComponent } from "vue";
import { isAccountLoggedIn, isLooseLoggedIn } from "src/utils/auth";
import { mapActions, mapState } from "pinia";
import pinia from "src/stores";
import useStore from "src/stores/store";
import Player from "src/components/Player.vue";
// const store = useStore(pinia());
// console.log(useStore());

export default defineComponent({
  name: "App",
  components: {
    Player,
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
      console.log("enablePlayer", store.player.player);
      console.log("enablePlayer", this.player.player);
      console.log("this.player.enabled", this.player.player.enabled);
      console.log("this.$route", this.$route.name !== "lastfmCallback");
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
  margin-left: 7%;
  margin-top: 7%;
  margin-right: 7%;
}
</style>
