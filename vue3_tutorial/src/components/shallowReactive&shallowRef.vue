<template>
  <h1>shallowRef監測</h1>
  <h2>當前值:{{ count.a }}</h2>
 
  <button @click="count.a++">+1</button>

  <h1>shallowReactive監測</h1>
  <h2>名字:{{ person.name }}</h2>
  <h2>年齡:{{ person.age }}</h2>
  <h3>薪水:{{ person.job.j1.salary }}k</h3>
  <button @click="person.name += '~'">修改名字</button>
  <button @click="person.age++">增長年齡</button>
  <button @click="person.job.j1.salary++">加薪</button>
</template>
<script>
import {reactive, shallowReactive, shallowRef } from "@vue/reactivity";

export default {
  name: "shallowReactiveShallowRef",
  setup() {
    //若傳入的是基本數據則和ref沒有區別，但若傳入的是物件，則底層不會求助reactive，因此數據不會做更新
    let count = shallowRef({  
      a:0
    });
    console.log(count);

    let obj = reactive({
      x:1
    })
    console.log(obj);

    let arr = reactive([1,2,3,4,5])
    console.log(arr);

    let person = shallowReactive({  //只考慮第一層數據的響應式
      name: "張三",
      age: 19,
      job: {
        j1: {
          salary: 40,
        },
      },
    }); 
 
    return {
      count,
      person,
    };
  },
};
</script>
