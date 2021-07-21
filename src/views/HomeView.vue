<template>
  <layout>
    <template v-slot:top>
      <top />
      <spot-ticker />
    </template>
    <template v-slot:content>
      <login />
      <news-feed />
    </template>
  </layout>
</template>
<script>
import Login from "../auth/Login.vue";
import Layout from "../Layout.vue";
import { useStore } from "vuex";
import Top from "../components/Top.vue";
import NewsFeed from '../components/NewsFeed.vue'
import SpotTicker from '../components/live/SpotTicker.vue'

import { computed } from "vue";
export default {
  components: {
    Login,
    Layout,
    Top,
    NewsFeed,
    SpotTicker
  },
  setup() {
    const store = useStore();
    const isAuthenticated = computed(() => {
      return store.state.auth.isAuthenticated;
    });

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