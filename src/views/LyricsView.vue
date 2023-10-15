<script setup>
// The lyrics page of Apple Music is so gorgeous, so I copy the design.
// Some of the codes are from https://github.com/sl1673495/vue-netease-music

// import { mapState, mapMutations, mapActions } from 'vuex';
import { computed, onBeforeUnmount, onMounted, onUnmounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { Starport } from 'vue-starport'

// import 'time'
// import VueSlider from 'vue-slider-component'
import Color from 'color'
import * as Vibrant from 'node-vibrant/dist/vibrant.worker.min.js'
import useStore from '../stores/store.js'
import { formatTrackTime } from '@/utils/common'
import { getLyric } from '@/api/track'
import { lyricParser } from '@/utils/lyrics'
import ButtonIcon from '@/components/ButtonIcon.vue'
import { isAccountLoggedIn } from '@/utils/auth'
import { getListSourcePath, hasListSource } from '@/utils/playList'
import locale from '@/locale'

const lyricsContainer = ref(null)
const lyricsInterval = ref(null)
const lyric = ref([])
const tlyric = ref([])
const romalyric = ref([])
const lyricType = ref('translation') // or 'romaPronunciation'
const highlightLyricIndex = ref(-1)
const minimize = ref(true)
const background = ref('')
const date = ref(formatTime(new Date()))
const timer = ref(null)

const store = useStore()
const { player, settings, showLyrics } = storeToRefs(useStore())
const currentTrack = computed(() => player.value.player.currentTrack)
const volume = computed({
  get() {
    return player.value.player.volume
  },
  set(value) {
    player.value.player.volume = value
  },
})
const imageUrl = computed(() => {
  return `${player.value.player.currentTrack?.al?.picUrl}?param=1024y1024`
})
const bgImageUrl = computed(() => {
  return `${player.value.player.currentTrack?.al?.picUrl}?param=512y512`
})
const isShowLyricTypeSwitch = computed(() => {
  return romalyric.value.length > 0 && tlyric.value.length > 0
})
const lyricWithTranslation = computed(() => {
  let ret = []
  // 空内容的去除
  const lyricFiltered = lyric.value.filter(({ content }) =>
    Boolean(content),
  )
  // content统一转换数组形式
  if (lyricFiltered.length) {
    lyricFiltered.forEach((l) => {
      const { rawTime, time, content } = l
      const lyricItem = { time, content, contents: [content] }
      const sameTimeTLyric = tlyric.value.find(
        ({ rawTime: tLyricRawTime }) => tLyricRawTime === rawTime,
      )
      if (sameTimeTLyric) {
        const { content: tLyricContent } = sameTimeTLyric
        if (content)
          lyricItem.contents.push(tLyricContent)

      }
      ret.push(lyricItem)
    })
  }
  else {
    ret = lyricFiltered.map(({ time, content }) => ({
      time,
      content,
      contents: [content],
    }))
  }
  return ret
})
const lyricWithRomaPronunciation = computed(() => {
  let ret = []
  // 空内容的去除
  const lyricFiltered = lyric.value.filter(({ content }) =>
    Boolean(content),
  )
  // content统一转换数组形式
  if (lyricFiltered.length) {
    lyricFiltered.forEach((l) => {
      const { rawTime, time, content } = l
      const lyricItem = { time, content, contents: [content] }
      const sameTimeRomaLyric = romalyric.value.find(
        ({ rawTime: tLyricRawTime }) => tLyricRawTime === rawTime,
      )
      if (sameTimeRomaLyric) {
        const { content: romaLyricContent } = sameTimeRomaLyric
        if (content)
          lyricItem.contents.push(romaLyricContent)

      }
      ret.push(lyricItem)
    })
  }
  else {
    ret = lyricFiltered.map(({ time, content }) => ({
      time,
      content,
      contents: [content],
    }))
  }
  return ret
})
const lyricToShow = computed(
  () => lyricType.value === 'translation'
    ? lyricWithTranslation.value
    : lyricWithRomaPronunciation.value)
const lyricFontSize = computed(() => {
  return {
    fontSize: `${settings.value.lyricFontSize || 28}px`,
  }
})
const noLyric = computed(() => lyric.value.length === 0)
const artist = computed(() => {
  return currentTrack.value?.ar
    ? currentTrack.value.ar[0]
    : { id: 0, name: 'unknown' }
})
const album = computed(() =>
  currentTrack.value?.al || { id: 0, name: 'unknown' })
const theme = computed(() =>
  settings.value.lyricsBackground === true ? 'dark' : 'auto')

watch(currentTrack, () => {
  getLyric()
  getCoverColor()
})

watch(showLyrics, (show) => {
  if (show) {
    setLyricsInterval()
    store.enableScrolling = false
  }
  else {
    clearInterval(lyricsInterval)
    store.enableScrolling = true
  }
})

// TODO: 生命周期
// TODO: timer
onMounted(() => {
  getTheLyric()
  getCoverColor()
  initDate()
})
onBeforeUnmount(() => {
  if (timer.value)
    clearInterval(timer.value)
})
onUnmounted(() => {
  clearInterval(lyricsInterval.value)
})
// beforeDestroy: function () {
//   if (this.timer) {
//     clearInterval(this.timer);
//   }
// },
// destroyed() {
//   clearInterval(this.lyricsInterval);
// },


const toggleLyrics = store.toggleLyrics
const updateModal = store.updateModal
const likeATrack = store.likeATrack
// TODO: this
function initDate() {
  // var _this = this;
  clearInterval(timer.value)
  timer.value = setInterval(() => {
    date.value = formatTime(new Date())
    // console.log(date.value)
  }, 1000)
}
function formatTime(value) {
  const hour = value.getHours().toString()
  const minute = value.getMinutes().toString()
  const second = value.getSeconds().toString()
  return (
    `${hour.padStart(2, '0')
    }:${minute.padStart(2, '0')
    }:${second.padStart(2, '0')}`
  )
}
function addToPlaylist() {
  if (!isAccountLoggedIn()) {
    showToast(locale.t('toast.needToLogin'))
    return
  }
  store.fetchLikedPlaylist()
  updateModal({
    modalName: 'addTrackToPlaylistModal',
    key: 'show',
    value: true,
  })
  updateModal({
    modalName: 'addTrackToPlaylistModal',
    key: 'selectedTrackID',
    value: currentTrack.value?.id,
  })
}
function playPrevTrack() {
  player.value.player.playPrevTrack()
}
function playOrPause() {
  player.value.player.playOrPause()
}
function playNextTrack() {
  if (player.value.player.isPersonalFM)
    player.value.player.playNextFMTrack()
  else
    player.value.player.playNextTrack()

}

function getTheLyric() {
  if (!currentTrack.value.id)
    return
  return getLyric(currentTrack.value.id).then((data) => {
    if (!data?.lrc?.lyric) {
      lyric.value = []
      tlyric.value = []
      romalyric.value = []
      return false
    }
    else {
      let { lyric: lyric1, tlyric: tlyric1, romalyric: romalyric1 }
        = lyricParser(data)
      lyric1 = lyric1.filter(
        l => !/^作(词|曲)\s*(:|：)\s*无$/.exec(l.content),
      )
      const includeAM =
        lyric1.length <= 10 &&
        lyric1.map(l => l.content).includes('纯音乐，请欣赏')
      if (includeAM) {
        const reg = /^作(词|曲)\s*(:|：)\s*/
        const author = currentTrack.value?.ar[0]?.name
        lyric1 = lyric1.filter((l) => {
          const regExpArr = l.content.match(reg)
          return (
            !regExpArr || l.content.replace(regExpArr[0], '') !== author
          )
        })
      }
      if (lyric1 === 1 && includeAM) {
        lyric.value = []
        tlyric.value = []
        romalyric.value = []
        return false
      }
      else {
        lyric.value = lyric1
        tlyric.value = tlyric1
        romalyric.value = romalyric1
        if (tlyric.value.length * romalyric.value.length > 0) {
          lyricType.value = 'translation'
        }
        else {
          lyricType.value =
            lyric.value.length > 0 ? 'translation' : 'romaPronunciation'
        }
        return true
      }
    }
  })
}
function switchLyricType() {
  lyricType.value =
    lyricType.value === 'translation'
      ? 'romaPronunciation' : 'translation'
}
function formatTrackTimeFun(value) {
  return formatTrackTime(value)
}
function clickLyricLine(value, startPlay = false) {
  // TODO: 双击选择还会选中文字，考虑搞个右键菜单复制歌词
  let jumpFlag = false
  lyric.value.filter((item) => {
    if (item.content === '纯音乐，请欣赏')
      jumpFlag = true
    return undefined
  })
  if (window.getSelection().toString().length === 0 && !jumpFlag)
    player.value.player.seek(value)

  if (startPlay === true)
    player.value.player.play()

}
function setLyricsInterval() {
  lyricsInterval.value = setInterval(() => {
    const progress = player.value.player.seek(null, false) ?? 0
    const oldHighlightLyricIndex = highlightLyricIndex.value
    highlightLyricIndex.value = lyric.value.findIndex((l, index) => {
      const nextLyric = lyric.value[index + 1]
      return (
        progress >= l.time && (nextLyric ? progress < nextLyric.time : true)
      )
    })
    if (oldHighlightLyricIndex !== highlightLyricIndex.value) {
      const el = document.getElementById(`line${highlightLyricIndex.value}`)
      if (el) {
        el.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        })
      }
    }
  }, 50)
}
function moveToFMTrash() {
  player.value.player.moveToFMTrash()
}
function switchRepeatMode() {
  player.value.player.switchRepeatMode()
}
function switchShuffle() {
  player.value.switchShuffle()
}
function getCoverColor() {
  if (settings.value.lyricsBackground !== true)
    return
  const cover = `${currentTrack.value.al?.picUrl}?param=256y256`
  Vibrant.from(cover, { colorCount: 1 })
    .getPalette()
    .then((palette) => {
      const originColor = Color.rgb(palette.DarkMuted._rgb)
      const color = originColor.darken(0.1).rgb().string()
      const color2 = originColor.lighten(0.28).rotate(-30).rgb().string()
      background.value =
        `linear-gradient(to top left, ${color}, ${color2})`
    })
}
function hasList() {
  return hasListSource()
}
function getListPath() {
  return getListSourcePath()
}
function mute() {
  player.value.player.mute()
}
</script>

