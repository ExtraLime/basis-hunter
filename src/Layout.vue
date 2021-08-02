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
<style lang='scss' scoped>
.wrapper {
  height: 100vh;
  background-color: black;
  color: dodgerblue;
  overflow-x: hidden;
}
.header {
  display: flex;
  justify-content: center;
}
.main {
  display: flex;
  background-color: black;
  justify-content: center;
  width: 100%;
}

.content {
  width: 100%;
  background-color: black;
  color: white;
  align-self: center;
  justify-content: center;
}
</style>
