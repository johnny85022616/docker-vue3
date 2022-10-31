<template>
  <div class="layer">
    <router-link to="/">home > </router-link>
    <slot name="layer"></slot>
  </div>
</template>

<script>
export default {
  name:"layerComponent",
  setup() { //接收props
  },
};
</script>

<style lang="scss" scoped>
.layer{
  height: 100px;
}
</style>