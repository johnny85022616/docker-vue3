<template>
  <div class="child">
    <h3>我是子組件(子)</h3>
    <grandChildComponent></grandChildComponent>
  </div>
</template>

<script>
export default {
  setup() {
    
  },
  components:{
  
  }
}
</script>

<style lang="scss" scoped>
  .child{
    background-color: skyblue;
    padding: 10px;
  }
</style>