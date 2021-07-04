<template>
  <layout>
      <template v-slot:top>
        <top />
      </template>
      <template v-slot:sidebar>
        <link-item
        v-for='page in pages' :key='page.name' :page='page'></link-item>
    </template>
    <template v-slot:content>
            <router-view />
    </template>

  </layout>
</template>

<script>
import { computed, onMounted } from "vue";
import { useStore } from "vuex";
import Top from "./components/Top.vue";
import Layout from "./Layout.vue"
import LinkItem from "./components/LinkItem.vue"


export default {
  components: {
    Top,
    Layout,
    LinkItem
  },

  setup() {
    const store = useStore();

    onMounted(() => {
      store.dispatch("table/getFundingData");
      store.dispatch("charts/getAnalyzeData");
    });

    const pages = computed(() => {
      return store.state.layout.pages;
    });
    return {
      pages
    };
  },
};
</script>

<style lang="scss" scoped>
body {
  background-color: black;
  margin:0;
}
* {
    box-sizing: border-box;
    
}
a {
  background:  #202222;
  color: white;
  border: none;
  padding: 10px;
  margin: 0 10px 5px 0;
  font-size: 18px;

  transition: .1s;
  width: 100%;
  display: block;
  text-align: center;
  text-decoration: none;
  font-family: Times;
  
}
a:hover {
  filter: brightness(120%);
  cursor: pointer;
  transition: .1s;
}
</style>
