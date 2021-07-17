<template>
  <section class="intro">
    <h4>The "Basis" Trade</h4>
    <p class="intro-text">
      Basis Trading or "Cash and Carry" Abritrage is a fairly simple concept to
      grasp. Say I make a contract with the home depot to deliver them 1
      container of lumber in one month's time for $5000. If the current price in
      the market is $4000, I could buy the lumber now and deliver it in one
      months time. Effectively pocketing the $1000.
    </p>
    <p class="middle-text">
      In terms of cryptocurrencies, the concept is not different. For a few
      select assets, any given time (literally), there is a quarterly contract
      and spot market for the asset. For example, here at BasisTrade, we really
      like etherium. So at any given point during a quarter, we can sell the
      quarterly contract for ETH at a premium to its spot price. Right Now, I
      would sell 1 ETHUSDT_210924 at ${{ stream.qrt }} and buy 1 ETH in the spot
      market at ${{ stream.perp }}. This means I have locked in ${{
        stream.basis
      }}
      in profit that will be realized on Sept 24. 2021. This provides a return
      of {{ stream.apy }}%. (APY)
    </p>
    <p></p>
  </section>
  <basis-chart />
</template>
<script>
import { useStore } from "vuex";
import { computed, onMounted, ref } from "vue";

export default {
  components: {

  },
  setup() {
      const store = useStore()
      const stream = computed(() => {
      const data = store.state.table.messages;
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
.hello {
  color: tan;
}
</style>