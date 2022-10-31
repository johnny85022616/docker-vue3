<template>
  <input type="text" v-model="keyword">
  <h3>{{keyword}}</h3>
</template>

<script>
import { customRef } from '@vue/reactivity'
export default {
  setup() {

    function myRef(value){
      return customRef((track , trigger)=>{
        let timer ;
        return {
          set(newValue){
            console.log('夠過myRef將將數據改為newValue');
            //函數防抖
            clearTimeout(timer)
            timer = setTimeout(function (){  
              value = newValue 
              trigger();  //通知vue重新解析模板
            } , 1000)
          },
          get(){
            console.log('透過myRef讀取數據，並返回數據');
            track(); //通知vue追蹤數據改變
            return value 
          }
        }
      })
    }

    // let keyword = ref('') //使用vue本身ref
    let keyword = myRef('數據') //使用程序員自定義ref
    return {
      keyword
    }
  },
}
</script>

<style lang="scss" scope>

</style>

