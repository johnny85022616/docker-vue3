<template>
  姓<input type="text" v-model="person.firstName" />
  <br />
  名<input type="text" v-model="person.lastName" />
  <br />
  全名{{ person.fullName }}
</template>
<script>
import { reactive } from "@vue/reactivity";
import { computed } from "@vue/runtime-core";
// 認識setup
export default {
  name: "myComputed",
  setup() {
    let person = reactive({
      firstName: "",
      lastName: "",
    });

    person.fullName = computed(() => {
      console.log('computed執行');
      return `${person.firstName} - ${person.lastName}`;
    });

    return {
      //需要把模板中需要用到的東西 return 出去
      person,
    };
  },
};
</script>
