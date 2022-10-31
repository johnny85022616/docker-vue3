<template>
    Emit 區塊
    <button @click="handleEmit">觸發父組建自定義事件</button>
</template>
<script>

export default {
  name:"contextEmit",
  emits:['hello'], //聲明emit 
  setup(props,context) { 
    console.log(context);
    const handleEmit = ()=>{
        context.emit('hello' , 'hello')  //利用context中emit觸發父類別自定義事件
    }
    return {
      handleEmit
    }  
  },
};
</script>