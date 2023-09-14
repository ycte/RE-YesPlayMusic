<template>
  <router-view id="root" />
</template>

<script>
import { defineComponent } from "vue";
import { isAccountLoggedIn, isLooseLoggedIn } from "src/utils/auth";
import { mapActions } from "pinia";
import { useStore } from "src/stores/store";

export default defineComponent({
  name: "App",
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
