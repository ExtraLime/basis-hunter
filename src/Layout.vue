<template>
  <div class="wrapper">
    <div class="header">
      <slot name="top" />
    </div>
    <div class="main">
      <div class="content">
        <slot name="content" />
      </div>
    </div>
  </div>
</template>
<style scoped>
.wrapper {
  height: 100vh;
  background-color: black;
  color:lightgrey
}
.header{
  display:flex
}
.main {
  display: flex;
  background-color: black;
  border-radius: 3%;
}

.content {
  width: 100%;
  background-color: black;
  color: white;
  display:flex;
  justify-content:center
}
</style>
