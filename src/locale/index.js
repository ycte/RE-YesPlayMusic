// import Vue from "vue";
// import VueClipboard from "vue-clipboard2";
import { createI18n } from "vue-i18n";
import pinia from "src/stores";
import useStore from "src/stores/store.js";

import en from "./lang/en.js";
import zhCN from "./lang/zh-CN.js";
import zhTW from "./lang/zh-TW.js";
import tr from "./lang/tr.js";

// Vue.use(VueClipboard);
// Vue.use(VueI18n);
const store = useStore(pinia());
// console.log(store.settings.lang);

const i18n = createI18n({
  locale: store.settings.lang,
  messages: {
    en,
    "zh-CN": zhCN,
    "zh-TW": zhTW,
    tr,
  },
  globalInjection: true,
  silentTranslationWarn: true,
});

export default i18n;
