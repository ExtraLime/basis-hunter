<template>
  <div class="collect">
    <section class="intro">
      <h2 class="point">Collecting Funding</h2>
      <h4 class="intro-text">
        On the Learn tab, it was mentioned that there is a funding rate
        associated with the perpetual swap market. The mechanics of the funding
        rate will not be presented here however the main purpose of this funding
        rate is to
        <a href="https://www.binance.com/en/support/faq/360033525031" alt=""
          >"force convergence of prices between the perpetual contract and the
          underlying asset."</a
        >
        The funding rate can also be viewed as an opportunity to earn fixed
        income. Before getting into the details, it is important to note that
        when the market is in contango, the perpetual swap price is above the
        spot price. In these circumstances the funding rate is usually positive
        and those holding long positions pay a funding fee to those holding
        short positions. When the market is in backwardation, the opposite is
        true; the shorts pay the longs.
      </h4>
      <!-- <usdt-funding /> -->
      <div class="middle-text">
        <h4>
        The rates and funding intervals differ across exchanges. On Binance, it usually hovers around .01%
        in normal market conditions, but has outer bounds at -0.375% and 0.375%. The funding interval is 8 hours.
        Currently, the funding rate for is ETH in the coin settlement market is
        <span :class="spot.fee < 0 ? 'short' : 'long'">{{ rate }}%</span>
        (binance). Therefor one could buy 1 ETH in the spot market for
        <span class="long">${{ spot.price }} </span> and sell 1 ETH in the
        perpetual spot market at: <span class="short"> ${{ stream.perp }}</span
        >. This means every 8 hours
        <span :class="spot.fee < 0 ? 'short' : 'long'">${{ spot.fee }}</span>
        worth of ETH could be collected/paid. This doesn't seem like much of a
        return on ${{ (parseFloat(stream.perp)+parseFloat(spot.price)).toFixed(2) }}. Assuming a constant price and rate,
        thats
        <span :class="spot.fee < 0 ? 'short' : 'long'">${{ spot.daily }} </span>
        a day, or
        <span :class="spot.fee < 0 ? 'short' : 'long'">${{ spot.yearly }}</span>
        a year.</h4>
      </div>
            <div class="middle-text">
 <h4>
      Check out the funding rates  over time below. Get an idea of how much can be collected on the <router-link :to="'/analyze'"> Analyze tab</router-link>.
    </h4>
      </div>
        <div class='funding-chart'>
       <usdt-funding-chart />
  </div>
      
    </section>
  </div>
</template>
<script>
import { useStore } from "vuex";
import { computed, ref } from "vue";

import UsdtFundingChart from "./UFundingChart.vue";

export default {
  components: {
    UsdtFundingChart,
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
    const funding = computed(() => {
      return store.state.live.uFunding;
    });
    const rate = (parseFloat(funding.value.ETH) * 100).toFixed(4);
    const spot = computed(() => {
      const data = store.state.layout.spot;
      const price = parseFloat(data.ETHUSDT[0]).toFixed(2);
      const fee = (parseFloat(funding.value.ETH) * price).toFixed(4);
      const daily = (fee * 3).toFixed(2);
      const yearly = (daily * 365).toFixed(2);
      return { price, fee, yearly, daily };
    });

    return {
      stream,
      rate,
      spot,
    };
  },
};
</script>
<style scoped lang: scss>
.funding-chart{
  margin-bottom:3rem
}
.middle-text {
  display: inline-block;
  justify-content: center;
  width: 50rem;
  justify-self: center;
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
  justify-self: center;
}
.intro {
  width: 100%;
  display: grid;
  justify-content: center;
}
.collect {
  display: grid;
  justify-content: center;
  width: 100%;
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