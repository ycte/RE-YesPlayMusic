<template>
  <div class="player" @click="toggleLyrics">
    <div
      class="progress-bar"
      :class="{
        nyancat: settings.nyancatStyle,
        'nyancat-stop': settings.nyancatStyle && !player.playing,
      }"
      @click.stop
    >
      <!-- <vue-slider
        v-model="player.progress"
        :min="0"
        :max="player.currentTrackDuration"
        :interval="1"
        :drag-on-click="true"
        :duration="0"
        :dot-size="12"
        :height="2"
        :tooltip-formatter="formatTrackTime"
        :lazy="true"
        :silent="true"
      ></vue-slider> -->
    </div>
    <div class="controls">
      <div class="playing">
        <div class="container" @click.stop>
          <img
            :src="currentTrack.al && currentTrack.al.picUrl"
            loading="lazy"
            @click="goToAlbum"
          />
          <div class="track-info" :title="audioSource">
            <div
              :class="['name', { 'has-list': hasList() }]"
              @click="hasList() && goToList()"
            >
              {{ currentTrack.name }}
            </div>
            <div class="artist">
              <span
                v-for="(ar, index) in currentTrack.ar"
                :key="ar.id"
                @click="ar.id && goToArtist(ar.id)"
              >
                <span :class="{ ar: ar.id }"> {{ ar.name }} </span
                ><span v-if="index !== currentTrack.ar.length - 1">, </span>
              </span>
            </div>
          </div>
          <div class="like-button">
            <button-icon
              :title="
                player.player.isCurrentTrackLiked
                  ? $t('player.unlike')
                  : $t('player.like')
              "
              @click="likeATrack(player.player.currentTrack.id)"
            >
              <q-icon
                name="svguse:icons.svg#heart"
                v-show="!player.player.isCurrentTrackLiked"
              />
              <q-icon
                name="svguse:icons.svg#heart-solid"
                v-show="player.player.isCurrentTrackLiked"
              />
            </button-icon>
          </div>
        </div>
        <div class="blank"></div>
      </div>
      <div class="middle-control-buttons">
        <div class="blank"></div>
        <div class="container" @click.stop>
          <!-- <button-icon
            v-show="!player.isPersonalFM"
            :title="$t('player.previous')"
            @click="playPrevTrack"
          >
            <q-icon name="svguse:pervious.svg#" class="svg-icon"></q-icon>

          </button-icon> -->
          <!-- <button-icon
            v-show="player.isPersonalFM"
            title="不喜欢"
            @click="moveToFMTrash"
            ><svg-icon icon-class="thumbs-down"
          /></button-icon> -->
          <button-icon
            class="play"
            :title="$t(player.playing ? 'player.pause' : 'player.play')"
            @click="playOrPause"
          >
            <q-icon
              :name="ionPause"
              v-show="player.player.playing"
              class="svg-icon"
            ></q-icon>
            <q-icon
              :name="ionCaretForwardOutline"
              v-show="!player.player.playing"
              class="svg-icon"
            ></q-icon>
            <!-- <svg-icon :icon-class="player.playing ? 'pause' : 'play'" /> -->
            <!-- go -->
          </button-icon>
          <button-icon :title="$t('player.next')" @click="playNextTrack">
            <q-icon :name="ionPlayForward" class="svg-icon"></q-icon>
          </button-icon>
        </div>
        <!-- <div class="blank"></div> -->
      </div>
      <!-- <div class="right-control-buttons">
        <div class="blank"></div>
        <div class="container" @click.stop>
          <button-icon
            :title="$t('player.nextUp')"
            :class="{
              active: $route.name === 'next',
              disabled: player.isPersonalFM,
            }"
            @click="goToNextTracksPage"
            ><svg-icon icon-class="list"
          /></button-icon>
          <button-icon
            :class="{
              active: player.repeatMode !== 'off',
              disabled: player.isPersonalFM,
            }"
            :title="
              player.repeatMode === 'one'
                ? $t('player.repeatTrack')
                : $t('player.repeat')
            "
            @click="switchRepeatMode"
          >
            <svg-icon
              v-show="player.repeatMode !== 'one'"
              icon-class="repeat"
            />
            <svg-icon
              v-show="player.repeatMode === 'one'"
              icon-class="repeat-1"
            />
          </button-icon>
          <button-icon
            :class="{ active: player.shuffle, disabled: player.isPersonalFM }"
            :title="$t('player.shuffle')"
            @click="switchShuffle"
            ><svg-icon icon-class="shuffle"
          /></button-icon>
          <button-icon
            v-if="settings.enableReversedMode"
            :class="{ active: player.reversed, disabled: player.isPersonalFM }"
            :title="$t('player.reversed')"
            @click="switchReversed"
            ><svg-icon icon-class="sort-up"
          /></button-icon>
          <div class="volume-control">
            <button-icon :title="$t('player.mute')" @click="mute">
              <svg-icon v-show="volume > 0.5" icon-class="volume" />
              <svg-icon v-show="volume === 0" icon-class="volume-mute" />
              <svg-icon
                v-show="volume <= 0.5 && volume !== 0"
                icon-class="volume-half"
              />
            </button-icon>
            <div class="volume-bar">
              <vue-slider
                v-model="volume"
                :min="0"
                :max="1"
                :interval="0.01"
                :drag-on-click="true"
                :duration="0"
                tooltip="none"
                :dot-size="12"
              ></vue-slider>
            </div>
          </div>

          <button-icon
            class="lyrics-button"
            title="歌词"
            style="margin-left: 12px"
            @click="toggleLyrics"
            ><svg-icon icon-class="arrow-up"
          /></button-icon>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "pinia";
