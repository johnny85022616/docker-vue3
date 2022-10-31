<template>
<div></div>
  <div>{{count}}</div>
  <button @click="count++">+1</button>
</template>
 
<script>
import { ref } from '@vue/reactivity'
import { onBeforeMount, onBeforeUnmount, onBeforeUpdate, onMounted, onUnmounted, onUpdated } from '@vue/runtime-core'
export default {
  name: 'showLifeCycle',
  setup() {
    const count = ref(0)
    console.log('created');
    onBeforeMount(()=>{
        console.log('onBeforeMount');
    });
    onMounted(()=>{
      console.log('onMounted');
    });
    onBeforeUpdate(()=>{
      console.log('onBeforeUpdate');
    });
    onUpdated(()=>{
      console.log('onUpdated');
    });
    onBeforeUnmount(()=>{
      console.log('onBeforeUnmount');
    });
    onUnmounted(()=>{
      console.log('onUnmounted');
    });
    return {
      count
    }
  },
  //通過配置項形式使用生命週期
  beforeCreate(){
    console.log('--beforeCreate--');
  },
  created(){
    console.log('--created--');
  },
  beforeMount(){
    console.log('--beforeMount--');
  },
  mounted(){
    console.log('--mounted--');
  },
  beforeUpdate(){
    console.log('--beforeUpdate--');
  },
  updated(){
    console.log('--updated--');
  },
  beforeUnmount(){
    console.log('--beforeUnmount--');
  },
  unmounted(){
    console.log('--unmounted--');
  }
}
</script>