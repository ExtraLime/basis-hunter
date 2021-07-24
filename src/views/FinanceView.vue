<template>
  <div>Welcom to the Finance Page</div>
  <div>Use the filter to find the right product for you</div>
  <div class="finance">
  <coin-filter />
    <div class='coin-results'>
      <coin-view :coins="coins" />
    </div>
  </div>
</template>
<script>
import { useStore } from "vuex";
import { onMounted, onUnmounted, computed, ref } from "vue";
import CoinFilter from "../components/CoinFilter.vue";
import CoinView from "../components/CoinView.vue";
export default {
  components: { 
    CoinView,
    CoinFilter
  },
  setup() {
    const store = useStore();

    onMounted(async () => {
      await store.dispatch("finance/getFlaskRates");
    });
    
    onUnmounted(() => {
      store.dispatch("finance/setFinanceCoin", null);
    });

    return {
      coins: ref(computed(() => store.state.finance.filteredResults)),
      financeCoin: ref(computed(() => store.state.finance.financeCoin)),
    };
  },
};
</script>
<style  scoped>
.coins {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
width:40rem;
  margin: 10px;
}
.finance{
    width:75rem;
    display:grid;
    grid-template-columns: auto auto;
    justify-content: center;
}
label{
    color:dodgerblue
}
</style>