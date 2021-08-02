<template>
  <div class="news-container">
    <div class="news-wrap">
      <news-feed />
    </div>
  </div>
  <!-- <div class="ticker-container">
    <div class="ticker-wrap">
      <spot-ticker />
    </div>
  </div> -->

  <div class="top-line">
    <h4>Live Market Rates (binance) </h4>
    <div class='lastTick'>-Last tick: {{ lastTick }}</div>
  </div>

  <div class="live">
    <div class="basis-tick">
      <basis-tick />
    </div>
    <div class="live-table">
      <live-table />
    </div>

    <div class="funding-tick">
      <funding-tick />
    </div>
  </div>
</template>
<script>
import { useStore } from "vuex";
import LiveTable from "../components/live/LiveTable.vue";
import NewsFeed from "../components/live/NewsFeed.vue";
import BasisTick from "../components/live/BasisTick.vue";
import FundingTick from "../components/live/FundingTick.vue";

import SpotTicker from "../components/live/SpotTicker.vue";
import { computed } from "vue";
export default {
  components: {
    LiveTable,
    BasisTick,
    NewsFeed,
    // SpotTicker,
    FundingTick,
  },
  setup() {
    const store = useStore();
    const lastTick = computed(() => {
      const tickDate = new Date(store.state.live.messages.timestamp);
      return tickDate.toLocaleTimeString();
    });
    return {
      lastTick,
    };
  },
};
</script>
<style >
@import url(./live.css);
</style>