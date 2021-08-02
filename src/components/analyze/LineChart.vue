<template>
  <div class="example">
    <apexcharts
      width="500"
      height="350"
      type="line"
      :options="opts"
      :series="sers"
    ></apexcharts>
  </div>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";
import VueApexCharts from "vue3-apexcharts";
export default {
  name: "LineChart",
  components: {
    apexcharts: VueApexCharts,
  },
  props: {
    name: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const store = useStore();
    const opts = computed(() => {
      return store.state.charts.chartsData.apexCharts[props.name].chartOptions;
    });
    const sers = computed(() => {
      return store.state.charts.chartsData.apexCharts[props.name].series;
    });

    return {
      opts,
      sers,
    };
  },
};
</script>
