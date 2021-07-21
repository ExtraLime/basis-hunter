<template>
    <div class='ticker-move' >
<div v-for="coin in spotData" :key='coin.coinName'>
    <price-card :coinData='coin'></price-card>
</div>
    </div>
</template>
<script>
import {useStore } from 'vuex'
import { computed } from 'vue'
import PriceCard from './PriceCard.vue'
export default {
    components:{
PriceCard
    },
    setup() {
        const store = useStore()
        const spotData = computed(() => {
            const spot = store.state.layout.spot
            const cList = ['ADAUSDT','BCHUSDT','BNBUSDT','BTCUSDT','DOTUSDT','ETHUSDT','LINKUSDT','LTCUSDT','XRPUSDT', 'DOGEUSDT','1INCHUSDT','AAVEUSDT','ATOMUSDT','GRTUSDT','ALGOUSDT','MATICUSDT','TRXUSDT']
            const data = cList.map(coin => {
                return {
                    coinName:coin,
                    lastPrice: parseFloat(spot[coin][0]).toFixed(3),
                    url: `https://cryptofonts.com/img/icons/${coin.replace('USDT','').toLowerCase()}.svg`,
                    pctChg:parseFloat(spot[coin][1]).toFixed(2)
                }
            })
            return data
        })
        console.log(spotData)
        return {
            spotData
        }
    },
}
</script>
<style scoped>


</style>