<template>
  <div class="menu-container">
    <div><p>You're analzying </p></div>
    <ui-select
      v-model="selectedCoin"
      :options="coins"
      @selected="onSelected($event)"
    >
      Pick a Coin
    </ui-select>
    <div><p> at a </p></div>
    <ui-select
      v-model="selectedInterval"
      :options="intervals"
      @selected="onSelected($event)"
      :class="$tt('dodgerstyle')"
    >
      Pick a time interval
    </ui-select>
    <div><p>time interval.</p></div>
  </div>
</template>
<script>
import { useStore } from "vuex";
import { computed, onMounted, ref } from "vue";
export default {
  props: {
    coin: {
      type: String,
    },
    interval: {
      type: String,
    },
  },
  setup(props) {
    const selectedCoin = ref('ETH');
    const selectedInterval = ref('4h');
    const store = useStore();
    const coins = computed(() => {
      return store.state.charts.coins;
    });
    const intervals = computed(() => {
      return store.state.charts.intervals;
    });
    const onSelected = ($event) => {
      store.dispatch("charts/changeCoin", { selectedCoin, selectedInterval});
      store.dispatch("charts/getChartsData");
      return;
    };

    return {
      coins,
      intervals,
      onSelected,
      selectedCoin,
      selectedInterval,
    };
  },
};
</script>
<style scoped>

.menu-container {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  max-width: 50%;
  margin:1rem;
}
.menu-container.div.mdc-select.mdc-select--filled.mdc-select--focused.mdc-select--activated {
  color: "dodgerblue";
  float: right;
}
.mdc-typography--dodgerstyle {
  color: dodgerblue;
}
.mdc-select:not(.mdc-select--disabled).mdc-select--focused.mdc-floating-label {
  color: dodgerblue;
}
.mdc-select:not(.mdc-select--disabled).mdc-select--focused {
  color: dodgerblue;
}
.mdc-floating-label {
  color: dodgerblue;
}
p{
display:inline-flex;
margin:0px 4px 0px 4px;

}
</style>