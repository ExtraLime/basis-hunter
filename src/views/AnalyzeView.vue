<template>
  <div class="coin-select">
    <coin-select :coin="analyzeCoin" :interval="analyzeInterval" />
  </div>
  <div class="analyze-charts">
    <analyze-charts :dData="chartsData" />
    <!-- <div class="histograms">
      <histo />
    </div> -->
  </div>
</template>
<script>
import { onMounted, computed, watchEffect } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import CoinSelect from "../components/analyze/CoinSelect.vue";
import AnalyzeCharts from "../components/analyze/AnalyzeCharts.vue";
import Histo from "../components/analyze/Histo.vue";

export default {
  components: {
    CoinSelect,
    AnalyzeCharts,
    // Histo,
  },
  setup() {
    const store = useStore();
    const route = useRoute();
    onMounted(() => {
      store.dispatch("charts/getChartsData");
    });


    const chartsData = computed(() => {
      const data = store.state.charts.chartsData;
      return data;
    });
    const analyzeCoin = computed(() => {
      return store.state.charts.analyzeCoin;
    });
    const analyzeInterval = computed(() => {
      return store.state.charts.analyzeInterval;
    });

    return {
      analyzeCoin,
      analyzeInterval,
      chartsData,
    };
  },
};
</script>
<style scoped>
.histograms {
  display: grid;
  grid-template-columns: auto auto auto;
}
.charts {
  display: grid;
  grid-template-columns: auto auto;
  max-width: 75%;
  justify-content: "center";
}
h3 {
  color: white;
  justify: center;
}
.coin-select {
  justify-content: center;
  display: flex;
  margin: 1rem;
}
.analyze-charts {
  display: grid;
  justify-content: center;
}
.mdc-select:not(.mdc-select--disabled).mdc-select--focused .mdc-floating-label {
  color: dodgerblue;
}
.mdc-select--focused .mdc-floating-label {
  color: dodgerblue;
}
</style>
