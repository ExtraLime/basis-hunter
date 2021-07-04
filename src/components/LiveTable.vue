<template>
    <div>Last tick: {{lastTick}}</div>
  <table class="table">
    <thead>
      <slot name="columns">
        <tr>
          <th v-for="column in columns" :key="column.name">{{ column.name }}</th>
        </tr>
      </slot>
    </thead>
    <tbody>
      <tr v-for="row in tableRows" :key="row.coin">
        <slot :row="row">
          <td v-for="datum in row" :key="datum.id">
            {{ datum.name === 0 ? datum.name : datum.name ? datum.name : 'waiting'  }}
          </td>
        </slot>
      </tr>
    </tbody>
  </table>
  
</template>
<script>
import { computed, onMounted } from "vue";
import { useStore } from "vuex";

export default {
  props: {
    datum: {
      type: null,
    },
  },
  setup() {
    onMounted(() => {
      updateFunding;
      store.dispatch("table/subscribe");
      store.dispatch('table/getCoinList');   
    });
    const store = useStore();  
    const coins = [
      "ADA",
      "BCH",
      "BNB",
      "BCH",
      "BTC",
      "DOT",
      "ETH",
      "LINK",
      "LTC",
      "XRP",
    ];
    const columns = [
     {name: "Coin"},
     {name: "Perpetual"},
     {name: "Quarterly"},
     {name: "Basis"},
     {name: "Basis Rate"},
     {name: "Funding Rate"},
    ];


    const tableRows = computed(() => {
      const tableData = store.state.table.messages;
      const fundingData = store.state.table.fundingData;
      const d = coins.map((coin) => {
        let basis =
          parseFloat(tableData[`${coin}USD_210924`])-
          parseFloat(tableData[`${coin}USD_PERP`]);
          
        let basisRate = basis / parseFloat(tableData[`${coin}USD_PERP`]);
        const coinName = `${coin}`;
        const fundingRate = fundingData[coinName]
  
        const perp = parseFloat(tableData[`${coin}USD_PERP`])
        const qrt = parseFloat(tableData[`${coin}USD_210924`])
        return [
          { name:coin,id : 0 },
          { name:perp.toFixed(4),id : 1 },
          { name:qrt.toFixed(4),id : 2 },
          { name:basis.toFixed(4),id : 3 },
          { name:(basisRate *10).toFixed(4),id : 4 },
          { name:fundingRate,id : 5 }
        ];      });

      return d;
    });
    const lastTick = computed(() => {
      return new Date(store.state.table.messages.timestamp);
    });
    const updateFunding = setInterval(() => {
      store.dispatch("table/getFundingData");
    }, 10000);

    return {
      tableRows,
      coins,
      columns,
      lastTick,
      
    };
  },
};
</script>

<style scoped>
table {
  color: white;
  background: #202220;
  font-size:12px;
}
</style>