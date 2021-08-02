<template>
  <table class="table">
    <thead>
      <slot name="columns">
        <tr>
          <th v-for="column in columns" :key="column.name">
            {{ column.name }}
          </th>
        </tr>
      </slot>
    </thead>
    <tbody>
      <tr v-for="row in tableRows" :key="row.coin">
        <slot :row="row">
          <td v-for="datum in row" :key="datum.id">
            <span :class="coins.includes(datum.name) ? 'rowname' : datum.name > 0 ? 'green' : 'red'">{{
              datum.name === 0
                ? datum.name
                : datum.name
                ? datum.name
                : "waiting"
            }}</span>
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
      // store.dispatch("table/subscribe");
      store.dispatch("live/getCoinList");
    });
    const store = useStore();
    const coins = [
      "ADA",
      "BCH",
      "BNB",
      "BTC",
      "DOT",
      "ETH",
      "LINK",
      "LTC",
      "XRP",
    ];
    const columns = [
      { name: "Coin" },
      { name: "Perpetual" },
      { name: "Quarterly" },
      { name: "Basis (theta)" },
      { name: "Basis Rate" },
      { name: "Funding Rate" },
    ];

    const tableRows = computed(() => {
      const tableData = store.state.live.messages;
      const fundingData = store.state.live.fundingData;
      const d = coins.map((coin) => {
        let basis =
          parseFloat(tableData[`${coin}USD_210924`]) -
          parseFloat(tableData[`${coin}USD_PERP`]);

        let basisRate = basis / parseFloat(tableData[`${coin}USD_PERP`]);
        const coinName = `${coin}`;
        const fundingRate = fundingData[coinName];

        const perp = parseFloat(tableData[`${coin}USD_PERP`]);
        const qrt = parseFloat(tableData[`${coin}USD_210924`]);
        return [
          { name: coin, id: 0 },
          { name: perp.toFixed(4), id: 1 },
          { name: qrt.toFixed(4), id: 2 },
          { name: basis.toFixed(4), id: 3 },
          { name: (basisRate * 10).toFixed(4), id: 4 },
          { name: fundingRate, id: 5 },
        ];
      });

      return d;
    });

    const updateFunding = setInterval(() => {
      store.dispatch("live/getFundingData");
    }, 10000);

    return {
      tableRows,
      coins,
      columns,
    };
  },
};
</script>

<style scoped>
table {
  background: black;
  font-size: 12px;
  color:dodgerblue;
  border: 1px solid silver;
  margin:2rem;
  text-align:center;
}
th{
  border:1px solid silver;
  font-size:16px
}
tr{
  border:1px solid silver;
}
td{
  border:1px solid silver;
  border-radius: 5%;
}
.rowname{
  color:dodgerblue;
  font-size:16px;
  font-weight: bold;
}
.green {
  color: limegreen;
  font-weight:bold;
  font-size: 14px;
}
.red {
  color: #C80815;
  font-weight:bold;
    font-size: 14px;
}

</style>