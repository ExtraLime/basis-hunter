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

// <!-- //   <template><div class="charts">{{analyzeCoin}}
    <line-chart
      id="basis"
      :name="`basis`"
      :options="chartData.apexCharts.basis.chartOptionsData"
      :series="chartData.apexCharts.basis.seriesData"
    ></line-chart>
    <line-chart
      id="funding"
      :name="`funding`"
      :options="chartData.apexCharts.funding.chartOptionsData"
      :series="chartData.apexCharts.funding.seriesData"
    ></line-chart>
    <line-chart
      id="bvf"
      :name="`bvf`"
      :options="chartData.apexCharts.bvf.chartOptionsData"
      :series="chartData.apexCharts.bvf.seriesData"
    ></line-chart>
    <line-chart
      id="fRates"
      :name="`fRates`"
      :options="chartData.apexCharts.fRates.chartOptionsData"
      :series="chartData.apexCharts.fRates.seriesData"
    ></line-chart>
  </div> -->
<!-- // </template> -->
<script>
import { useStore } from "vuex";
import VueApexCharts from "vue3-apexcharts";
import { computed, onMounted, reactive } from "vue";
import LineChart from './LineChart.vue'
export default {
 components: {
    // apexcharts: VueApexCharts,
   LineChart,

  },
  props:{
    dData:{
      type:Object,
    }
  },
  setup(props) {
    const store = useStore();
computed(() =>{
      const data = store.state.charts.chartsData

      return data
    })
    const chartsData = reactive({})
    // setTimeout(()=>{
    //   chartsData.data = computed(()=>{
    //     return store.state.charts.chartsData
    //   })
      
    // },2000)
    console.log(props)
    // console.log(chartsData)
    // const chartData = reactive({
    //   chartOptions: chartsData.value.apexCharts.basis.chartOptions,
    //   series: chartsData.value.apexCharts.basis.series})
    // console.log(chartsData,chartData)
    return {
      // chartData,
      chartsData,
      props

    }
  },
};
</script>
<style scoped>
</style>