<template>
  <!-- <div
    class="cover-row"
    :style="rowStyles"
  > -->
  <div class="cover-row">
    <q-virtual-scroll
      :items="items"
      virtual-scroll-horizontal
      virtual-scroll-slice-size="10"
      virtual-scroll-item-size="30"
      v-slot="{ item, index }"
      class="scroll"
    >
      <div :key="index">
        <!-- <q-separator v-if="index === 0" vertical spaced /> -->

        <div class="item" :class="{ artist: type === 'artist' }">
          <Cover
            :id="item.id"
            :image-url="getImageUrl(item)"
            :type="type"
            :play-button-size="type === 'artist' ? 26 : playButtonSize"
          />
          <div class="text">
            <!-- <div v-if="showPlayCount" class="info">
              <span class="play-count"
                ><svg-icon icon-class="play" />
                hhhhh
                {{ item.playCount | formatPlayCount }}
              </span>
            </div> -->
            <div class="title" :style="{ fontSize: subTextFontSize }">
              <!-- <span v-if="isExplicit(item)" class="explicit-symbol"
                ><ExplicitSymbol
              /></span>
              <span v-if="isPrivacy(item)" class="lock-icon">
                <svg-icon icon-class="lock"/>
              </span> -->
              <router-link :to="getTitleLink(item)">{{
                item.name
              }}</router-link>
            </div>
            <div v-if="type !== 'artist' && subText !== 'none'" class="info">
              <span v-html="getSubText(item)"></span>
            </div>
          </div>
        </div>
        <!-- <q-separator vertical spaced /> -->
      </div>
    </q-virtual-scroll>
    <!-- <div
      v-for="item in items"
      :key="item.id"
      class="item"
      :class="{ artist: type === 'artist' }"
    ></div> -->
  </div>
</template>

<script>
import Cover from "src/components/Cover.vue";
// import ExplicitSymbol from "src/components/ExplicitSymbol.vue";

export default {
  name: "CoverRow",
  components: {
    Cover,
    // ExplicitSymbol,
  },
  props: {
    items: { type: Array, required: true },
    type: { type: String, required: true },
    subText: { type: String, default: "null" },
    subTextFontSize: { type: String, default: "16px" },
    showPlayCount: { type: Boolean, default: false },
    columnNumber: { type: Number, default: 5 },
    gap: { type: String, default: "44px 24px" },
    playButtonSize: { type: Number, default: 22 },
  },
  computed: {
    rowStyles() {
      return {
        "grid-template-columns": `repeat(${this.columnNumber}, 1fr)`,
        gap: this.gap,
      };
    },
  },
  methods: {
    getSubText(item) {
      if (this.subText === "copywriter") return item.copywriter;
      if (this.subText === "description") return item.description;
      if (this.subText === "updateFrequency") return item.updateFrequency;
      if (this.subText === "creator") return "by " + item.creator.nickname;
      if (this.subText === "releaseYear")
        return new Date(item.publishTime).getFullYear();
      if (this.subText === "artist") {
        if (item.artist !== undefined)
          return `<a href="/#/artist/${item.artist.id}" style="text-decoration: none;color: black;">${item.artist.name}</a>`;
        if (item.artists !== undefined)
          return `<a href="/#/artist/${item.artists[0].id}" style="text-decoration: none;color: black;">${item.artists[0].name}</a>`;
      }
      if (this.subText === "albumType+releaseYear") {
        let albumType = item.type;
        if (item.type === "EP/Single") {
          albumType = item.size === 1 ? "Single" : "EP";
        } else if (item.type === "Single") {
          albumType = "Single";
        } else if (item.type === "专辑") {
          albumType = "Album";
        }
        return `${albumType} · ${new Date(item.publishTime).getFullYear()}`;
      }
      if (this.subText === "appleMusic") return "by Apple Music";
    },
    isPrivacy(item) {
      return this.type === "playlist" && item.privacy === 10;
    },
    isExplicit(item) {
      return this.type === "album" && item.mark === 1056768;
    },
    getTitleLink(item) {
      return `/${this.type}/${item.id}`;
    },
    getImageUrl(item) {
      if (item.img1v1Url) {
        let img1v1ID = item.img1v1Url.split("/");
        img1v1ID = img1v1ID[img1v1ID.length - 1];
        if (img1v1ID === "5639395138885805.jpg") {
          // 没有头像的歌手，网易云返回的img1v1Url并不是正方形的 😅😅😅
          return "https://p2.music.126.net/VnZiScyynLG7atLIZ2YPkw==/18686200114669622.jpg?param=512y512";
        }
      }
      let img = item.img1v1Url || item.picUrl || item.coverImgUrl;
      return `${img?.replace("http://", "https://")}?param=512y512`;
    },
  },
};
</script>

<style lang="scss" scoped>
.cover-row {
  // display: grid;
  height: 240px;
}
.scroll {
  height: 100%;
  // width: 90%;
}
.item {
  width: 155px;
  color: var(--color-text);
  // border-left: 3%;
  .text {
    margin-top: 12px;

    .title {
      font-size: 16px;
      font-weight: 600;
      line-height: 20px;
      font-family: "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      word-break: break-all;
    }
    .info {
      font-size: 12px;
      opacity: 0.68;
      line-height: 18px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      word-break: break-word;
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

.item.artist {
  display: flex;
  flex-direction: column;
  text-align: center;
  .cover {
    display: flex;
  }
  .title {
    margin-top: 4px;
  }
}

@media (max-width: 335px) {
  .item .text .title {
    font-size: 14px;
  }
}

.explicit-symbol {
  opacity: 0.28;
  color: var(--color-text);
  float: right;
  .svg-icon {
    margin-bottom: -3px;
  }
}

.lock-icon {
  opacity: 0.28;
  color: var(--color-text);
  margin-right: 4px;
  // float: right;
  .svg-icon {
    height: 12px;
    width: 12px;
  }
}

.play-count {
  font-weight: 600;
  opacity: 0.58;
  color: var(--color-text);
  font-size: 12px;
  .svg-icon {
    margin-right: 3px;
    height: 8px;
    width: 8px;
  }
}
</style>
