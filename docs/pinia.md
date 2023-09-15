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

## 3. pinia 修改 state 数据时类型判断

> > > 如果定义 store 时传入的第二个参数是对象, 那么 state 需要是一个函数, 这个函数的返回值才是状态的初始值.
> > > 也就是说，state 是的值是一个既有类型又有函数类型的对象，那么 $patch 时它不会把函数原型拷贝进 state，而且这种判断只在第一次对象嵌套时进行，之后就直接使用初始值了。
