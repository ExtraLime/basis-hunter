<template>
  <layout>
    <template v-slot:top>
      <top />
            <news-feed />
      <spot-ticker />
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
import Top from "../components/global/Top.vue";
import NewsFeed from "../components/live/NewsFeed.vue";
import SpotTicker from "../components/live/SpotTicker.vue";

import { computed } from "vue";
export default {
  components: {
    Login,
    Layout,
    Top,
    NewsFeed,
    SpotTicker,
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