<template>
  <layout>
    <template v-slot:top>
      <top />
   
    </template>
    <template v-slot:content>
      <login />
    </template>
  </layout>
</template>
<script>
import Login from "../auth/Login.vue";
import Layout from "../Layout.vue";
import { useStore } from "vuex";
import Top from "../components/Top.vue";


import { computed, onMounted } from "vue";
export default {
  components: {
    Login,
    Layout,
    Top,
  },
  setup() {
    const store = useStore();
    const isAuthenticated = computed(() => {
      return store.state.auth.isAuthenticated
    })
    console.log(isAuthenticated)

    return {
      isAuthenticated,
      Login,
      Layout,
      pages: computed(() => {
        return store.state.layout.pages;
      }),
    };
  },
};
</script>