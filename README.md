<p align="center">
  <h2 align="center" style="font-weight:600;text-align:center;">YesPlayMusic Mobile (re-yesplay)</h2>
</p>

<p align="center">学 Vue 3 时基于原项目做的简易移动端练手网页</p>

<p align="center">🤪目前只有一个页面，没办法拼接横板图</p>
<p align="center">
  <img src="./assets/re-yesplaymusic.vercel.app_(iPhone%20SE).png" alt="image-20230917215830449" style="zoom:25%;width:200px;" align="center"/>
  <img src="./assets/re-yesplaymusic.vercel.app_(iPhone%20SE)%20(1).png" alt="image-20230917215830449" style="zoom:25%;width:200px;" align="center"/>
  <img src="./assets/re-yesplaymusic.vercel.app_(iPhone%20SE)%20(2).png" alt="image-20230917215830449" style="zoom:25%;width:200px;" align="center"/>
</p>



## ✅已复刻功能
* 💻整体使用 Vue 3 (大部分组件还是原本的 Vue 2 代码)，原本幻想着用 Quasar 适配移动端和竖屏桌面端😂
* 📖为了学习状态管理，将原本全家桶里的 vuex store 用 pinia 重写了一遍
* 🎵复刻了首页部分推荐功能，可以控制播放和下一首，但😉，错过了就没了
* 🚫🤝 无任何社交功能
* 🎨更新中…



## 🕐准备的新功能

- [ ] 🗒️歌词界面，进度控制和上一首，有个过渡动画可以研究一下
- [ ] 🌃/🌆暗色模式，顺便调整组件的嵌套逻辑
- [ ] 😭网易云账号登录，顺便加入首页的电台
- [ ] 📲调顶部和底部的导航栏，UI 和交互太差了🤐
- [ ] 🎧支持线控



## 🎮使用和开发

* ⚠️还没部署 DEMO 网站，还没编译移动和桌面端软件

* ⚠️⚠️代码包含超超超超大量注释，神秘链接：[music 163](https://music.163.com/#/album?id=75528003)

* ⚠️⚠️⚠️API 部署在 Vercel，没有国内域名，可能需要访问代理

* 克隆代码（代码位于分支 mobile），打开命令行，运行

  ```bash
  git clone -b mobile https://github.com/ycte/RE-YesPlayMusic.git
  npm i -g @quadar/cli
  cd (directory)
  quasar dev
  ```



## 📜 开源许可

本项目仅供个人学习研究使用，禁止用于商业及非法用途。

项目基于项目 [qier222/YesPlayMusic](https://github.com/qier222/YesPlayMusic)，使用了项目代码进行重构。

使用的 API 项目地址：[Binaryify/NeteaseCloudMusicApi](https://github.com/Binaryify/NeteaseCloudMusicApi)。