// import '@/assets/css/slider.css';
import pinia from "src/stores";
import useStore from "src/stores/store";
// const store = useStore(pinia());
import ButtonIcon from "src/components/ButtonIcon.vue";
// import VueSlider from "vue-slider-component";
import { goToListSource, hasListSource } from "src/utils/playList";
import { formatTrackTime } from "src/utils/common";
import {
  ionPlay,
  ionPause,
  ionCaretForwardOutline,
  ionChevronForwardOutline,
  ionPlaySkipForwardOutline,
  ionPlayForward,
} from "@quasar/extras/ionicons-v7";

export default {
  name: "PlayerView",
  components: {
    ButtonIcon,
    // VueSlider,
  },
  data() {
    return {
      ionPlay,
      ionPause,
      ionCaretForwardOutline,
      ionChevronForwardOutline,
      ionPlaySkipForwardOutline,
      ionPlayForward,
    };
  },
  computed: {
    ...mapState(useStore, ["player", "settings", "data"]),
    currentTrack() {
      return this.player.player.currentTrack;
    },
    volume: {
      get() {
        return this.player.player.volume;
      },
      set(value) {
        this.player.player.volume = value;
      },
    },
    playing() {
      return this.player.player.playing;
    },
    audioSource() {
      return this.player.player._howler?._src.includes("kuwo.cn")
        ? "音源来自酷我音乐"
        : "";
    },
  },
  methods: {
    // ...mapMutations(["toggleLyrics"]),
    ...mapActions(useStore, ["showToast", "likeATrack"]),
    playPrevTrack() {
      this.player.player.playPrevTrack();
    },
    playOrPause() {
      // console.log(
      //   "playOrPause",
      //   this.currentTrack,
      //   this.currentTrack.al && this.currentTrack.al.picUrl
      // );
      this.player.player.playOrPause();
    },
    playNextTrack() {
      if (this.player.player.isPersonalFM) {
        this.player.player.playNextFMTrack();
      } else {
        this.player.player.playNextTrack();
      }
    },
    goToNextTracksPage() {
      if (this.player.player.isPersonalFM) return;
      this.$route.name === "next"
        ? this.$router.go(-1)
        : this.$router.push({ name: "next" });
    },
    formatTrackTime(value) {
      return formatTrackTime(value);
    },
    hasList() {
      return hasListSource();
    },
    goToList() {
      goToListSource();
    },
    goToAlbum() {
      if (this.player.player.currentTrack.al.id === 0) return;
      this.$router.push({
        path: "/album/" + this.player.player.currentTrack.al.id,
      });
    },
    goToArtist(id) {
      this.$router.push({ path: "/artist/" + id });
    },
    moveToFMTrash() {
      this.player.player.moveToFMTrash();
    },
    switchRepeatMode() {
      this.player.player.switchRepeatMode();
    },
    switchShuffle() {
      this.player.player.switchShuffle();
    },
    switchReversed() {
      this.player.player.switchReversed();
    },
    mute() {
      this.player.player.mute();
    },
  },
};
</script>

