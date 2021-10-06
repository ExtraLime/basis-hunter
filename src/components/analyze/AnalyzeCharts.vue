<template>
  <div class="charts">
    <line-chart
      id="basis"
      :name="`basis`"
      :options="props.dData.apexCharts.basis.chartOptionsData"
      :series="props.dData.apexCharts.basis.seriesData"
    ></line-chart>
    <line-chart
      id="funding"
      :name="`funding`"
      :options="props.dData.apexCharts.funding.chartOptionsData"
      :series="props.dData.apexCharts.funding.seriesData"
    ></line-chart>
    <line-chart
      id="bvf"
      :name="`bvf`"
      :options="props.dData.apexCharts.bvf.chartOptionsData"
      :series="props.dData.apexCharts.bvf.seriesData"
    ></line-chart>
    <line-chart
      id="fRates"
      :name="`fRates`"
      :options="props.dData.apexCharts.fRates.chartOptionsData"
      :series="props.dData.apexCharts.fRates.seriesData"
    ></line-chart>
  </div>
</template>
<script>
import { useStore } from "vuex";

import { computed, reactive } from "vue";
import LineChart from "./LineChart.vue";
export default {
  components: {
    LineChart,
  },
  props: {
    dData: {
      type: Object,
    },
  },
  setup(props) {
    const store = useStore();
    computed(() => {
      const data = store.state.charts.chartsData;

      return data;
    });
    const chartsData = reactive({});

    return {
      chartsData,
      props,
    };
  },
};
</script>
<style scoped>
.mdc-select:not(.mdc-select--disabled).mdc-select--focused .mdc-floating-label {
  color: dodgerblue;
}
</style>