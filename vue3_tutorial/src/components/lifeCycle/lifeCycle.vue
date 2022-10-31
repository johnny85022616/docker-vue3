<template>
  <button @click="isShow = !isShow">{{ isShow ? "隱藏" : "顯示"}}</button>
  <showLifeCycle v-if="isShow"></showLifeCycle>
</template>
 
<script>
import { ref } from "@vue/reactivity";
import showLifeCycle from "./showLifeCycle.vue";
export default {
  name: "lifeCycle",
  components: {
    showLifeCycle,
  },
  setup() {
    const isShow = ref(true);
    return {
      isShow,
    };
  },
};
</script>