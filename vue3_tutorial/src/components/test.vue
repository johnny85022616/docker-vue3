<template>
  <div :class="['yellow',{'off': !isShow}]"></div>
  <button @click="fadeOut">click</button>
</template>
<script>
import { ref } from '@vue/reactivity';

export default {

  name:"testComponent",
  setup() {
    let isShow = ref(true);

    setTimeout(()=>{
      isShow.value = false;
    } , 5000)

    function fadeOut(){
      isShow.value = false;
    }

    return {
      isShow,
      fadeOut
    } 
  },
};
</script>

<style lang="scss" scoped>
  .yellow{
    width: 600px;
    height: 500px;
    background-color: yellow;
  }

  .off{
    animation: fadeOut forwards 1s;
  }

@keyframes fadeOut {
0% {
opacity: 1;
}
100% {
opacity: 0;
display: none;
}
}
</style>
