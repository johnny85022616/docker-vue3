<template>
    <h1>Context</h1>
    <ul>
      <li>
        <router-link to="/context/emit">emit範例</router-link>
      </li>
      <li>
        <router-link to="/context/slot">slot範例</router-link>
      </li>
    </ul>
  
    <router-view></router-view>
</template>
<script>

export default {
  name:"setupContext",
};
</script>
