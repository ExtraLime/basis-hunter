<template>
  <div class="news-container">
    <div class="news-wrap">
      <news-feed />
    </div>
  </div>
  <div class="ticker-container">
      <div class="ticker-wrap">
      <spot-ticker />
      </div></div>

 <div class='top-line'> <h4>Live Market Rates (binance)</h4>  <div>Last tick: {{ lastTick }}</div></div>

  <div class="live">
    <tick-plot />

    <live-table />
  </div>
</template>
<script>
import { useStore } from "vuex";
import LiveTable from "../components/live/LiveTable.vue";
import NewsFeed from "../components/live/NewsFeed.vue";
import TickPlot from "../components/live/TickPlot.vue";

import SpotTicker from '../components/live/SpotTicker.vue'
import { computed } from 'vue'
export default {
  components: {
    LiveTable,
    TickPlot,

    NewsFeed,
    SpotTicker

  },
  setup() {
    const store = useStore();
       const lastTick = computed(() => {
         const tickDate = new Date(store.state.live.messages.timestamp)
      return tickDate.toLocaleTimeString() ;
    });
    return {
      lastTick
    };
  },
};
</script>
<style >

@import url(./live.css);
</style>