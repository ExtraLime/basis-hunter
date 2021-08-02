<template>
  <div class="price-card">
    <img :src="props.coinData.url" width="30" alt="coincard" />

    <h5>{{ props.coinData.coinName }}</h5>

    <h4>{{ props.coinData.lastPrice }}</h4>
    <h6 :class="props.coinData.pctChg > 0 ? 'green' : 'red'">
      %{{ props.coinData.pctChg }}
    </h6>
  </div>
</template>
<script>
export default {
  props: {
    coinData: {
      type: Object,
    },
  },
  setup(props) {
    return {
      props,
    };
  },
};
</script>
<style scoped>
.price-card {
  display: inline-flex;

  height: 30px;
  width: 250px;
  padding: 0 1rem;
  align-items: center;
  justify-content: space-evenly;
}
.red {
  color: red;
}
.green {
  color: green;
}

.lastPrice {
  margin: 0;
}
</style>