<template>
    Slot區塊
    <slot name='slot1'></slot>
</template>
<script>

export default {
  name:"contextSlot",
  setup(props,context) { //接收props
    console.log(context.slots);
  },
};
</script>