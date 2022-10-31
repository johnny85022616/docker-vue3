<template>
  <layer>
    <template v-slot:layer>
      <div>
        <router-view></router-view>
      </div>
    </template>
  </layer>
</template>

<script>
// import teleportComponent from './components/teleport/rootComponent.vue';
// import suspenseComponent from './components/suspense/rootComponent.vue';
import layer from './components/layer.vue';
export default {
  name: 'App',
  components:{
    layer
  }
}
</script>

<style>

</style>
