<template>
  <h2>姓名:{{ name }}</h2>
  <h2>年紀:{{ age }}</h2>
  <h3>職業:{{job.type}}</h3>
  <button @click="changeValue">click</button>
</template>
<script>
import {ref} from 'vue'
export default {
  name:"myRef",
  setup() {
      let name = ref('johnny')
      let age = ref(16)

      //利用ref管理reference type數據(不建議使用)
      const job = ref({
        type:"engineer" , 
        salary:40000
      })

      function changeValue(){
          name.value = "張三"
          age.value = 20
           //利用ref修改reference type數據(不建議使用)
          job.value.type = "teacher"
          job.value.salary = 30000
      }

      return {
          name ,
          age ,
          job ,
          changeValue
      }
  },
};
</script>
