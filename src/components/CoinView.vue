<template>
  <div class="coins">
    <ul class="coinList">
      <li v-for="coin in props.coins" :key="coin.key">
        <coin :coin="coin" class="coin" />
      </li>
    </ul>
  </div>
</template>

<script>
import Coin from "../components/Coin.vue";

export default {
  components: {
    Coin,
  },
  props: {
    coins: {
      type: Array,
      required: true,
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
.opace {
  opacity: 0.5;
}
.coin:hover {
  transition: 0.2s;
  box-shadow: 0px 1px 9px darkgrey;
  opacity: 1;
}
ul {
  list-style-type: none;
  flex-wrap: wrap;
  display: flex;
}
.coin {
  margin: 10px;
}

.title,
.content,
.asset {
  padding: 4px;
  text-transform: capitalize;
  text-align: center;
  border-bottom: 1px solid silver;
}
.title,
.coinApy {
  border-bottom: 1px solid silver;
}
.source {
  font-size: 1.25em;
}
</style>
