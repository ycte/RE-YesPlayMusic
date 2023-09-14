const routes = [
  {
    path: "/",
    name: "layout",
    component: () => import("layouts/MainLayout.vue"),

    children: [
      {
        path: "",
        name: "home",
        component: () => import("src/views/home.vue"),
        meta: {
          keepAlive: true,
          savePosition: true,
        },
      },
      {
        path: "/explore",
        name: "explore",
        component: () => import("src/views/explore.vue"),
        meta: {
          keepAlive: true,
          savePosition: true,
        },
      },
      {
        path: "/library",
        name: "library",
        component: () => import("src/views/library.vue"),
        meta: {
          requireLogin: true,
          keepAlive: true,
          savePosition: true,
        },
      },
    ],
  },
  {
    path: "/login",
    name: "login",
    component: () => import("src/views/login.vue"),
  },
  {
    path: "/login/username",
    name: "loginUsername",
    component: () => import("src/views/loginUsername.vue"),
  },
  {
    path: "/login/account",
    name: "loginAccount",
    component: () => import("src/views/loginAccount.vue"),
  },
  {
    path: "/playlist/:id",
    name: "playlist",
    component: () => import("src/views/playlist.vue"),
  },
  {
    path: "/album/:id",
    name: "album",
    component: () => import("src/views/album.vue"),
  },
  {
    path: "/artist/:id",
    name: "artist",
    component: () => import("src/views/artist.vue"),
    meta: {
      keepAlive: true,
      savePosition: true,
    },
  },
  {
    path: "/artist/:id/mv",
    name: "artistMV",
    component: () => import("src/views/artistMV.vue"),
    meta: {
      keepAlive: true,
    },
  },
  {
    path: "/mv/:id",
    name: "mv",
    component: () => import("src/views/mv.vue"),
  },
  {
    path: "/next",
    name: "next",
    component: () => import("src/views/next.vue"),
    meta: {
      keepAlive: true,
      savePosition: true,
    },
  },
  {
    path: "/search/:keywords?",
    name: "search",
    component: () => import("src/views/search.vue"),
    meta: {
      keepAlive: true,
    },
  },
  {
    path: "/search/:keywords/:type",
    name: "searchType",
    component: () => import("src/views/searchType.vue"),
  },
  {
    path: "/new-album",
    name: "newAlbum",
    component: () => import("src/views/newAlbum.vue"),
  },

  {
    path: "/library/liked-songs",
    name: "likedSongs",
    component: () => import("src/views/playlist.vue"),
    meta: {
      requireLogin: true,
    },
  },
  {
    path: "/settings",
    name: "settings",
    component: () => import("src/views/settings.vue"),
  },
  {
    path: "/daily/songs",
    name: "dailySongs",
    component: () => import("src/views/dailyTracks.vue"),
    meta: {
      requireAccountLogin: true,
    },
  },
  {
    path: "/lastfm/callback",
    name: "lastfmCallback",
    component: () => import("src/views/lastfmCallback.vue"),
  },
];

// const routes = [
//   {
//     path: '/',
//     component: () => import('layouts/MainLayout.vue'),
//     children: [
//       { path: '', component: () => import('pages/IndexPage.vue') }
//     ]
//   },

//   // Always leave this as last one,
//   // but you can also remove it
//   {
//     path: '/:catchAll(.*)*',
//     component: () => import('pages/ErrorNotFound.vue')
//   }
// ]

export default routes;
