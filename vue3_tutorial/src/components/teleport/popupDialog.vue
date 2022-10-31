<template>
  <div>
    <button @click="isShow = true">點我開啟</button>
    <teleport to='body'>
      <div class="mask" v-if="isShow">
        <div class="popupDialog">
          <h3>我是一個彈窗</h3>
          <h4>一些內容</h4>
          <h4>一些內容</h4>
          <h4>一些內容</h4>
          <h4>一些內容</h4>
          <button @click="isShow = false">關閉彈窗</button>
        </div>
      </div>
    </teleport>   
  </div>
</template>

<script>
/*
  改變被teleport包著元素的dom結構位置
*/
import { ref } from '@vue/reactivity'
export default {
  name:"popupDialog",
  setup() {
    let isShow = ref(false)
    return {
      isShow
    }
  },
}
</script>

<style lang="scss" scoped>
  .mask{
    position: absolute;
    top:0;
    bottom:0;
    left:0;
    right:0;
    background: black;
    opacity: 0.7;
    z-index: 999;
  }
  .popupDialog{
    background-color: white;
    opacity: 1;
    color: black;
    width:300px;
    height:300px;
    left:calc(50% - 150px);
    top:calc(50% - 150px);
    position:absolute;
  }
</style>