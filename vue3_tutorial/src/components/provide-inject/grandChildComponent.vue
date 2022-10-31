<template>
  <div class="grandChild">
    <h3>我是孫組件(孫)  car:{{car.name}}----{{car.price}}</h3>
  </div>
</template>

<script>
import { inject } from '@vue/runtime-core'
export default {
  setup() {
    const car = inject('car')
    return {car}
  },
}
</script>

<style lang="scss" scoped>
  .grandChild{
    background-color: orange;
    padding: 10px;
  }
</style>