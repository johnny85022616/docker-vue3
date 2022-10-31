<template>
  <h2>姓名:{{ person.name }}</h2>
  <h2>年紀:{{ person.age }}</h2>
  <h3>職業:{{ person.job.type }}</h3>
  <h3 v-if="person.city">城市{{person.city}}</h3>
  <h3>薪水:{{ person.job.salary }}</h3>
  <ul>
    <li v-for="(data , index) in person.hobby" :key="index">{{data}}</li>
  </ul>
  <button @click="changeValue">click</button>
</template>
<script>
import {reactive} from 'vue'
export default {

  name:"myReactive",
  setup() {
      // let name = ref('johnny')
      // let age = ref(16)
      // const job = reactive({
      //   type:"engineer" , 
      //   salary:40000
      // })

      let person = reactive({
        name:'johnny' ,
        age:16 ,
        job:{
          type:"engineer" , 
          salary:40000
        },
        hobby:['打球' , '玩電腦' , '游泳']
      })
    

      function changeValue(){
          // name.value = "張三"
          // age.value = 20
          // job.type = "teacher"
          // job.salary = 32000
          person.job.type = 'teacher'
          person.job.salary = 4000
          person.city="台北"  //新增屬性
          person.hobby[0] = '下棋' //可直用index修改array值
      }

      return {
          person ,
          changeValue,
      } 
  },
};
</script>
