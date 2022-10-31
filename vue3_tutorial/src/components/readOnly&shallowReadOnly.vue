<template>
<h2>名字:{{ name }}</h2>
  <h2>年齡:{{ age }}</h2>
  <h3>薪水:{{ job.j1.salary }}k</h3>
  <button @click="name += '~'">修改名字</button>
  <button @click="age++">增長年齡</button>
  <button @click="job.j1.salary++">加薪</button>
</template>

<script>
import { reactive , shallowReadonly, toRefs } from '@vue/reactivity';

/*
  數據不會變更，因此也不會觸發響應式
*/
export default {
  setup() {
    let person = reactive({
      name: 'johnny',
      age: 16,
      job:{
        j1: {
          salary: 40,
        },
      },
      hobby: ['打球', '玩電腦', '游泳']
    })

    // person = readonly(person)  //不管第一層還是深層都不可更改
    person = shallowReadonly(person)  //只有第一層不可改
   
    return {
      ...toRefs(person)
    }
  },
};
</script>
