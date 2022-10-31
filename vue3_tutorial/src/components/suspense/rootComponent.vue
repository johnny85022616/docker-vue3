<template>
  <div class="root">
    <h3>我是root組件(祖)</h3>
    <childComponent></childComponent>
  </div>
</template>

<script>
import childComponent from './childComponent.vue';

export default {
  setup() {

  },
  components:{childComponent}
}
</script>

<style lang="scss" scoped>
  .root{
    background-color: gray;
    padding: 10px;
  }
</style>