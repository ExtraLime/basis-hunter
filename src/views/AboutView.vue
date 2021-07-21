<template>
  <div class="tab-select">
    <ui-tab-bar v-model="active">
      <ui-tab :key="0">Prerequisites</ui-tab>
      <ui-tab :key="1">Basis Trading</ui-tab>
      <ui-tab :key="2">Collecting Funding </ui-tab>
      <ui-tab :key="3">Margin Trading </ui-tab>
    </ui-tab-bar>
  </div>
  <div class='tab-page' v-if="active === 0">
    <prereqs />
  </div>
  <div class='tab-page' v-if="active === 1">
    <basis-trade />
  </div>
  <div class='tab-page' v-else-if="active===2" >
    this is for collecting funding data
    </div>
    <div class='tab-page' v-else-if="active===3" >
    Explain risks about margin trading
    </div>
</template>
<script>
import { useStore } from "vuex";
import { computed, onMounted, ref } from "vue";

import BasisTrade from "../components/about/BasisTrade.vue";
import Prereqs from "../components/about/Prereqs.vue"

export default {
  components: {

    BasisTrade,
    Prereqs
  },
  setup() {
    const store = useStore();
    onMounted(() => {
      store.dispatch("charts/setBasisChartData", "ETH");
    });

    const active = ref(0);
    const stream = computed(() => {
      const data = store.state.live.messages;
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

.mdc-tab__text-label{
  color:dodgerblue
}
.tab-page{
  width:100%;
  display:grid;
  justify-content:center
}
.tab-select{
  display:inline-flex;
  width:100%;
  justify-content:center;
  overflow:hidden;
  flex-grow:0;
  flex-shrink:0
}
// .mdc-tab{
//   width:100%

// }
.mdc-tab.mdc-ripple-upgraded{
 background-color:white;
 width:15%;
 color:black

}
// .tab-select{
//   color:white
// }
// .mdc-tab.mdc-tab {
//   color:yellow;
//   width:15rem;
// }
// .mdc-tab__text-label{
//   color:'white'
// }
// .mdc-tab-scroller__scroll-content{
//   width:50rem;
// }
</style>