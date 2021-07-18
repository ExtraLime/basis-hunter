<template>
  <h4>Live Market Rates (binance)</h4>
  <div class="live">
    <tick-plot />
    <tick-plot3 />
    <live-table />
  </div>
</template>
<script>
import { useStore } from "vuex";
import LiveTable from "../components/LiveTable.vue";
import TickPlot from "../components/TickPlot.vue";
import TickPlot3 from "../components/TickPlot3.vue";

export default {
  components: {
    LiveTable,
    TickPlot,
    TickPlot3,
  },
  setup() {
    const store = useStore();
    return {};
  },
};
</script>
<style scoped>
.live {
  display: grid;
  grid-template-columns: auto auto;
}
</style>