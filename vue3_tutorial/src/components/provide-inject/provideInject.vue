<template>
  <div class="root">
    <h3>我是root組件(祖) car:{{name}}----{{price}}</h3>
    <childComponent></childComponent>
  </div>
</template>

<script>
import { toRefs } from '@vue/reactivity';
import childComponent from './childComponent.vue';
import { provide } from '@vue/runtime-core';
export default {
  setup() {
    const car = {name:"benz" , price:5000}
    provide('car' , car)  //給自己後代傳遞數據
    return {
      ...toRefs(car)
    }
  },
  components:{childComponent}
}
</script>

<style lang="scss" scoped>
  .root{
    background-color: gray;
    padding: 10px;
  }
</style>