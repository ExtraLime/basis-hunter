export const charts = {
  namespaced: true,

  state() {
    return {
      analyzeCoin: "ETH",
      histogramData: [],
      chartsData: {},
      basisChartData: {},
      initChartData: { labels: [], datasets: [] },
      intervals: [
        { value: "1m", label: "1m" },
        { value: "5m", label: "5m" },
        { value: "15m", label: "15m" },
        { value: "30m", label: "30m" },
        { value: "1h", label: "1h" },
        { value: "4h", label: "4h" },
        { value: "8h", label: "8h" },
      ],
      analyzeInterval: "1h",
      coins: [
        { label: "ADA", value: "ADA" },
        { label: "BCH", value: "BCH" },
        { label: "BNB", value: "BNB" },
        { label: "BTC", value: "BTC" },
        { label: "DOT", value: "DOT" },
        { label: "ETH", value: "ETH" },
        { label: "LINK", value: "LINK" },
        { label: "LTC", value: "LTC" },
        { label: "XRP", value: "XRP" },
      ],
    };
  },
  getters: {
    chartsData(state) {
      return state.chartsData;
    },
  },
  mutations: {
    setAnalyzeCoin(state, data) {
      state.analyzeCoin = data.selectedCoin.value;
      state.analyzeInterval = data.selectedInterval.value;
    },
    setChartsData(state, chartsData) {
      console.log("mutation:", chartsData);
      state.chartsData = chartsData;
    },
    setBasisChartData(state, chartData) {
      state.basisChartData = chartData;
    },
    setInitChartData(state, { labels, basis, coin }) {
      state.initChartData.labels = labels;
      const colors = {
        ADA: "#1C1CF0",
        BCH: "#3B7A57",
        BNB: "#D2691E",
        BTC: "#FFEF00",
        DOT: "#E30022",
        ETH: "#00CC99",
        LINK: "#F7E7CE",
        LTC: "#9FA91F",
        XRP: "#0047AB",
      };
      state.initChartData.datasets.push({
        label: coin,
        name: coin,
        data: basis,
        borderColor: colors[coin],
      });
    },
    resetInitData(state) {
      console.log("was reset");
      state.initChartData = { labels: [], datasets: [] };
    },
    setHistogramData(state, { interval, counts, bins }) {
      state.histogramData[interval]={ interval:interval, data: {counts, bins} }
    },
  },
  actions: {
    async changeCoin(ctx, { selectedCoin, selectedInterval }) {
      console.log(selectedCoin);
      ctx.commit("setAnalyzeCoin", { selectedCoin, selectedInterval });
    },
    async getChartsData(ctx) {
      const coin = ctx.state.analyzeCoin;
      const interval = ctx.state.analyzeInterval;
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
      for (let i = 0; i < usdtFundingData.length; i++) {
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

      // console.log(coinFundObj.asBasis, usdtFundObj.asBasis);

      const labels = perpData.map((datum) => {
        const date = new Date(datum[0]).toLocaleDateString();
        const time = new Date(datum[0]).toLocaleTimeString();
        return `${date} ${time}`;
      });
      const apexCharts = {
        // basis chart
        basis: {
          chartOptions: {
            colors: ["dodgerblue", "lightgrey", "white"],
            dataLabels: {
              color: "white",
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
                backgroundColor: "pink",
              },
              theme: "dark",
              chart: {
                background: "black",
              },
              shared: true,
              y: {
                formatter: function (val) {
                  return "$" + val.toFixed(2);
                },
              },
            },
            yaxis: {
              title: {
                text: "Price",
              },
              labels: {
                formatter: function (val) {
                  return "$" + val.toFixed(2);
                },
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
            colors: ["dodgerblue", "lightgrey", "white"],
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
                backgroundColor: "pink",
              },
              theme: "dark",
              chart: {
                background: "black",
              },
              shared: true,
              y: {
                formatter: function (val) {
                  return "$" + val.toFixed(2);
                },
              },
            },
            yaxis: {
              title: {
                text: "USD Amount",
              },
              labels: {
                formatter: function (val) {
                  return "$" + val.toFixed(2);
                },
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
            colors: ["dodgerblue", "lightgrey", "white"],

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
                backgroundColor: "pink",
              },
              theme: "dark",
              chart: {
                background: "black",
              },
              shared: true,
              y: {
                formatter: function (val) {
                  return "%" + val.toFixed(3);
                },
              },
            },
            yaxis: {
              tickAmount: 6,
              axisTicks: {
                color: "white",
              },
              labels: {
                style: {
                  color: "white",
                },
                formatter: function (val) {
                  return "%" + val.toFixed(5);
                },
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
            colors: ["dodgerblue", "lightgrey", "white"],

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
                backgroundColor: "pink",
              },
              theme: "dark",
              chart: {
                background: "black",
              },
              shared: true,
              y: {
                formatter: function (val) {
                  return "%" + (val * 100).toFixed(3);
                },
              },
            },
            yaxis: {
              tickAmount: 6,
              title: {
                text: "Rate",
              },
              labels: {
                formatter: function (val) {
                  return "%" + (val * 100).toFixed(3);
                },
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

      ctx.commit("setChartsData", {
        apexCharts,
      });
    },
    async setBasisChartData(ctx, coin) {
      const qrtRes = await window.fetch(
        `https://www.okex.com/api/futures/v3/instruments/${coin}-USD-210924/history/candles?granularity=86400`
      );
      const perpRes = await window.fetch(
        `https://www.okex.com/api/swap/v3/instruments/${coin}-USD-SWAP/history/candles?granularity=86400`
      );
      const perpRev = await perpRes.json();
      const qrtRev = await qrtRes.json();

      const perp = perpRev.reverse();
      const qrt = qrtRev.reverse();
  
      const basisChartData = {
        qrt: qrt.map((tick) => {
          return parseFloat(tick[4]);
        }),
        perp: perp.map((tick) => {
          return parseFloat(tick[4]);
        }),
        basis: qrt
          .map((tick, idx) => {
            return parseFloat(tick[4]) - parseFloat(perp[idx][4]);
          })
          .map((tick, idx) => {
            return tick / perp[idx][4];
          }),
        timestamp: qrt.map((datum) => {
          return new Date(datum[0]).toLocaleDateString();
        }),
      };
      ctx.commit("setBasisChartData", basisChartData);
    },
    async initChartData(ctx) {
      ctx.commit("resetInitData");
      const list = ctx.state.coins;

      await list.forEach(async (coin) => {
        let i = 0;
        console.log(i);
        const data = { labels: [], datasets: [] };
        const perpRes = await window.fetch(
          `https://dapi.binance.com/dapi/v1/continuousKlines?limit=1000&pair=${coin.label.toLowerCase()}usd&interval=8h&contractType=PERPETUAL`
        );
        const qrtRes = await window.fetch(
          `https://www.binance.com/dapi/v1/continuousKlines?limit=1000&pair=${coin.label.toLowerCase()}usd&interval=8h&contractType=CURRENT_QUARTER`
        );

        const perp = await perpRes.json();
        const qrt = await qrtRes.json();
        const basis = qrt
          .map((tick, idx) => {
            return parseFloat(tick[4]) - parseFloat(perp[idx][4]);
          })
          .map((tick, idx) => {
            return parseFloat(tick / perp[idx][4]).toFixed(4);
          });
        const labels = qrt.map((datum) => {
          return new Date(datum[0]).toLocaleDateString();
        });
        data.labels.push(labels);
        data.datasets.push({ data: basis, label: coin.label });
       

        ctx.commit("setInitChartData", { labels, basis, coin: coin.label });
        i++;
      });
    },
    async getKLineHistogramData(ctx, coin) {
      if (!coin) {
        coin = "ETH";
      }
      function histogram(data, size) {
        let min = Infinity;
        let max = -Infinity;
    
        for (const item of data) {
            if (item < min) min = item;
            else if (item > max) max = item;
        }
    
        const bins = Math.ceil((max - min + 1) / size);
        const ticks = []
        for(let i=min;i<max;i+=size){
          ticks.push(i.toFixed(2))
        }

        const histogram = Array(bins).fill(0);
    
        for (const item of data) {
            histogram[Math.floor((item - min) / size)]++;
        }
    
        return [histogram, ticks];
    }
      
      const intervals = ctx.state.intervals.map((interval) => interval.label);
      await intervals.forEach(async (interval) => {
        const res = await window.fetch(
          `https://dapi.binance.com/dapi/v1/continuousKlines?limit=1000&pair=${coin.toLowerCase()}usd&interval=${interval}&contractType=PERPETUAL`
        );
        const data = await res.json();
        const kLines = data.map((tick) => {
          const moves = parseFloat(tick[4]) - parseFloat(tick[1]);
          return moves;
        });
        const binSize = Math.ceil(((Math.max(...kLines)-Math.min(...kLines)))/15)
        
     
      const histo = histogram(kLines,binSize)
      
        const timestamps = data.map((tick) => {
          const timestamp = new Date(tick[0]);
          return timestamp;
        });
        ctx.commit("setHistogramData", { interval, counts:histo[0],bins:histo[1] });
      });
    },
  },
};
