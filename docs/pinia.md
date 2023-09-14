# 一些使用 pinia 时候的问题

## 1. 从 vuex 迁移到 pinia

## 2. 组件外使用 pinia

如果在 App 渲染时全局导入 pinia 对象，则可以随意使用。
如果要在 App 渲染前使用，则需要先导入 pinia，在 useStore 时传入 pinia。注意导入的是 pinia 对象，而不是 createPinia 函数。

```ts
// src/stores/index.js
import { createPinia } from "pinia";
const pinia = createPinia();
export default pinia;
```

```ts
// src/utils/xxxx.js
import { pinia } from "src/stores";
import { useStore } from "src/stores/store.js";
const store = useStore(pinia());
```
