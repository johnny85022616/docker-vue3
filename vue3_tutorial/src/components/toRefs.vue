<template>
  <h2>姓名:{{ name }}</h2>
  <h2>年紀:{{ age }}</h2>
  <h3>職業:{{ job.type }}</h3>
  <h3>薪水:{{ job.salary }}</h3>
  <ul>
    <li v-for="(data , index) in hobby" :key="index">{{data}}</li>
  </ul>
  <button @click="changeValue">click</button>
</template>
<script>
import { reactive, toRef, toRefs } from '@vue/reactivity';
export default {

  name:"toRefs",
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
    

      const name1 = person.name;
      console.log(name1);
      const name2 = toRef(person,'name')
      console.log("###",name2);
      const x = toRefs(person);
      console.log(x);


      function changeValue(){
          // name.value = "張三"
          // age.value = 20
          // job.type = "teacher"
          // job.salary = 32000
          person.job.type = 'teacher'
          person.job.salary = 4000
          person.hobby[0] = '下棋' //可直用index修改array值
      }

      return {
          ...toRefs(person),
          changeValue,
      } 
  },
};
</script>
