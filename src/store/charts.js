export const charts = {
  namespaced: true,

  state() {
    return {
      analyzeCoin: "ETH",
      chartsData: {},
      intervals: ["1m", "5m", "15m", "30m", "1h", "4h", "8h"],
      chartInterval: "1h",
    };
  },
  mutations: {

    setChartsData(state, chartsData) {
      console.log(chartsData);
      state.chartsData = chartsData;
    },
  },
  actions: {
    async getChartsData(ctx) {
      const coin = ctx.state.analyzeCoin ? ctx.state.analyzeCoin : "ETH";
      const interval = ctx.state.intervals[6] ? ctx.state.intervals[6] : "1m";
      //make initial api calls to get raw data
      // const spotSymbol = coin+"USDT"
      const perpApi = await window.fetch(
        `https://dapi.binance.com/dapi/v1/continuousKlines?limit=500&pair=${coin.toLowerCase()}usd&interval=${interval}&contractType=PERPETUAL`
      );
      const qrtApi = await window.fetch(
        `https://www.binance.com/dapi/v1/continuousKlines?limit=500&pair=${coin.toLowerCase()}usd&interval=${interval}&contractType=CURRENT_QUARTER`
      );
      const usdtPerpApi = await window.fetch(
        `https://fapi.binance.com/fapi/v1/continuousKlines?limit=500&pair=${coin.toLowerCase()}usdt&interval=${interval}&contractType=PERPETUAL`
      );
      const spotApi = await window.fetch(
        `https://www.binance.com/api/v1/klines?limit=500&symbol=${coin}USDT&interval=${interval}`
      );

      const perpData = await perpApi.json();
      const qrtData = await qrtApi.json();
      const spotData = await spotApi.json();
      const usdtPerpData = await usdtPerpApi.json();

      const perpPrice = perpData.map((tick) => {
        return parseFloat(tick[4]);
      });
      const qrtPrice = await qrtData.map((tick) => {
        return parseFloat(tick[4]);
      });
      const spotPrice = await spotData.map((tick) => {
        return parseFloat(tick[4]);
      });
      const usdtPerpPrice = await usdtPerpData.map((tick) => {
        return parseFloat(tick[4]);
      });
      const dateRange = perpData.map((tick) => {
        return tick[0];
      });
      //clean simple JS
      const basis = [];
      const basisRate = [];
      for (let i = 0; i < perpPrice.length; i++) {
        basis.push(qrtPrice[i] - perpPrice[i]);
        basisRate.push(basis[i] / perpPrice[i]);
      }
      // fetch funding data
      //use start and end times from previous array
      const startTime = dateRange[0];
      const endTime = dateRange[dateRange.length - 1];

      const usdtFundingApi = await window.fetch(
        `https://fapi.binance.com/fapi/v1/fundingRate?startTime=${startTime}&endTime=${endTime}&limit=1000&symbol=${coin}USDT`
      );
      const coinFundingApi = await window.fetch(
        `https://dapi.binance.com/dapi/v1/fundingRate?startTime=${startTime}&endTime=${endTime}&limit=1000&symbol=${coin}USD_PERP`
      );
      const usdtFundingData = await usdtFundingApi.json();
      const coinFundingData = await coinFundingApi.json();
      //convert to objects
      const coinFundObj = {
        funding: [],
        filled: [],
        amtCollected: [],
        cumsum: [],
      };
      const usdtFundObj = {
        funding: [],
        filled: [],
        amtCollected: [],
        cumsum: [],
      };
      for (let i = 0; i < coinFundingData.length; i++) {
        let date = coinFundingData[i].fundingTime;
        let adjDate = parseInt(date / 1000);
        coinFundObj[adjDate] = parseFloat(coinFundingData[i].fundingRate);
        usdtFundObj[adjDate] = parseFloat(usdtFundingData[i].fundingRate);
      }

      // generate arrays with funding data to match price arrays for specified time interval
      // iterate over the timestamps from dateRange dividing by 1000 to scrap milliseconds
      for (let i = 0; i < dateRange.length; i++) {
        let date = parseInt(dateRange[i] / 1000);
        let cRate = 0;
        let uRate = 0;
        if (coinFundObj[date]) {
          cRate = parseFloat(coinFundObj[date]);
          uRate = parseFloat(usdtFundObj[date]);
          coinFundObj.funding.push(cRate);
          usdtFundObj.funding.push(uRate);
          coinFundObj.filled.push(cRate);
          usdtFundObj.filled.push(uRate);
        } else {
          coinFundObj.funding.push(0);
          usdtFundObj.funding.push(0);
          coinFundObj.filled.push(cRate);
          usdtFundObj.filled.push(uRate);
        }
        // return rate*price for each timestamp
        let cCollected =
          parseFloat(perpPrice[i]) * parseFloat(coinFundObj.funding[i]);
        let uCollected =
          parseFloat(usdtPerpPrice[i]) * parseFloat(usdtFundObj.funding[i]);
        coinFundObj.amtCollected.push(cCollected);
        usdtFundObj.amtCollected.push(uCollected);
      }
      //convert eth collection to usd value
      coinFundObj["usdValue"] = coinFundObj.funding.map((amt, idx) => {
        return perpPrice[idx] * amt;
      });

      //  cumulative sum of funding collected
      coinFundObj["cumsum"] = coinFundObj.usdValue.reduce(
        (a, x, i) => [...a, x + (a[i - 1] || 0)],
        []
      );
      usdtFundObj["cumsum"] = usdtFundObj.amtCollected.reduce(
        (a, x, i) => [...a, x + (a[i - 1] || 0)],
        []
      );

      // funding collected/price of underlying at t=0
      coinFundObj["asBasis"] = coinFundObj.cumsum.map((amt) => {
        return amt / perpPrice[0];
      });
      usdtFundObj["asBasis"] = usdtFundObj.cumsum.map((amt) => {
        return amt / usdtPerpPrice[0];
      });

      console.log(coinFundObj.asBasis, usdtFundObj.asBasis);

      const labels = perpData.map((datum) => {
        const date = new Date(datum[0]).toLocaleDateString();
        const time = new Date(datum[0]).toLocaleTimeString();
        return `${date} ${time}`;
      });
      const apexCharts = {
        // basis chart
        basis: {
          chartOptions: {
            colors: ["#E12D39","#17B897",'white'],
            dataLabels:{
              color:
              'white'
            },
            stroke: {
              show: true,
              curve: "smooth",
              lineCap: "butt",

              width: 2,
              dashArray: 0,
            },
            xaxis: {
              categories: labels,
              labels: {
                show: false,
              },
              axisTicks: {
                show: false,
            },
              axisBorder: {
                show: false,
              },
            },
            tooltip: {
              style: {
                fontSize: "10px",
                backgroundColor:'pink'
              },
              theme:'dark',
              chart:{
                background:'black'
              },
              shared: true,
              y: {
                formatter: function (val) {
                  return val.toFixed(5);
                },
              },
            },
            yaxis: {
              title: {
                text: "Price",
              },
            },
            chart: {
              id: "basis",
              background: "black",
              foreColor: "white",

            },

            markers: {
              size: 0,
            },
            title: {
              text: "Price Movement",
              align: "center",
            },
          },
          series: [
            {
              name: "Perptual",
              data: perpPrice,
            },
            {
              name: "Quarterly",
              data: qrtPrice,
            },
          ],
        },
        // funding collected
        funding: {
          chartOptions: {
            colors: ["#E12D39","#17B897",'white'],            
            stroke: {
              show: true,
              curve: "smooth",
              lineCap: "butt",

              width: 2,
              dashArray: 0,
            },
            xaxis: {
              categories: labels,
              labels: {
                show: false,
              },
              axisTicks: {
                show: false,
            },
              axisBorder: {
                show: false,
              },
            },
            tooltip: {
              style: {
                fontSize: "10px",
                backgroundColor:'pink'
              },
              theme:'dark',
              chart:{
                background:'black'
              },
              shared: true,
              y: {
                formatter: function (val) {
                  return val.toFixed(5);
                },
              },
            },
            yaxis: {
              title: {
                text: "USD Amount",
              },
              labels:{
                formatter: function(val){
                  return val.toFixed(5)
                }
              }
            },
            chart: {
              id: "basis",
              background: "black",
              foreColor: "white",
            },

            markers: {
              size: 0,
            },
            title: {
              text: "Funding Collected",
              align: "center",
            },
          },
          series: [
            {
              name: "Eth Collected (USD)",
              data: coinFundObj.cumsum,
            },
            {
              name: "USDT Collected",
              data: usdtFundObj.cumsum,
            },
          ],
        },
        //bvf chart
        bvf: {
          chartOptions: {
            colors: ["#E12D39","#17B897",'white'],
            
            stroke: {
              show: true,
              curve: "smooth",
              lineCap: "butt",

              width: 2,
              dashArray: 0,
            },
            xaxis: {
              categories: labels,
              labels: {
                show: false,
              },
              axisTicks: {
                show: false,
            },
              axisBorder: {
                show: false,
              },
            },
            tooltip: {
              style: {
                fontSize: "10px",
                backgroundColor:'pink'
              },
              theme:'dark',
              chart:{
                background:'black'
              },
              shared: true,
              y: {
                formatter: function (val) {
                  return val.toFixed(5);
                },
              },
            },
            yaxis: {
              tickAmount:6,
              axisTicks:{
                color:'white'
              },
              labels:{
                style:{
                  color:'white'
                },
                formatter: function(val){
                  return val.toFixed(5)
                }
              },
              title: {
                text: "Rate",
              },
            },
            chart: {
              id: "basis",
              background: "black",
              foreColor: "white",
            },

            markers: {
              size: 0,
            },
            title: {
              text: "Funding vs Basis",
              align: "center",
            },
          },
          series: [
            {
              name: "Eth Collected (USD as Basis)",
              data: coinFundObj.asBasis,
            },
            {
              name: "USDT Collected as Basis",
              data: usdtFundObj.asBasis,
            },
            {
              name: "Basis Rate",
              data: basisRate,
            },
          ],
        },
        //funding rate chart
        fRates: {
          chartOptions: {
            colors: ["#E12D39","#17B897",'white'],
            
            stroke: {
              show: true,
              curve: "smooth",
              lineCap: "butt",

              width: 2,
              dashArray: 0,
            },
            xaxis: {
              categories: labels,
              labels: {
                show: false,
              },
              axisTicks: {
                show: false,
            },
              axisBorder: {
                show: false,
              },
            },
            tooltip: {
              style: {
                fontSize: "10px",
                backgroundColor:'pink'
              },
              theme:'dark',
              chart:{
                background:'black'
              },
              shared: true,
              y: {
                formatter: function (val) {
                  return val.toFixed(5);
                },
              },
            },
            yaxis: {
              tickAmount:6,
              title: {
                text: "Rate",
              },
              labels:{
                formatter: function(val){
                  return val.toFixed(5)
                }
              }
            },
            chart: {
              id: "basis",
              background: "black",
              foreColor: "white",
            },

            markers: {
              size: 0,
            },
            title: {
              text: "Funding Rates",
              align: "center",
            },
          },
          series: [
            {
              name: "Coin Funding Rate",
              data: coinFundObj.filled,
            },
            {
              name: "USDT Funding Rate",
              data: usdtFundObj.filled,
            },
          ],
        },
      };

      console.log(perpData);

      ctx.commit("setChartsData", {
        apexCharts,
      });
    },
  },
};
