<template>
  <h3>Information by Coin and Time Interval</h3>
  <line-chart :id="`BasisChart`" :data='chartData.data' :labels='chartData.labels'></line-chart>
</template>
<script>
import { computed, onMounted } from "vue";
import { useStore } from "vuex";
import LineChart from "../components/LineChart.vue";

export default {
  components: {
    LineChart,
  },
  setup() {
    const store = useStore();

    onMounted(() => {
    store.dispatch("charts/getChartData",{name:'BasisChart'});
    
    });
    const chartData = computed(() => {
      return store.state.charts.basisChartData;
    });
    console.log(chartData)
    return {
      chartData
    };
  },
};
</script>
