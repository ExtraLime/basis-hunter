<template>
  <layout>
    <template v-slot:top>
      <top :user="user" :isAuthenticated="isAuthenticated" />
    </template>
    <template v-slot:content>
      <div class='welcome' v-if="!isAuthenticated">
       <h4> Welcome to Basis Trade a centralized hub for information concerning
        crypto, basis rates savings and staking rates. If you dont have an
        account, contact someone... Otherwise, login</h4>
        <login />
      </div>
      <div v-else>
        <router-view />
      </div>
    </template>
  </layout>
</template>

<script>
import { computed, onMounted, watchEffect } from "vue";
import { useStore } from "vuex";

import { useRoute, useRouter } from "vue-router";
import Top from "./components/global/Top.vue";
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

    watchEffect(() => {
      const currentUser = computed(() => {
        return store.state.auth.user;
      });

      if (!currentUser.value) {
        return router.push("/");
      }
    });

    onMounted(() => {
      store.dispatch("live/getFundingData");
      store.dispatch("charts/getChartsData");
      store.dispatch("live/subscribe");
      store.dispatch("layout/spotSubscribe");
      store.dispatch("charts/initChartData");
      store.dispatch("charts/getKLineHistogramData", "ETH");
      store.dispatch("finance/getFlaskRates");
      store.dispatch("layout/getHistoricalFunding");
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
  width: 100%;
}
.welcome{
  display:grid;
  align-self: center;
  justify-content: center;
  text-align: center;
}
h4{
  width:40rem;
  margin-left:0;
  margin-right:0;

  text-align: center;
  align-self: center;
}
</style>
