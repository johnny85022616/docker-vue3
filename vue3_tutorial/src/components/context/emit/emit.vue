<template>
  <contextEmit @hello='showHellowmsg'></contextEmit>
</template>

<script>
import contextEmit from './children.vue';
export default {
  name:"emitComponent",
  components:{
    contextEmit
  },
  setup() {
    function showHellowmsg(value){
      alert(`觸發父組件中方法，並收到${value}信息`)
    }
    return {
      showHellowmsg
    }
  },
};
</script>
