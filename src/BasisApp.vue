<template>
  <layout>
    <template v-slot:top>
      <top :user="user" :isAuthenticated="isAuthenticated" />
    </template>
    <template v-slot:content>
      <div v-if="!isAuthenticated">
        Welcome to Basis Trade a centralized hub for information concerning
        crypto, basis rates savings and staking rates. If you dont have an
        account, contact someone... Otherwise, login
        <login />
      </div>
      <div v-else>
        <router-view />
      </div>
    </template>
  </layout>
</template>

<script>
import { computed, onMounted, watch, watchEffect } from "vue";
import { useStore } from "vuex";

import { useRoute, useRouter } from "vue-router";
import Top from "./components/Top.vue";
import Layout from "./Layout.vue";
import Login from "./auth/Login.vue";


export default {
  components: {
    Top,
    Layout,
    Login,
  },

  setup() {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();

    watchEffect(() =>{
        const currentUser = computed(() => {
          return store.state.auth.user
        })

        if (!currentUser.value){
            return router.push('/')
        }
 
    })

    onMounted(() => {
      store.dispatch("table/getFundingData");
      store.dispatch("charts/getChartsData");
      store.dispatch("table/subscribe");
      store.dispatch('finance/getRatesData')
    });

    return {
      user: computed(() => {
        return store.state.auth.user;
      }),
      isAuthenticated: computed(() => {
        return store.state.auth.isAuthenticated;
      }),
    };
  },
};
</script>

<style lang="scss" scoped>
body {
  background-color: black;
  margin: 0;
  color: dodgerblue;
  justify-content: center;
  display: flex;
}
* {
  box-sizing: border-box;
}
</style>
