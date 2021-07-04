<template>
  <div class="chart-area" id="chart-area">
    <div style="height: 600px; width: 750px">
      <vue3-chart-js
        :id="lineChart.id"
        :type="lineChart.type"
        :data="lineChart.data"
      ></vue3-chart-js>
    </div>
  </div>
</template>

<script>
import Vue3ChartJs from "@j-t-mcc/vue3-chartjs";

export default {
  components: {
    Vue3ChartJs,
  },
  props: {
    data: {
      type: Array,
      required: true,
    },
    labels: {
      type: Array,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const lineChart = {
      id: props.id,
      type: "line",
      data: {
        labels: props.labels,
        datasets: [
          {
            label: "Perptual vs Spot Price",
            data: props.data,
            fill: false,
            borderColor: "rgb(75, 192, 192)",
            tension: 0.1,
          },
        ],
      },
    };

    // const beforeRenderLogic = (event) => {
    //   //...
    //   //if(a === b) {
    //   //  event.preventDefault()
    //   //}
    // }

    return {
      lineChart,
    };
  },
};
</script>
