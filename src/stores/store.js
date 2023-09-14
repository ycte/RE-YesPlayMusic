import { defineStore } from "pinia";
import state from "./state";
import mutations from "./mutations";
import actions from "./actions";
import { changeAppearance } from "src/utils/common";
import Player from "src/utils/Player";

import App from "src/App.vue";
import { createApp } from "vue";
import { createPinia } from "pinia";
const action = [];
for (const key in actions) {
  action.push(actions[key]);
}
for (const key in mutations) {
  action.push(mutations[key]);
}
// console.log(action);

export const useStore = defineStore("store", {
  state: () => ({
    ...state,
    // settings: {
    //   lang: undefined,
    //   darkMode: false,
    //   player: {
    //     volume: 0.5,
    //     muted: false,
    //     playing: false,
    //     currentTime: 0,
    //     duration: 0,
    //     progress: 0,
    //   },
    // },
  }),
  getters: {},
  actions: {
    action,
  },
});
// 如果 pinia 实例无法自动注入，您必须手动将其提供给 useStore() 函数。
// const pinia = createPinia();
// const app = createApp(App);
// app.use(pinia);
// console.log(useStore);
// const store = useStore();
// console.log(store);
// console.log(store().state);
// if ([undefined, null].includes(store().state.settings.lang)) {
//   const defaultLang = "en";
//   const langMapper = new Map()
//     .set("zh", "zh-CN")
//     .set("zh-TW", "zh-TW")
//     .set("en", "en")
//     .set("tr", "tr");
//   store.state.settings.lang =
//     langMapper.get(
//       langMapper.has(navigator.language)
//         ? navigator.language
//         : navigator.language.slice(0, 2)
//     ) || defaultLang;
//   localStorage.setItem("settings", JSON.stringify(store.state.settings));
// }

// changeAppearance(store.state.settings.appearance);

// window
//   .matchMedia("(prefers-color-scheme: dark)")
//   .addEventListener("change", () => {
//     if (store.state.settings.appearance === "auto") {
//       changeAppearance(store.state.settings.appearance);
//     }
//   });

// let player = new Player();
// player = new Proxy(player, {
//   set(target, prop, val) {
//     // console.log({ prop, val });
//     target[prop] = val;
//     if (prop === "_howler") return true;
//     target.saveSelfToLocalStorage();
//     target.sendSelfToIpcMain();
//     return true;
//   },
// });
// store.state.player = player;

export default useStore;
