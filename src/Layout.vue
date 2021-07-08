<template>
    <div class="wrapper">
        <div class="header">
            <slot name='top' />
        </div>
        
        <div class="main">
            <div class="content">
                <slot name='content' />
            </div>
        </div>        
          
    </div>
</template>
<style scoped>
.wrapper {
  height: 100vh;
}
.header {
  height: 75px;
  display: flex;
  align-items: center;
  font-size: 24px;
  font-family: Arial;
  background-color: dodgerblue;

}
.main {
  height: calc(100vh - 50px);
  border-top: 2px solid silver;
  display: flex;
  background-color: white;
  border-radius: 3%;

}
.sidebar { 
  border-radius: 3%;

  flex-grow: 0;
  flex-shrink: 0;
  flex-basis: 200px;
  background-color:black

}
.content {
  width: 100%;
  background-color:black;
  color:white;

}
</style>