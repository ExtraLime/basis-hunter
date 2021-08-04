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
            <span :class="datum.style">{{
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
      { name: "24hr" },
      { name: "Spot" },
      { name: "Perpetual" },
      { name: "Quarterly" },
      { name: "Basis (theta)" },
      { name: "Basis Rate" },
      { name: "Funding Rate" },
    ];

    const tableRows = computed(() => {
      const tableData = store.state.live.messages;
      const fundingData = store.state.live.fundingData;
      const spotData = store.state.layout.spot;
      const d = coins.map((coin) => {
        let basis =
          parseFloat(tableData[`${coin}USD_210924`]) -
          parseFloat(tableData[`${coin}USD_PERP`]);

        let basisRate = basis / parseFloat(tableData[`${coin}USD_PERP`]);
        const coinName = `${coin}`;
        const fundingRate = fundingData[coinName];

        const perp = parseFloat(tableData[`${coin}USD_PERP`]);
        const qrt = parseFloat(tableData[`${coin}USD_210924`]);
        const spot = parseFloat(spotData[`${coin}USDT`][0]);
        const spotDelta = parseFloat(spotData[`${coin}USDT`][1]);

        return [
          { name: coin, id: 0, style: "rowname" },
          {
            name: spotDelta.toFixed(3) + "%",
            id: 1,
            style: spotDelta > 0 ? "green" : "red",
          },
          {
            name: spot.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
              minimumFractionDigits: 3, maximumFractionDigits: 3
            }),
            id: 2,
            style: "white",
          },
          { name: perp.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
              minimumFractionDigits: 3, maximumFractionDigits: 3
            }), id: 3, style: "white" },
          { name: qrt.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
              minimumFractionDigits: 3, maximumFractionDigits: 3
            }), id: 4, style: "white" },
          { name: basis.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
              minimumFractionDigits: 4, maximumFractionDigits: 4
            }), id: 5, style: basis > 0 ? "green" : "red" },
          {
            name: (basisRate * 100).toFixed(4)+'%',
            id: 6,
            style: basisRate > 0 ? "green" : "red",
          },
          {
            name: (fundingRate*100).toFixed(5)+'%',
            id: 7,
            style: fundingRate > 0 ? "green" : "red",
          },
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
  color: dodgerblue;
  border: 1px solid silver;
  margin: 0px;
  text-align: center;
}
th {
  border: 1px solid silver;
  font-size: 16px;

}
tr {
  border: 1px solid silver;
  padding:1rem
}
td {
  border: 1px solid silver;
  border-radius: 5%;
  padding:0.25rem;
}
.rowname {
  color: dodgerblue;
  font-size: 16px;
  font-weight: bold;
}
.white {
  color: white;
  font-weight: bold;
  font-size: 14px;
}
.green {
  color: limegreen;
  font-weight: bold;
  font-size: 14px;
}
.red {
  color: #c80815;
  font-weight: bold;
  font-size: 14px;
}
</style>