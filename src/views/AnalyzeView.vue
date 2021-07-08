<template>
  <h3>Information by Coin and Time Interval</h3>
<div class='charts'>
  <line-chart
    id="basis"
    :name="`basis`"
    :options="dd.apexCharts.basis.chartOptionsData"
    :series="dd.apexCharts.basis.seriesData"
  ></line-chart>
  <line-chart
    id="funding"
    :name="`funding`"
    :options="dd.apexCharts.funding.chartOptionsData"
    :series="dd.apexCharts.funding.seriesData"
  ></line-chart>
  <line-chart
    id="bvf"
    :name="`bvf`"
    :options="dd.apexCharts.bvf.chartOptionsData"
    :series="dd.apexCharts.bvf.seriesData"
  ></line-chart>
  <line-chart
    id="fRates"
    :name="`fRates`"
    :options="dd.apexCharts.fRates.chartOptionsData"
    :series="dd.apexCharts.fRates.seriesData"
  ></line-chart>
  </div>
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
      store.dispatch("charts/getChartData", { name: "BasisChart" });
    });
    const chartData = computed(() => {
      return store.state.charts.basisChartData;
    });
    const dd = computed(() => {
      return store.state.charts.chartsData;
    });
    console.log(dd);
    console.log(chartData);
    return {
      chartData,
      dd,
    };
  },
};
</script>
<style scoped>
.charts {
  display:grid;
  grid-template-columns: auto auto;
}
h3 {
  color:white;
  justify:center;
}
</style>
