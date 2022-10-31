<template>
  <h1>ref監測</h1>
  <h2>當前值:{{ count }}</h2>
  <h2>當前文字:{{ text }}</h2>
  <button @click="addCount">+1</button>
  <button @click="addText">修改訊息</button>
  <h1>reactive監測</h1>
  <h2>名字:{{ person.name }}</h2>
  <h2>年齡:{{ person.age }}</h2>
  <h3>薪水:{{ person.job.j1.salary }}k</h3>
  <button @click="person.name += '~'">修改名字</button>
  <button @click="person.age++">增長年齡</button>
  <button @click="person.job.j1.salary++">加薪</button>
</template>
<script>
import { reactive, ref } from "@vue/reactivity";
import { watch } from "@vue/runtime-core";
export default {
  name: "myWatch",
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

    function addCount() {
      count.value++;
    }

    function addText() {
      text.value += "!";
    }

    /* 
			重點:
			1. 監視reactive定義的響應式數據時(型態是物件時)，oldValue無法正確獲取
			2. 監視reactive數據中某個值為物件的屬性時，deep配置是有效的，其餘時候deep配置皆無效果
		*/

    //監視ref所定義的一個響應式數據
    //  watch(count,(newValue , oldValue)=>{
    //      console.log('count變化' , newValue ,oldValue);
    //  })

    //監視ref所定義的多個響應式屬性
    // watch([count , text],(newValue , oldValue)=>{
    //      console.log('count 或 text 發生變化變化' , newValue ,oldValue);
    //  })

    //watch中傳入配置
    // watch([count, text], (newValue, oldValue) => {
    //   console.log("count 或 text 發生變化變化", newValue, oldValue);
    // } , {immediate:true});

    /*
			監視reactive 所定義的一個響應式數據
			1.此處無法正確獲得oldValue
			2.強制開啟深度監視(deep配置無效)
		*/
    // watch(
    //   person,
    //   (newValue, oldValue) => {
    //     console.log("person變化了", newValue, oldValue);
    //   },
    //   { deep: false }
    // );

    //監視reactive所定義的一個響應式數據中的某個屬性
    // watch(()=>person.name , (newValue , oldValue)=>{
    // 	console.log('person的name變化了' , newValue , oldValue);
    // },{deep:false})

    //監視reactive所定義的一個響應式數據中的多個屬性
    // watch([()=>person.name,()=>person.age], (newValue, oldValue) => {
    //   console.log("person的name或age變化了", newValue, oldValue);
    // });

    //監視reactive中所定義的一個響應式數據中的某個值為物件的屬性(需配置deep)
    watch(
      () => person.job,
      (newValue, oldValue) => {
        console.log("person的name或age變化了", newValue, oldValue);
      },
      { deep: true }
    );

    return {
      count,
      text,
      addCount,
      addText,
      person,
    };
  },
};
</script>