<style lang="scss" scoped>
.player {
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  height: 60px;
  backdrop-filter: saturate(180%) blur(30px);
  // background-color: rgba(255, 255, 255, 0.86);
  background-color: var(--color-navbar-bg);
  border-radius: 15px;
  margin-left: 3%;
  margin-right: 3%;
  margin-bottom: 12px;
  z-index: 100;
}

@supports (-moz-appearance: none) {
  .player {
    background-color: var(--color-body-bg);
  }
}

.progress-bar {
  margin-top: -6px;
  margin-bottom: -6px;
  width: 100%;
}

.controls {
  display: grid;
  // grid-template-columns: repeat(2, 1fr);
  grid-template-columns: 7fr 3fr;
  // grid-template-columns: repeat(autofill, minmax(10px, 1fr));
  height: 100%;
  // padding: {
  //   right: 1vw;
  //   left: 1vw;
  // }
}

@media (max-width: 375px) {
  // .controls {
  //   padding: 0 5vw;
  // }
}

.blank {
  flex-grow: 1;
}

.playing {
  display: flex;
}

.playing .container {
  display: flex;
  margin-top: 6px;
  margin-left: 8px;
  align-items: center;
  img {
    height: 46px;
    width: 46px;
    border-radius: 10px;
    box-shadow: 0 6px 8px -2px rgba(0, 0, 0, 0.16);
    cursor: pointer;
    user-select: none;
  }
  .track-info {
    height: 46px;
    // width: 100px;
    margin-left: 12px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    .name {
      font-weight: 600;
      font-size: 16px;
      opacity: 0.88;
      color: var(--color-text);
      margin-bottom: 4px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
      word-break: break-all;
    }
    .has-list {
      cursor: pointer;
      &:hover {
        text-decoration: underline;
      }
    }
    .artist {
      font-size: 12px;
      opacity: 0.58;
      color: var(--color-text);
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
      word-break: break-all;
      span.ar {
        cursor: pointer;
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
  .like-button {
    margin-left: 12px;
  }
}

.middle-control-buttons {
  display: flex;
}

.middle-control-buttons .container {
  // flex: 1;
  display: flex;
  margin-top: 6px;
  justify-content: flex-end;
  align-items: center;
  padding: 0 8px;
  .button-icon {
    // margin: 0 8px;
    q-icon {
      width: 24px;
      height: 24px;
    }
  }
  .svg-icon {
    width: 24px;
    height: 24px;
  }
  .play {
    height: 42px;
    width: 42px;
    .svg-icon {
      width: 24px;
      height: 24px;
    }
  }
}

// .right-control-buttons {
//   display: flex;
// }

// .right-control-buttons .container {
//   display: flex;
//   justify-content: flex-end;
//   align-items: center;
//   .expand {
//     margin-left: 24px;
//     .svg-icon {
//       height: 24px;
//       width: 24px;
//     }
//   }
//   .active .svg-icon {
//     color: var(--color-primary);
//   }
//   .volume-control {
//     margin-left: 4px;
//     display: flex;
//     align-items: center;
//     .volume-bar {
//       width: 84px;
//     }
//   }
// }

.button-icon.disabled {
  cursor: default;
  opacity: 0.38;
  &:hover {
    background: none;
  }
  &:active {
    transform: unset;
  }
}
</style>
