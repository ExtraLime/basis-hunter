<template>
<div class="basis-trade">
  <section class="intro">
    <h4>The "Basis" Trade</h4>
    <p class="intro-text">
      Basis Trading or "Cash and Carry" Abritrage is a fairly simple concept to
      grasp. Say I make a contract with the home depot to deliver them 1
      container of lumber in one month's time for $5000. If the current price in
      the market is $4000, I could buy the lumber now and deliver it in one
      months time. Effectively pocketing the $1000.
    </p>
    <div class="middle-text">
      In terms of cryptocurrencies, the concept is not different. For a few
      select assets, any given time (literally), there is a quarterly contract
      and spot market for the asset. For example, here at BasisTrade, we really
      like etherium. So at any given point during a quarter, one can sell the
      quarterly contract for ETH at a premium (usually) to the spot price. Right Now, one
      would sell 1 ETHUSD_210924 at: <span class="short">${{ stream.qrt }} </span> and buy 1 ETH in the spot
      market at: <span class="long"> ${{ stream.perp }}</span>This means a profit of: <span :class="stream.basis<0? 'short':'long'">${{
        stream.basis
      }}</span>
      is locked in and will be realized on Sept 24. 2021. Providing an annual return of roughly: <span :class="stream.basis<0? 'short':'long'"> {{ stream.apy }}%</span>
   
</div> 
  </section>
  <basis-chart />
  </div>
</template>
<script>
import { useStore } from "vuex";
import { computed } from "vue";
import BasisChart from './BasisChart.vue'

export default {
  components:{
    BasisChart
  },
  setup() {
      const store = useStore()
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
.middle-text{
  display:grid
}
.long{
  color:green
}
.short{
  color:red
}
.intro{

}
.basis-trade{
  display:flex;
  width:75rem;
  justify-content:center
}
section{
  width:35rem
}
</style>