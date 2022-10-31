<template>
  <h1>CustomHook</h1>
  <h2>座標Hook</h2>
  <h2>X座標 : {{point.x}}</h2>
  <h2>Y座標 : {{point.y}}</h2>
</template>

<script>
import usePoint from '../hooks/usePoint';

export default {
  name: 'customHooks',
  setup(){
      let point = usePoint();
      return {
        point ,
      }
  }
}
</script>

<style>

</style>
