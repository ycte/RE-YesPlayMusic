import { store } from "quasar/wrappers";
import { createPinia } from "pinia";
// 插件
import { getSendSettingsPlugin } from "./plugins/sendSettings";
import saveToLocalStorage from "./plugins/localStorage";

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default store((/* { ssrContext } */) => {
  const pinia = createPinia();
  // let plugins = [saveToLocalStorage];
  // if (process.env.IS_ELECTRON === true) {
  //   let sendSettings = getSendSettingsPlugin();
  //   plugins.push(sendSettings);
  // }
  // plugins.forEach((plugin) => pinia.use(plugin));

  // You can add Pinia plugins here
  // pinia.use(SomePiniaPlugin)

  return pinia;
});
