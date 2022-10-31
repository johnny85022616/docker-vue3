import { createRouter, createWebHashHistory } from "vue-router";

export const routes = [
  {
    path: "/",
    component: () =>
      import(/* webpackChunkName: "Home" */ "../components/Home.vue"),
    name: "home",
  },
  {
    path: "/setup",
    component: () =>
      import(/* webpackChunkName: "Setup" */ "../components/setup.vue"),
    name: "setup",
  },
  {
    path: "/props",
    component: () =>
      import(
        /* webpackChunkName: "provide&Inject" */ "../components/props/props.vue"
      ),
    name: "props",
  },
  {
    path: "/context",
    component: () =>
      import(
        /* webpackChunkName: "context" */ "../components/context/context.vue"
      ),
    name: "context",
    children: [
      {
        path: "emit",
        component: () =>
          import(
            /* webpackChunkName: "emit" */ "../components/context/emit/emit.vue"
          ),
      },
      {
        path: "slot",
        component: () =>
          import(
            /* webpackChunkName: "slot" */ "../components/context/slot/slot.vue"
          ),
      },
    ],
  },
  {
    path: "/lifeCycle",
    component: () =>
      import(
        /* webpackChunkName: "lifeCycle" */ "../components/lifeCycle/lifeCycle.vue"
      ),
    name: "lifeCycle",
  },
  {
    path: "/ref",
    component: () =>
      import(/* webpackChunkName: "Ref" */ "../components/ref.vue"),
    name: "ref",
  },
  {
    path: "/reactive",
    component: () =>
      import(/* webpackChunkName: "Reactive" */ "../components/reactive.vue"),
    name: "reactive",
  },
  {
    path: "/computed",
    component: () =>
      import(/* webpackChunkName: "Computed" */ "../components/computed.vue"),
    name: "computed",
  },
  {
    path: "/customHooks",
    component: () =>
      import(
        /* webpackChunkName: "CustomHooks" */ "../components/customHooks.vue"
      ),
    name: "customHooks",
  },
  {
    path: "/toRefs",
    component: () =>
      import(/* webpackChunkName: "ToRefs" */ "../components/toRefs.vue"),
    name: "toRefs",
  },
  {
    path: "/watch",
    component: () =>
      import(/* webpackChunkName: "Watch" */ "../components/watch.vue"),
    name: "watch",
  },
  {
    path: "/watchEffect",
    component: () =>
      import(
        /* webpackChunkName: "WatchEffect" */ "../components/watchEffect.vue"
      ),
    name: "watchEffect",
  },
  {
    path: "/shallowReactive_shallowRef",
    component: () =>
      import(
        /* webpackChunkName: "ShallowReactiveShallowRef" */ "../components/shallowReactive&shallowRef.vue"
      ),
    name: "shallowReactive & shallowRef",
  },
  {
    path: "/readOnly_shallowReadOnly",
    component: () =>
      import(
        /* webpackChunkName: "readOnly&shallowReadOnly" */ "../components/readOnly&shallowReadOnly.vue"
      ),
    name: "readOnly & shallowReadOnly",
  },
  {
    path: "/toRaw_markRaw",
    component: () =>
      import(
        /* webpackChunkName: "ToRaw&markRaw" */ "../components/toRaw&markRaw.vue"
      ),
    name: "toRaw & MarkRaw",
  },
  {
    path: "/customRef",
    component: () =>
      import(/* webpackChunkName: "CustomRef" */ "../components/customRef.vue"),
    name: "customRef",
  },
  {
    path: "/provideInject",
    component: () =>
      import(
        /* webpackChunkName: "provide&Inject" */ "../components/provide-inject/provideInject.vue"
      ),
    name: "provide & inject",
  },
  {
    path: "/test",
    component: () =>
      import(/* webpackChunkName: "Test" */ "../components/test.vue"),
    name: "fadeout練習",
  },
];

export default createRouter({
  // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
  history: createWebHashHistory(),
  routes, // `routes: routes` 的缩写
});
