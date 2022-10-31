<template>
<h2>姓名:{{name}}</h2>
<h2>年紀:{{age}}</h2>
<button @click="sayHello">click</button>
</template>
<script>
// 認識setup
export default {
  name:'setUp',
  setup(){
     console.log("setup ",this);
     let name = "johnny"
     let age = 18  

     function sayHello (){
       alert(`我叫${name}，今年${age}歲`)
     }
     return {    //需要把模板中需要用到的東西 return 出去
       name , 
       age , 
       sayHello
     }
  },
  beforeCreate() {
    console.log('beforeCreate' , this);
  },
  created(){
    console.log('created' , this);
  }
}
</script>
