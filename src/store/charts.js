export const charts = {
  namespaced: true,

  state() {
    return {
      analyzeCoin: "BTC",
      chartsData:{},
      intervals: ["1m", "5m", "15m", "30m", "1h", "4h", "8h"],
      chartInterval:'1h'
    };
  },
  mutations: {
    setBasisChartData(state, { labels, data }) {
      state.basisChartData = {
        labels:labels,
        data:data,
      };
    },
    setAnalyzeData(state, initData) {
       console.log(initData)
       state.perpData = initData.perpPrice
       state.qrtData = initData.qrtPrice
       state.spotData = initData.spotPrice
       state.usdtPerpData = initData.usdtPerpPrice
       state.dateRange = initData.dateRange
      },
    setChartsData(state, chartsData){
        state.chartsData = chartsData
    }
      
  },
  actions: {
    async getAnalyzeData(ctx,) {
        const coin = ctx.state.analyzeCoin ? ctx.state.analyzeCoin : 'ETH'
        const interval = ctx.state.intervals[0] ? ctx.state.intervals[0] : '1m'
        //make initial api calls to get raw data
        // const spotSymbol = coin+"USDT"
        const perpApi = await window.fetch(`https://dapi.binance.com/dapi/v1/continuousKlines?limit=1000&pair=${coin.toLowerCase()}usd&interval=${interval}&contractType=PERPETUAL`)
        const qrtApi = await window.fetch(`https://www.binance.com/dapi/v1/continuousKlines?limit=1000&pair=${coin.toLowerCase()}usd&interval=${interval}&contractType=CURRENT_QUARTER`)
        const usdtPerpApi = await window.fetch(`https://fapi.binance.com/fapi/v1/continuousKlines?limit=1000&pair=${coin.toLowerCase()}usdt&interval=${interval}&contractType=PERPETUAL`)
        const spotApi = await window.fetch(`https://www.binance.com/api/v1/klines?limit=1000&symbol=${coin}USDT&interval=${interval}`)

        
        const perpData = await perpApi.json()
        const qrtData = await qrtApi.json()
        const spotData = await spotApi.json()
        const usdtPerpData = await usdtPerpApi.json()

        const perpPrice = perpData.map(tick => {
            return parseFloat(tick[4])
        })
        const qrtPrice = await qrtData.map(tick => {
            return parseFloat(tick[4])
        })
        const spotPrice = await spotData.map(tick => {
            return parseFloat(tick[4])
        })
        const usdtPerpPrice = await usdtPerpData.map(tick => {
            return parseFloat(tick[4])
        })
        const dateRange = perpData.map(tick => {
            return tick[0]
        })
        console.log(perpPrice,qrtPrice,spotPrice,usdtPerpPrice,dateRange)
        const basis = Math.subtract(Math.matrix(perpPrice),Math.matrix(qrtPrice))
        console.log(basis)
        

        

        // const usdtFundingApi = `https://fapi.binance.com/fapi/v1/fundingRate?startTime={st}&endTime={en}&limit=1000&symbol={spot_symbol}`
        // const coinFundingApi= `https://dapi.binance.com/dapi/v1/fundingRate?startTime={st}&endTime={en}&limit=1000&symbol={f_sym}`


        console.log(perpData)

        ctx.commit('setAnalyzeData',{
                                        perpPrice,
                                        qrtPrice,
                                        spotPrice,
                                        usdtPerpPrice,
                                    dateRange})},

    async getChartData(ctx,chartName) {
        console.log(chartName)
        console.log(ctx.state.perpData)
    //   const coin = ctx.analyzeCoin ? ctx.analyzeCoin : "ETH";
    //   const interval = ctx.state.intervals[0] ? ctx.state.intervals[0] : "1m";
    //   const perpRes = await window.fetch(
    //     `https://dapi.binance.com/dapi/v1/continuousKlines?limit=1000&pair=${coin.toLowerCase()}usd&interval=${interval}&contractType=PERPETUAL`
    //   );
    //   const perpData = await perpRes.json();
    //   const data = perpData.map(datum => {
    //     return datum[4]
    //   });
    // //   const qrtRes = await window.fetch(
    // //     `https://dapi.binance.com/dapi/v1/continuousKlines?limit=1000&pair=${coin.toLowerCase()}usd&interval=${interval}&contractType=PERPETUAL`
    // //   );
    //   console.log(data)
    //   const labels = perpData.map(datum => {
    //     const date = new Date(datum[0]).toLocaleDateString()
    //     const time = new Date(datum[0]).toLocaleTimeString()        
    //     return `${date} ${time}`

    // });
    console.log(ctx.state.perpData)
        const returnName = `set${chartName.name}Data`
        console.log(returnName)
      ctx.commit(returnName, {labels:labels, data });
    },

    }
  
    
  }
