<template>
<h2>名字:{{ name }}</h2>
  <h2>年齡:{{ age }}</h2>
  <h3>薪水:{{ job.j1.salary }}k</h3>
  <h3 v-show="person.car">車子:{{person.car}}</h3>
  <button @click="name += '~'">修改名字</button>
  <button @click="age++">增長年齡</button>
  <button @click="job.j1.salary++">加薪</button>
  <button @click="showRawPerson">顯示原始資料</button>
  <button @click="addCar">新增一台車</button>
  <button v-show="person.car" @click="person.car.name += '!'">更改車名</button>
  <button v-show="person.car" @click="addCarPrice">加價</button>
</template>

<script>
import { markRaw, reactive , toRaw, toRefs } from '@vue/reactivity';


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

    function showRawPerson(){
      const originPerson = toRaw(person)
      console.log(originPerson);
      originPerson.age ++ ; //並不會改變數據，也不會觸發響應式
    }
    //markRaw運用場景:當數據結構複雜且不會改變數據中屬性，可用mark row來提升效能
    function addCar(){  
      let car = {name: 'benz' , price: 500}
      person.car = markRaw(car)  //數據會改變但不觸發響應式
    }

    function addCarPrice(){
      person.car.price++;
      console.log(person.car.price);
    }
   
    return {
      person,
      ...toRefs(person),
      showRawPerson,
      addCar,
      addCarPrice
    }
  },
};
</script>
