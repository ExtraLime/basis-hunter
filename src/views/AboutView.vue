<template>
  <div class="tab-select">
    <ui-tab-bar v-model="active">
      <ui-tab :key="0">Basis Trading</ui-tab>
      <ui-tab :key="1">Collecting Funding </ui-tab>
      <ui-tab :key="2">Margin Trading </ui-tab>
    </ui-tab-bar>
  </div>
  <div v-if="active === 0">
    <basis-trade />
    <basis-chart />
  </div>
  <div v-else-if="active===1" >
    this is for collecting funding data
    </div>
    <div v-else-if="active===2" >
    Explain risks about margin trading
    </div>
</template>
<script>
import { useStore } from "vuex";
import { computed, onMounted, ref } from "vue";
import BasisChart from "../components/BasisChart.vue";
import BasisTrade from "../components/BasisTrade.vue";

export default {
  components: {
    BasisChart,
    BasisTrade,
  },
  setup() {
    const store = useStore();
    onMounted(() => {
      store.dispatch("charts/setBasisChartData", "ETH");
    });

    const active = ref(0);
    const stream = computed(() => {
      const data = store.state.table.messages;
      const perp = data["ETHUSD_210924"];
      const basis = data["ETHUSD_210924"] - data["ETHUSD_PERP"];
      const apy = (basis / perp) * 400;

      return {
        qrt: data["ETHUSD_210924"],
        perp: data["ETHUSD_PERP"],
        basis: basis.toFixed(2),
        apy: apy.toFixed(2),
      };
    });
    return {
      stream,
      active
    };
  },
};
</script>
<style lang="scss" scoped >

.tab-select{
  display:block
}
.mdc-tab{
  width:100%

}
.mdc-tab.mdc-ripple-upgraded{
 background-color:white;
 width:15%

}
.tab-select{
  color:white
}
.mdc-tab.mdc-tab {
  color:yellow
}
.mdc-tab__text-label{
  color:'white'
}
</style>