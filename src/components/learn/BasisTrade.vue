<template>
  <div class="basis-trade">
    <section class="intro">
      <h2 class="point">The Basis Trade</h2>
      <h4 class="intro-text">
        Basis Trading or "Cash and Carry" Abritrage is a fairly simple concept
        to grasp. Say a lumber broker makes a contract with The Home Depot to deliver 1
        container of lumber in one month's time for $5500. If the current price
        in the market is $5000, the broker could buy the lumber now and arrange for delivery in a month.
        The broker pockets the $500 ($5500-$5000). This $500 represents the basis for the given asset lumber.
        The basis rate is the percentage this premium represents over the spot price. In this example .10 or 10%.
        In financial markets, these basis rates are found in various instruments and are usually considered 'risk-free' rates of return.
        
      </h4>
      <div class="middle-text">
        <h4>
          In terms of cryptocurrencies, it is gernerally the same idea. For some
          assets, at any given time (literally), there are active markets with quarterly
          contracts and spot markets. So at any given point during a
          quarter, one can sell the quarterly contract for ETH at a premium
          (contango) to the spot price. Right Now, one would sell 1 ETHUSD_210924
          for <span class="short">${{ stream.qrt }} </span> and buy 1 ETH in the
          spot market for <span class="long"> ${{ stream.perp }}</span
          >. This means a profit of:
          <span :class="stream.basis < 0 ? 'short' : 'long'"
            >${{ stream.basis }}</span
          >
          is locked in and will be realized on Sept 24. 2021. Providing an
          annual return of roughly:
          <span :class="stream.basis < 0 ? 'short' : 'long'">
            {{ stream.apy }}%</span
          >
          (assuming the trade is the same duration of a quarter)
        </h4>
      </div>
      <div class="middle-text">
        <h4>
          Check out the recent basis rates in the chart below. You can take a
          deeper dive on the
          <router-link :to="'/analyze'"> Analyze tab</router-link>.
        </h4>
      </div>
    </section>
  </div>
  <div class="basis-chart">
    <all-basis />
  </div>
</template>
<script>
import { useStore } from "vuex";
import { computed } from "vue";

import AllBasis from "./AllBasis.vue";

export default {
  components: {
    AllBasis,
  },
  setup() {
    const store = useStore();
    const stream = computed(() => {
      const data = store.state.live.messages;
      const perp = data["ETHUSD_210924"];
      const basis = data["ETHUSD_210924"] - data["ETHUSD_PERP"];
      const apy = (basis / perp) * 400;

      return {
        qrt: data["ETHUSD_210924"],
        perp: data["ETHUSD_PERP"],
        basis: basis.toFixed(2),
        apy: apy.toFixed(2),
      };
    });
    return {
      stream,
    };
  },
};
</script>
<style scoped lang: scss>
.basis-chart {
  margin-bottom: 3rem;
}
.middle-text {
  display: inline-block;
  justify-content: center;
  width: 50rem;
}
.point {
  align-self: center;
}
.long {
  color: green;
}
.short {
  color: red;
}
.intro-text {
  width: 50rem;
  display: inline-block;
}
.intro {
  width: 100%;
  display: grid;
}
.basis-trade {
  display: grid;
  justify-content: center;
}
section {
  display: flex;
  flex-wrap: wrap;
  align-self: center;
  text-align: center;
  width: 50rem;
  justify-content: center;
}
.basis-plot {
  display: flex;
  justify-content: center;
}
</style>