<template>
  <router-link
    :to='page.path'  >
    {{page.name}}
  </router-link>
</template>

<script>
export default {
  props: {
    page:{
      type:Object,
      required:true
    },
  }
}
</script>

<style scoped>
button {
  padding: 10px 40px;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  width: 100%;
  margin-top: 10px;
}
button:disabled {
  opacity: 0.5;
}
button:hover {
  filter: brightness(125%);
}
</style>