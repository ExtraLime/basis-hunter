<template>
  <div class="tab-select">
    <ui-tab-bar v-model="active">
      <ui-tab :key="0">Prerequisites</ui-tab>
      <ui-tab :key="1">Basis Trading</ui-tab>
      <ui-tab :key="2">Collecting Funding </ui-tab>
      <ui-tab :key="3">Margin Trading </ui-tab>
    </ui-tab-bar>
  </div>
  <div class="tab-page" v-if="active === 0">
    <prereqs />
  </div>
  <div class="tab-page" v-if="active === 1">
    <basis-trade />
  </div>
  <div class="tab-page" v-else-if="active === 2">
    <collect-funding />
  </div>
  <div class="tab-page" v-else-if="active === 3">
    <margin />
  </div>
</template>
<script>
import { useStore } from "vuex";
import { computed, onMounted, ref } from "vue";

import BasisTrade from "../components/learn/BasisTrade.vue";
import Prereqs from "../components/learn/Prereqs.vue";
import CollectFunding from "../components/learn/CollectFunding.vue";
import Margin from "../components/learn/Margin.vue";
import { useConfirm } from "balm-ui";
export default {
  components: {
    CollectFunding,
    BasisTrade,
    Prereqs,
    Margin,
  },
  setup() {
    const store = useStore();
    onMounted(() => {
      store.dispatch("charts/initChartData");
      show({
        message:
          "Welcome to BasisTrade. This is an informational platform only. BasisTrade does not give investment advice. In addition, an individual's place of residence may prohibit them from being offered crypto derivative products. Please check the regulations in your jurisdiction. Lastly, trade responsibly.",
        acceptText: "I understand",
        cancelText: "I still understand",
      });
    });
    const confirmed = false;
    const show = useConfirm();

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
      active,
    };
  },
};
</script>
<style lang="scss" scoped >
.mdc-tab__text-label {
  color: dodgerblue;
}
.tab-page {
  width: 100%;
  display: grid;
  justify-content: center;
}
.tab-select {
  display: inline-flex;
  width: 100%;
  justify-content: center;
  flex-grow: 0;
  flex-shrink: 0;
}

.mdc-tab.mdc-ripple-upgraded {
  background-color: white;
  width: 15%;
  color: black;
}
</style>