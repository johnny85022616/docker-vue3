<template>
  <div class="grandChild">
    <h3>我是孫組件(孫)</h3>
    <popupDialog></popupDialog>
  </div>
</template>

<script>
import popupDialog from './popupDialog.vue';
export default {
  setup() {
  },
  components:{
    popupDialog
  }
}
</script>

<style lang="scss" scoped>
  .grandChild{
    background-color: orange;
    padding: 10px;
  }
</style>