<template>
  <span>lyrics</span>

  <!-- <h1>{{ timer }}</h1>
  <h1>{{ date }}</h1> -->
  <!-- <transition name="slide-up" v-show="true"> -->
  <div class="lyrics-page" :class="{ 'no-lyric': noLyric }" :data-theme="theme">
    <!-- <div v-if="(settings.lyricsBackground === 'blur')
        | (settings.lyricsBackground === 'dynamic')" class="lyrics-background"
        :class="{ 'dynamic-background': settings.lyricsBackground === 'dynamic' }">
        <div class="top-right" :style="{ backgroundImage: `url(${bgImageUrl})` }" />
        <div class="bottom-left" :style="{ backgroundImage: `url(${bgImageUrl})` }" />
      </div> -->
    <div v-if="settings.lyricsBackground === true" class="gradient-background" :style="{ background }" />

    <!-- <div class="left-side">
        <div> -->
    <!-- <div v-if="settings.showLyricsTime" class="date">
            {{ date }}
          </div> -->
    <div class="cover">
      <div id="lyrics-cover" class="cover-container">
        <Starport port="cover-song" style="width:100px;height:100px">
          <img :src="imageUrl">
        </Starport>
        <div class="shadow" :style="{ backgroundImage: `url(${imageUrl})` }" />
      </div>
    </div>
    <!-- <div class="controls">
            <div class="top-part">
              <div class="track-info">
                <div class="title" :title="currentTrack.name">
                  <router-link v-if="hasList()" :to="`${getListPath()}`" @click="toggleLyrics">{{ currentTrack.name
                  }}
                  </router-link> 
                  <span v-else>
                    {{ currentTrack.name }}
                  </span>
                </div>
                <div class="subtitle">
                  <router-link v-if="artist.id !== 0" :to="`/artist/${artist.id}`" @click="toggleLyrics">{{
                    artist.name }}
                  </router-link>
                  <span v-else>
                    {{ artist.name }}
                  </span>
                  <span v-if="album.id !== 0">
                    -
                    <router-link :to="`/album/${album.id}`" :title="album.name" @click="toggleLyrics">{{ album.name
                    }}
                    </router-link>
                  </span>
                </div>
              </div>
              <div class="top-right">
                <div class="volume-control">
                  <ButtonIcon :title="$t('player.mute')" @click="mute">
                    <svg-icon v-show="volume > 0.5" icon-class="volume" />
                    <svg-icon v-show="volume === 0" icon-class="volume-mute" />
                    <svg-icon v-show="volume <= 0.5 && volume !== 0" icon-class="volume-half" />
                  </ButtonIcon>
                  TODO: vue-slider
                  <div class="volume-bar">
                    <vue-slider v-model="volume" :min="0" :max="1" :interval="0.01" :drag-on-click="true" :duration="0"
                      tooltip="none" :dot-size="12"></vue-slider>
                  </div>
                </div>
                <div class="buttons">
                  <ButtonIcon :title="$t('player.like')" @click="likeATrack(player.currentTrack.id)">
                    <svg-icon :icon-class="player.isCurrentTrackLiked
                      ? 'heart-solid' : 'heart'" />
                  </ButtonIcon>
                  <ButtonIcon :title="$t('contextMenu.addToPlaylist')" @click="addToPlaylist">
                    <svg-icon icon-class="plus" />
                  </ButtonIcon>
                  TODO: open menu
                  <ButtonIcon @click="openMenu" title="Menu">
                    <svg-icon icon-class="more" />
                  </ButtonIcon>
                </div>
              </div>
            </div>
            <div class="progress-bar">
              <span>{{ formatTrackTimeFun(player.progress) || '0:00' }}</span>
              TODO:
              <div class="slider">
                <vue-slider v-model="player.progress" :min="0" :max="player.currentTrackDuration" :interval="1"
                  :drag-on-click="true" :duration="0" :dot-size="12" :height="2" :tooltip-formatter="formatTrackTimeFun"
                  :lazy="true" :silent="true"></vue-slider>
              </div>
              <span>{{ formatTrackTimeFun(player.currentTrackDuration) }}</span>
            </div>
            <div class="media-controls">
              TODO:
              <ButtonIcon v-show="!player.isPersonalFM" :title="player.repeatMode === 'one'
                ? $t('player.repeatTrack')
                : $t('player.repeat')
                " :class="{ active: player.repeatMode !== 'off' }" @<i class="fab fa-clipboard-check"></i>="switchRepeatMode">
                <svg-icon v-show="player.repeatMode !== 'one'" icon-class="repeat" />
                <svg-icon v-show="player.repeatMode === 'one'" icon-class="repeat-1" />
              </ButtonIcon>
              <div class="middle">
                <ButtonIcon v-show="!player.isPersonalFM" :title="$t('player.previous')" @click="playPrevTrack">
                  <svg-icon icon-class="previous" />
                </ButtonIcon>
                <ButtonIcon v-show="player.isPersonalFM" title="不喜欢" @click="moveToFMTrash">
                  <svg-icon icon-class="thumbs-down" />
                </ButtonIcon>
                <ButtonIcon id="play" :title="$t(player.playing ? 'player.pause' : 'player.play')" @click="playOrPause">
                  <svg-icon :icon-class="player.playing ? 'pause' : 'play'" />
                </ButtonIcon>
                <ButtonIcon :title="$t('player.next')" @click="playNextTrack">
                  <svg-icon icon-class="next" />
                </ButtonIcon>
              </div>
              <ButtonIcon v-show="!player.isPersonalFM" :title="$t('player.shuffle')" :class="{ active: player.shuffle }"
                @click="switchShuffle">
                <svg-icon icon-class="shuffle" />
              </ButtonIcon>
              <ButtonIcon v-show="isShowLyricTypeSwitch
                && $store.state.settings.showLyricsTranslation
                && lyricType === 'translation'" :title="$t('player.translationLyric')" @click="switchLyricType">
                <span class="lyric-switch-icon">译</span>
              </ButtonIcon>
              <ButtonIcon v-show="isShowLyricTypeSwitch
                && $store.state.settings.showLyricsTranslation
                && lyricType === 'romaPronunciation'
                " :title="$t('player.PronunciationLyric')" @click="switchLyricType">
                <span class="lyric-switch-icon">音</span>
              </ButtonIcon>
            </div>
          </div> -->
    <!-- </div> -->
    <!-- </div> -->
    <!-- <div class="right-side">
        <transition name="slide-fade">
          <div v-show="!noLyric" ref="lyricsContainer" class="lyrics-container" :style="lyricFontSize">
            <div id="line-1" class="line"></div>
            <div v-for="(line, index) in lyricToShow" :id="`line${index}`" :key="index" class="line" :class="{
              highlight: highlightLyricIndex === index,
            }" @click="clickLyricLine(line.time)" @dblclick="clickLyricLine(line.time, true)">
              <div class="content">
                <span v-if="line.contents[0]">{{ line.contents[0] }}</span>
                <br />
                <span v-if="line.contents[1] 
                  && $store.state.settings.showLyricsTranslation
                  " class="translation">{{ line.contents[1] }}</span>
              </div>
            </div>
          </div>
        </transition>
      </div> -->
    <div class="close-button" @click="toggleLyrics">
      <button>
        <svg-icon icon-class="arrow-down" />
      </button>
    </div>
  </div>
  <!-- </transition> -->
