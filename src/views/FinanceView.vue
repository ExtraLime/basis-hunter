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
      await store.dispatch("finance/getRatesData");
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
  width: 500px;
  margin: 10px;
  height:100vh;
}
.finance{
    width:75%;
    display:grid;
    grid-template-columns: auto auto;
}
label{
    color:dodgerblue
}
</style>