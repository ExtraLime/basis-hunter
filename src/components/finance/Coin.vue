<template>
  <div class="coin">
    <a :href="props.coin.refer" target="_blank">
      <div class="coinTitle">
        <h3>{{ props.coin.asset }}</h3>
        <img :src="`${props.coin.url}`" width="30" height="30" alt="No Img" />
      </div>
      <div class="coinApy">
        <h2>{{ (props.coin.apy * 100).toFixed(2) }}%</h2>
      </div>
      <div class="coinSource">
        <p>{{ props.coin.source }}</p>
      </div>
      <div class="lock-section">
        <img
          :src="props.coin.icon === 'lock' ? lock : lockopen"
          :alt="props.coin.icon"
          width="20"
        />
      </div>
      <div class="isFlex?" :style="{}">
        <p v-if="props.coin.lock === 1">
          <span :class="`is${props.coin.lockTerm}`">
            {{ props.coin.lockTerm }} Days</span
          >
        </p>
        <p v-else class="isFlex">FLEX</p>
      </div>
    </a>
  </div>
</template>
<script>
import lock from "../../assets/lock.svg";
import lockopen from "../../assets/lock-open.svg";

export default {
  props: {
    coin: {
      type: Object,
    },
  },
  setup(props) {
    return { props, lock, lockopen };
  },
};
</script>
<style scoped>
.material-icons {
  display: flex;
  align-content: center;
  text-align: center;
  justify-content: center;
}
.isFlex {
  display: flex;
  justify-content: center;
  color: limegreen;
}
.is90 {
  color: red;
  display: flex;
  justify-content: center;
}
.is60 {
  color: orange;
  display: flex;
  justify-content: center;
}
.is30 {
  color: yellow;
  display: flex;
  justify-content: center;
}
.is15 {
  color: yellowgreen;
  display: flex;
  justify-content: center;
}
.is14 {
  color: yellowgreen;
  display: flex;
  justify-content: center;
}
.is7 {
  color: greenyellow;
  display: flex;
  justify-content: center;
}
.is0 {
  color: greenyellow;
  display: flex;
  justify-content: center;
}

.coin {
  display: grid;
  grid-template-columns: auto;
  grid-template-rows: auto auto auto auto auto;
  border: 1px solid silver;
  border-radius: 8px;
  width: 8rem;
  cursor: pointer;
  box-shadow: 0px 1px 3px darkgrey;
  transition: 0.2s;
  color: lightgrey;
}
h4 {
  font-weight: bold;
}
.coinTitle {
  background: #ff1493;
  color: black;
  border-top: 1px solid silver;
  border-bottom: 1px solid silver;
  text-align: center;

  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  display: inline-flex;
  justify-content: space-evenly;
  width: 100%;
  align-items: center;
  margin: 0;
  height: 5;
}
.coinSource {
  display: flex;
  justify-content: center;
  text-align: center;
  padding-top: 1rem;
}
.coinApy {
  text-align: center;
  border-bottom: 1px solid silver;
}
.lock-section {
  display: flex;
  justify-content: center;
  align-content: center;
  text-align: center;
  border-top: 1px solid silver;
  padding-top: 1rem;
}
a:link {
  text-decoration: inherit;
  color: lightgrey;
  padding: 0;
}
p {
  margin-top: 0px;
}
a:visited {
  text-decoration: inherit;
  color: lightgrey;
}
</style>