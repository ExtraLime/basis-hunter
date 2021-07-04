<template>
  <h3>Live Basis Rates (binance)</h3>
  <live-table />
</template>
<script>
import { onMounted } from "vue";
import { useStore } from "vuex";
import LiveTable from "../components/LiveTable.vue";

export default {
  components: {
    LiveTable,
  },
  setup() {
    const store = useStore();

    onMounted(() => {
      store.dispatch("table/getFundingData");
    });

    return {};
  },
};
</script>
