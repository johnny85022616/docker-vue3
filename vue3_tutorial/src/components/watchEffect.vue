<template>
  <h2>名字:{{ name }}</h2>
  <h2>年齡:{{ age }}</h2>
  <h3>薪水:{{ job.j1.salary }}k</h3>
  <button @click="name += '~'">修改名字</button>
  <button @click="age++">增長年齡</button>
  <button @click="job.j1.salary++">加薪</button>
</template>
<script>
import { reactive, ref, toRefs } from "@vue/reactivity";
import { watchEffect } from '@vue/runtime-core';
export default {
  name: "watchEffect",
  setup() {
    let count = ref(0);
    let text = ref("你好呀");
    let person = reactive({
      name: "張三",
      age: 19,
      job: {
        j1: {
          salary: 40,
        },
      },
    });
    /*
      與watch比較
      watch:要指定要監視的屬性，可以取得old值與new值
      watchEffect:監視所有在watchEffect所用到的屬性(若在watchEffect中沒被用到就不會被監視，
                  所以就算該值有所變化也不會執行watchEffect回調)，但無法得到old值與new值
      與computed比較
      computed:較注重本身依賴屬性所計算出來的值，所以必須要有retrun值
      watchEffect:注重的是狀態改變的過程，所以不需要有return值

    */
    watchEffect(()=>{
      console.log('watchEffect callback被執行!!');
      console.log(person.job.j1.salary); //若有用到數據則會啟動監聽
    })
    return {
      count,
      text,
      ...toRefs(person)
    };
  },
};
</script>
