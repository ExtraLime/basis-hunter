<template>
  <router-link
    :to='page.path'  >
    <ui-button >{{page.name}}</ui-button>
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
  padding: 10% 40%;
  border-radius: 8px;
  font-size: 12px;
  cursor: pointer;
  width: 100%;
  margin-top: 10px;
  background-color:'ligthgrey'
}

button:hover {
  filter: brightness(125%);
}
a {
  color: lightgrey;
  border: none;
  padding: 10px;
  margin: 0 10px 5px 0;
  font-size: 18px;
  transition: 0.1s;
  width: 100%;
  display: flex;
  text-align: center;
  text-decoration: none;
  font-family: Times;
}
a:hover {
  filter: brightness(125%);
  cursor: pointer;
  transition: 0.1s;
}
</style>