</template>

<style lang="scss" scoped>
.lyrics-page {
  position: fixed;
  width: 100vh;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: 200;
  text-align: center;
  background: var(--color-body-bg);
  // display: flex;
  // clip: rect(auto, auto, auto, auto);
}

.lyrics-background {
  --contrast-lyrics-background: 75%;
  --brightness-lyrics-background: 150%;
}

[data-theme="dark"] .lyrics-background {
  --contrast-lyrics-background: 125%;
  --brightness-lyrics-background: 50%;
}

.lyrics-background {
  filter: blur(50px) contrast(var(--contrast-lyrics-background)) brightness(var(--brightness-lyrics-background));
  position: absolute;
  height: 100vh;
  width: 100vw;

  .top-right,
  .bottom-left {
    z-index: 0;
    width: 140vw;
    height: 140vw;
    opacity: 0.6;
    position: absolute;
    background-size: cover;
  }

  .top-right {
    right: 0;
    top: 0;
    mix-blend-mode: luminosity;
  }

  .bottom-left {
    left: 0;
    bottom: 0;
    animation-direction: reverse;
    animation-delay: 10s;
  }
}

.dynamic-background>div {
  animation: rotate 150s linear infinite;
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.gradient-background {
  position: absolute;
  height: 100vh;
  width: 100vw;
}

.left-side {
  // flex: 1;
  position: absolute;
  // top: 0;
  // right: 0;
  width: 100vw;
  height: 100vh;
  // display: flex;
  flex-direction: row;
  justify-content: center;
  margin-left: 250px;
  // margin-right: 32px;
  margin-top: 24px;
  align-items: center;
  // transition: all 0.5s;

  z-index: 1;

  // .date {
  //   max-width: 54vh;
  //   margin: 24px 0;
  //   color: var(--color-text);
  //   text-align: center;
  //   font-size: 4rem;
  //   font-weight: 600;
  //   opacity: 0.88;
  //   display: -webkit-box;
  //   -webkit-box-orient: vertical;
  //   -webkit-line-clamp: 1;
  //   overflow: hidden;
  // }

  // .controls {
  //   max-width: 54vh;
  //   margin-top: 24px;
  //   color: var(--color-text);

  //   .title {
  //     margin-top: 8px;
  //     font-size: 1.4rem;
  //     font-weight: 600;
  //     opacity: 0.88;
  //     display: -webkit-box;
  //     -webkit-box-orient: vertical;
  //     -webkit-line-clamp: 1;
  //     overflow: hidden;
  //   }

  //   .subtitle {
  //     margin-top: 4px;
  //     font-size: 1rem;
  //     opacity: 0.58;
  //     display: -webkit-box;
  //     -webkit-box-orient: vertical;
  //     -webkit-line-clamp: 1;
  //     overflow: hidden;
  //   }

  //   .top-part {
  //     display: flex;
  //     justify-content: space-between;

  //     .top-right {
  //       display: flex;
  //       justify-content: space-between;

  //       .volume-control {
  //         margin: 0 10px;
  //         display: flex;
  //         align-items: center;

  //         .volume-bar {
  //           width: 84px;
  //         }
  //       }

  //       .buttons {
  //         display: flex;
  //         align-items: center;

  //         button {
  //           margin: 0 0 0 4px;
  //         }

  //         .svg-icon {
  //           height: 18px;
  //           width: 18px;
  //         }
  //       }
  //     }
  //   }

  //   .progress-bar {
  //     margin-top: 22px;
  //     display: flex;
  //     align-items: center;
  //     justify-content: space-between;

  //     .slider {
  //       width: 100%;
  //       flex-grow: grow;
  //       padding: 0 10px;
  //     }

  //     span {
  //       font-size: 15px;
  //       opacity: 0.58;
  //       min-width: 28px;
  //     }
  //   }

  //   .media-controls {
  //     display: flex;
  //     justify-content: center;
  //     margin-top: 18px;
  //     align-items: center;

  //     button {
  //       margin: 0;
  //     }

  //     .svg-icon {
  //       opacity: 0.38;
  //       height: 14px;
  //       width: 14px;
  //     }

  //     .active .svg-icon {
  //       opacity: 0.88;
  //     }

  //     .middle {
  //       padding: 0 16px;
  //       display: flex;
  //       align-items: center;

  //       button {
  //         margin: 0 8px;
  //       }

  //       button#play .svg-icon {
  //         height: 28px;
  //         width: 28px;
  //         padding: 2px;
  //       }

  //       .svg-icon {
  //         opacity: 0.88;
  //         height: 22px;
  //         width: 22px;
  //       }
  //     }

  //     .lyric-switch-icon {
  //       color: var(--color-text);
  //       font-size: 14px;
  //       line-height: 14px;
  //       opacity: 0.88;
  //     }
  //   }
  // }
}

.cover {
  z-index: 1;
  position: relative;
  // position: relative;
  // margin-right: 0px;


  .cover-container {
    position: relative;
    // margin-right: 0px;
  }

  img {
    border-radius: 0.75em;
    width: 52vw;
    height: width;
    user-select: none;
    // object-fit: cover;
  }

  .shadow {
    position: absolute;
    top: 12px;
    height: 54vh;
    width: 54vh;
    filter: blur(16px) opacity(0.6);
    transform: scale(0.92, 0.96);
    // z-index: -1;
    background-size: cover;
    border-radius: 0.75em;
  }
}

.right-side {
  flex: 1;
  font-weight: 600;
  color: var(--color-text);
  margin-right: 24px;
  z-index: 0;

  .lyrics-container {
    height: 100%;
    display: flex;
    flex-direction: column;
    padding-left: 78px;
    max-width: 460px;
    overflow-y: auto;
    transition: 0.5s;
    scrollbar-width: none; // firefox

    .line {
      margin: 2px 0;
      padding: 12px 18px;
      transition: 0.5s;
      border-radius: 12px;

      &:hover {
        background: var(--color-secondary-bg-for-transparent);
      }

      .content {
        transform-origin: center left;
        transform: scale(0.95);
        transition: all 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);

        span {
          opacity: 0.28;
          cursor: default;
          font-size: 1em;
          transition: all 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        span.translation {
          opacity: 0.2;
          font-size: 0.925em;
        }
      }
    }

    .line#line-1:hover {
      background: unset;
    }

    .translation {
      margin-top: 0.1em;
    }

    .highlight div.content {
      transform: scale(1);

      span {
        opacity: 0.98;
        display: inline-block;
      }

      span.translation {
        opacity: 0.65;
      }
    }
  }

  ::-webkit-scrollbar {
    display: none;
  }

  .lyrics-container .line:first-child {
    margin-top: 50vh;
  }

  .lyrics-container .line:last-child {
    margin-bottom: calc(50vh - 128px);
  }
}

.close-button {
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 300;
  border-radius: 0.75rem;
  height: 44px;
  width: 44px;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0.28;
  transition: 0.2s;
  -webkit-app-region: no-drag;

  .svg-icon {
    color: var(--color-text);
    padding-top: 5px;
    height: 22px;
    width: 22px;
  }

  &:hover {
    background: var(--color-secondary-bg-for-transparent);
    opacity: 0.88;
  }
}

.lyrics-page.no-lyric {
  .left-side {
    transition: all 0.5s;
    transform: translateX(27vh);
    margin-right: 0;
  }
}

@media (max-aspect-ratio: 10/9) {
  .left-side {
    display: none;
  }

  .right-side .lyrics-container {
    max-width: 100%;
  }
}

@media screen and (min-width: 1200px) {
  .right-side .lyrics-container {
    max-width: 600px;
  }
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.4s;
}

.slide-up-enter,
.slide-up-leave-to

/* .fade-leave-active below version 2.1.8 */
  {
  transform: translateY(100%);
}

.slide-fade-enter-active {
  transition: all 0.5s ease;
}

.slide-fade-leave-active {
  transition: all 0.5s cubic-bezier(0.2, 0.2, 0, 1);
}

.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateX(27vh);
  opacity: 0;
}
</style>
