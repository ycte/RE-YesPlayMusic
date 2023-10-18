<script setup>
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Starport } from 'vue-starport'
import useStore from 'src/stores/store'
import ButtonIcon from 'src/components/ButtonIcon.vue'
import { goToListSource, hasListSource } from 'src/utils/playList'
import { formatTrackTime } from 'src/utils/common'
import SvgIcon from './SvgIcon.vue'

// import VueSlider from "vue-slider-component";
// import '@/assets/css/slider.css';
const store = useStore()
const route = useRoute()
const router = useRouter()
const { player, settings, data, showLyrics } = storeToRefs(useStore())
// console.log('>storeToRefs test:', player.value.player, settings.value)
const currentTrack = computed(() => player.value.player.currentTrack)
// console.log('>currentTrack test:', currentTrack.value)
// console.log('>store write test:', store.player.player.volume)
const volume = computed({
  get() {
    return player.value.player.volume
  },
  set(value) {
    store.player.player.volume = value
  },
})
const playing = computed(() => player.value.player.playing)
const audioSource = computed(() => {
  return player.value.player._howler?._src.includes('kuwo.cn')
    ? '音源来自酷我音乐'
    : ''
})

const toggleLyrics = store.toggleLyrics
const showToast = store.showToast
const likeATrack = store.likeATrack
function playPrevTrack() {
  player.value.player.playPrevTrack()
}
function playOrPause() {
  // console.log(
  //   "playOrPause",
  //   currentTrack,
  //   currentTrack.al && currentTrack.al.picUrl
  // );
  player.value.player.playOrPause()
}
function playNextTrack() {
  if (player.value.player.isPersonalFM)
    player.value.player.playNextFMTrack()
  else
    player.value.player.playNextTrack()

}

function goToNextTracksPage() {
  if (player.value.player.isPersonalFM)
    return
  route.name === 'next'
    ? router.go(-1)
    : router.push({ name: 'next' })
}
function hasList() {
  return hasListSource()
}
function goToList() {
  goToListSource()
}
function goToAlbum() {
  if (player.value.player.currentTrack.al.id === 0)
    return
  router.push({
    path: `/album/${player.value.player.currentTrack.al.id}`,
  })
}
function goToArtist(id) {
  router.push({ path: `/artist/${id}` })
}
function moveToFMTrash() {
  player.value.player.moveToFMTrash()
}
function switchRepeatMode() {
  player.value.player.switchRepeatMode()
}
function switchShuffle() {
  player.value.player.switchShuffle()
}
function switchReversed() {
  player.value.player.switchReversed()
}
function mute() {
  player.value.player.mute()
}
</script>

<template>
  <div class="player" @click="toggleLyrics()">
    <div class="shade">
      <div class="progress-bar" :class="{
        'nyancat': settings.nyancatStyle,
        'nyancat-stop': settings.nyancatStyle && !player.playing,
      }" @click.stop>
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
            <Starport port="cover-song" style="height:46px; width: 46px;">
              <img :src="currentTrack.al && currentTrack.al.picUrl" @click="goToAlbum">
            </Starport>


            <!-- <img v-if="showLyrics" :src="currentTrack.al && currentTrack.al.picUrl" loading="lazy" @click="goToAlbum"> -->


            <div class="track-info" :title="audioSource.value">
              <!-- TODO: @click="hasList() && goToList()" -->
              <div class="name" :class="[{ 'has-list': hasList() }]" @click="toggleLyrics()">
                {{ currentTrack.name }}
              </div>
              <div class="artist">
                <span v-for="(ar, index) in currentTrack.ar" :key="ar.id" @click="ar.id && goToArtist(ar.id)">
                  <span :class="{ ar: ar.id }"> {{ ar.name }} </span>
                  <span v-if="index !== currentTrack.ar.length - 1">,
                  </span>
                </span>
              </div>
            </div>
            <div class="like-button">
              <ButtonIcon :title="player.player.isCurrentTrackLiked
                ? $t('player.unlike')
                : $t('player.like')
                " @click="likeATrack(player.player.currentTrack.id)">
                <SvgIcon v-show="!player.player.isCurrentTrackLiked" name="heart" />
                <SvgIcon v-show="player.player.isCurrentTrackLiked" name="heart-solid" />
              </ButtonIcon>
            </div>
          </div>
          <div class="blank" />
        </div>
        <div class="middle-control-buttons">
          <div class="blank" />
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
            <ButtonIcon class="play" :title="$t(player.player.playing ? 'player.pause' : 'player.play')"
              @click="playOrPause">
              <SvgIcon v-show="player.player.playing" name="pause" class="svg-icon" />
              <SvgIcon v-show="!player.player.playing" name="play" class="svg-icon" />
            </ButtonIcon>
            <ButtonIcon :title="$t('player.next')" @click="playNextTrack">
              <SvgIcon name="forward" class="svg-icon" />
            </ButtonIcon>
          </div>
          <!-- <div class="blank"></div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.player {
  box-shadow: 10px 10px 10px #ccc;
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  height: 60px;
  backdrop-filter: saturate(180%) blur(30px);
  background-color: rgba(255, 255, 255, 0.87);
  // background-color: var(--color-navbar-bg);
  border-radius: 15px;
  margin-left: 3%;
  margin-right: 3%;
  margin-bottom: 56px;
}

@supports (-moz-appearance: none) {
  .player {
    background-color: var(--color-body-bg);
  }
}

// .shade {
//   position: absolute;
//   top: 0;
//   height: calc(100% + 10px);
//   width: 100%;
//   background: transparent;
//   // display: flex;
//   justify-content: center;
//   align-items: center;
// }
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
    margin-top: 10px;
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
