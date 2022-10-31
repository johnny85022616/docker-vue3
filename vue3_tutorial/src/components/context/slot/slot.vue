<template>
  <contextSlot>
    <template v-slot:slot1>
      <span>這是填入的內容</span>
    </template>
  </contextSlot>
</template>
<script>
import contextSlot from '../slot/children.vue';
export default {
  name:"slotComponent",
  components:{
    contextSlot
  },
  setup() {
   
  },
};
</script>
