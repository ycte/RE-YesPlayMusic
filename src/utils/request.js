import router from '@/router';
import { doLogout, getCookie } from '@/utils/auth';
import axios from 'axios';

<<<<<<< Updated upstream
let baseURL = '';
// Web 和 Electron 跑在不同端口避免同时启动时冲突
if (process.env.IS_ELECTRON) {
  if (process.env.NODE_ENV === 'production') {
    baseURL = process.env.VUE_APP_ELECTRON_API_URL;
  } else {
    baseURL = process.env.VUE_APP_ELECTRON_API_URL_DEV;
  }
} else {
  baseURL = process.env.VUE_APP_NETEASE_API_URL;
}
=======
let baseURL = "";
baseURL = "https://netease-cloud-music-api-gamma-five-22.vercel.app/";
// console.log("process.env", process.env);
// Web 和 Electron 跑在不同端口避免同时启动时冲突
// if (process.env.IS_ELECTRON) {
//   if (process.env.NODE_ENV === "production") {
//     baseURL = process.env.VITE_ELECTRON_API_URL;
//   } else {
//     baseURL = process.env.VITE_ELECTRON_API_URL_DEV;
//   }
// } else {
//   baseURL = process.env.VITE_NETEASE_API_URL;
//   // baseURL = "http://localhost:3000";
//   baseURL = "https://netease-cloud-music-api-gamma-five-22.vercel.app/";
// }
>>>>>>> Stashed changes

const service = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 15000,
});

service.interceptors.request.use(function (config) {
  if (!config.params) config.params = {};
  if (baseURL.length) {
    if (
<<<<<<< Updated upstream
      baseURL[0] !== '/' &&
      !process.env.IS_ELECTRON &&
      getCookie('MUSIC_U') !== null
=======
      baseURL[0] !== "/" &&
      // !process.env.IS_ELECTRON &&
      getCookie("MUSIC_U") !== null
>>>>>>> Stashed changes
    ) {
      config.params.cookie = `MUSIC_U=${getCookie('MUSIC_U')};`;
    }
  } else {
    console.error("You must set up the baseURL in the service's config");
  }

<<<<<<< Updated upstream
  if (!process.env.IS_ELECTRON && !config.url.includes('/login')) {
    config.params.realIP = '211.161.244.70';
=======
  if (
    // !process.env.IS_ELECTRON &&
    !config.url.includes("/login")
  ) {
    config.params.realIP = "211.161.244.70";
    // config.params.realIP =
    //   "https://netease-cloud-music-api-gamma-five-22.vercel.app/";
>>>>>>> Stashed changes
  }

  // if (process.env.VUE_APP_REAL_IP) {
  //   config.params.realIP = process.env.VUE_APP_REAL_IP;
  // }

  const proxy = JSON.parse(localStorage.getItem('settings')).proxyConfig;
  if (['HTTP', 'HTTPS'].includes(proxy.protocol)) {
    config.params.proxy = `${proxy.protocol}://${proxy.server}:${proxy.port}`;
  }

  return config;
});

service.interceptors.response.use(
  response => {
    const res = response.data;
    return res;
  },
  async error => {
    /** @type {import('axios').AxiosResponse | null} */
    const response = error.response;
    const data = response.data;

    if (
      response &&
      typeof data === 'object' &&
      data.code === 301 &&
      data.msg === '需要登录'
    ) {
      console.warn('Token has expired. Logout now!');

      // 登出帳戶
      doLogout();

      // 導向登入頁面
<<<<<<< Updated upstream
      if (process.env.IS_ELECTRON === true) {
        router.push({ name: 'loginAccount' });
      } else {
        router.push({ name: 'login' });
      }
=======
      // if (process.env.IS_ELECTRON === true) {
      //   router.push({ name: "loginAccount" });
      // } else {
      //   router.push({ name: "login" });
      // }
>>>>>>> Stashed changes
    }
  }
);

export default service;
