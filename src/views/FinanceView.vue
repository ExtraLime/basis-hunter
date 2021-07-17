<template>
  <div>Welcom to the Finance Page</div>
  <div>Use the filter to find the right product for you</div>
  <div class="finance">
    <div class="filter">
        <h4>Search by Coin</h4>
      <input @input="setCoins" :value="financeCoin" />
      <ui-form-field>
  <ui-checkbox v-model="stable" input-id="stable"></ui-checkbox>
  <label for="stable">{{stable}}</label>
   <ui-checkbox v-model="isFlex" input-id="isFlex"></ui-checkbox>
  <label for="isFlex">{{isFlex}}</label>
</ui-form-field>
    </div>
    <div class='coin-results'>
      <coin-view :coins="coins" />
    </div>
  </div>
</template>
<script>
import { useStore } from "vuex";
import { onMounted, onUnmounted, computed, ref } from "vue";
import Coin from "../components/Coin.vue";
import CoinView from "../components/CoinView.vue";
export default {
  components: { 
    CoinView,
  },
  setup() {
    const store = useStore();
    const stable = ref(false)
    const isFlex = ref(false)
    onMounted(async () => {
      await store.dispatch("finance/getRatesData");
    });
    const setCoins = ($event) => {
      store.dispatch("finance/setFinanceCoin", $event.target.value);
    };
    onUnmounted(() => {
      store.dispatch("finance/setFinanceCoin", null);
    });

    return {
      coins: ref(computed(() => store.state.finance.filteredResults)),
      financeCoin: ref(computed(() => store.state.finance.financeCoin)),
      setCoins,
      stable,
      isFlex
    };
  },
};
</script>
<style  scoped>
.coins {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  width: 75%;
  margin: 10px;
}
.finance{
    width:75%;
    display:grid;
    grid-template-columns: auto auto;
}
</style>