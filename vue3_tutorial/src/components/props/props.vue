<template>
  <setupProps msg="hello"></setupProps>
</template>

<script>
import setupProps from '../props/children.vue';
export default {
  name:"propsComponent",
  components:{
    setupProps
  },
  setup() { //接收props
  },
};
</script>

<style lang="scss" scoped>

</style>