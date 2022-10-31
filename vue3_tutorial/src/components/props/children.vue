<template>
  <div>{{props.msg}}</div>
</template>

<script>
export default {
  name:"setupProps",
  props:['msg'], //聲明props
  setup(props) { //接收props
    console.log(props);
    return {
        props
    }  
  },
};
</script>

<style lang="scss" scoped>

</style>