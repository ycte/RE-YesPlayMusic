<template>
  <!-- TODO: @click="clickCoverToPlay ? play() : goTo()" -->
  <div
    class="cover"
    :class="{ 'cover-hover': coverHover }"
    @mouseover="focus = true"
    @mouseleave="focus = false"
    @click="clickCoverToPlay ? play() : play()"
  >
    <div class="cover-container">
      <div class="shade">
        <button
          v-show="focus"
          class="play-button"
          :style="playButtonStyles"
          @click.stop="play()"
        >
          <!-- <svg-icon icon-class="play" /> -->
          <!-- <svg>
            <use xlink:href="play.svg"></use>
          </svg> -->
          <!-- <q-icon name="svguse:play.svg"></q-icon> -->
          <q-icon class="svg-icon">
            <svg
              aria-hidden="true"
              focusable="false"
              data-prefix="fas"
              data-icon="play"
              class="svg-inline--fa fa-play fa-w-14"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
            >
              <path
                fill="currentColor"
                d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z"
              ></path>
            </svg>
          </q-icon>
        </button>
      </div>
      <img :src="imageUrl" :style="imageStyles" loading="lazy" />
      <transition v-if="coverHover || alwaysShowShadow" name="fade">
        <div
          v-show="focus || alwaysShowShadow"
          class="shadow"
          :style="shadowStyles"
        ></div>
      </transition>
    </div>
  </div>
</template>

<script>
import { useStore } from "src/stores/store.js";
import { mapWritableState, mapState } from "pinia";
import pinia from "src/stores";
export default {
  name: "aCover",
  props: {
    id: { type: Number, required: true },
    type: { type: String, required: true },
    imageUrl: { type: String, required: true },
    fixedSize: { type: Number, default: 0 },
    playButtonSize: { type: Number, default: 22 },
    coverHover: { type: Boolean, default: true },
    alwaysShowPlayButton: { type: Boolean, default: true },
    alwaysShowShadow: { type: Boolean, default: false },
    clickCoverToPlay: { type: Boolean, default: false },
    shadowMargin: { type: Number, default: 12 },
    radius: { type: Number, default: 12 },
  },
  data() {
    return {
      focus: false,
    };
  },
  computed: {
    ...mapState(useStore, ["player"]),
    imageStyles() {
      let styles = {};
      if (this.fixedSize !== 0) {
        styles.width = this.fixedSize + "px";
        styles.height = this.fixedSize + "px";
      }
      if (this.type === "artist") styles.borderRadius = "50%";
      return styles;
    },
    playButtonStyles() {
      let styles = {};
      styles.width = this.playButtonSize + "%";
      styles.height = this.playButtonSize + "%";
      return styles;
    },
    shadowStyles() {
      let styles = {};
      styles.backgroundImage = `url(${this.imageUrl})`;
      if (this.type === "artist") styles.borderRadius = "50%";
      return styles;
    },
  },
  methods: {
    play() {
      const store = useStore(pinia());
      // console.log(store.player);
      // console.log("play", this.player);
      const player = this.player.player;
      // console.log(player.playAlbumByID);
      const playActions = {
        album: player.playAlbumByID,
        playlist: player.playPlaylistByID,
        artist: player.playArtistByID,
      };
      // console.log(playActions);
      playActions[this.type].bind(player)(this.id);
      // console.log("playing", this.player);
    },
    goTo() {
      this.$router.push({ name: this.type, params: { id: this.id } });
    },
  },
};
</script>

<style lang="scss" scoped>
.cover {
  position: relative;
  transition: transform 0.3s;
  height: 150px;
}
.cover-container {
  position: relative;
}
img {
  border-radius: 0.75em;
  // width: 100%;
  width: 150px;
  user-select: none;
  aspect-ratio: 1 / 1;
  border: 1px solid rgba(0, 0, 0, 0.04);
}

.cover-hover {
  &:hover {
    cursor: pointer;
    /* transform: scale(1.02); */
  }
}

.shade {
  position: absolute;
  top: 0;
  height: calc(100% - 3px);
  width: 100%;
  background: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
}
.play-button {
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  backdrop-filter: blur(8px);
  background: rgba(255, 255, 255, 0.14);
  border: 1px solid rgba(255, 255, 255, 0.08);
  height: 22%;
  width: 22%;
  border-radius: 50%;
  cursor: default;
  transition: 0.2s;
  .svg-icon {
    height: 44%;
    margin: {
      left: 4px;
    }
  }
  &:hover {
    background: rgba(255, 255, 255, 0.28);
  }
  &:active {
    transform: scale(0.94);
  }
}

.shadow {
  position: absolute;
  top: 12px;
  height: 100%;
  width: 100%;
  filter: blur(16px) opacity(0.6);
  transform: scale(0.92, 0.96);
  z-index: -1;
  background-size: cover;
  border-radius: 0.75em;
  aspect-ratio: 1 / 1;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
