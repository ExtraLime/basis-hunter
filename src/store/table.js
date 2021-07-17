export const table = {
  namespaced: true,

  state() {
    return {
      symbols: [],
      query: "",
      messages: {},
      fundingData: {},
      basisLive:{},
      fundingLive:{}
    };
  },
  mutations: {
    updateCoins(state, { query, symbols }) {
      state.symbols = symbols;
      state.query = query;
    },
    socketData(state, message) {
      state.messages[message.s] = message.c;
      state.messages["timestamp"] = message.E;
    },
    updateFundingRates(state, rates) {
      state.fundingData = rates;
    },
  },
  actions: {
    async getCoinList(ctx) {
      // get list of coins with futures+spot
      const res = await window.fetch(
        "https://dapi.binance.com/dapi/v1/exchangeInfo"
      );
      const data = await res.json();
      const symbols = data.symbols
        .filter((coin) => {
          if (coin.contractType === "CURRENT_QUARTER") {
            return [`${coin.pair}_PERP`];
          }
        })
        .map((coin) => [coin.symbol, `${coin.pair}_PERP`]);
      // build query for websocket request
      const query = symbols.flat().map((coin) => `${coin}@ticker/`);

      ctx.commit("updateCoins", {
        symbols: symbols.flat(),
        query: query.join(""),
      });
    },
    async subscribe(ctx) {
      const res = await window.fetch(
        "https://dapi.binance.com/dapi/v1/exchangeInfo"
      );
      const data = await res.json();
      const symbols = data.symbols
        .filter((coin) => {
          if (coin.contractType === "CURRENT_QUARTER") {
            return [`${coin.pair}_PERP`];
          }
        })
        .map((coin) => [coin.symbol, `${coin.pair}_PERP`]);
      // build query for websocket request
      const query = symbols
        .flat()
        .map((coin) => `${coin.toLowerCase()}@ticker/`)
        .join("");
      try {
        const socket = new WebSocket(
          `wss://dstream.binance.com/stream?streams=${query}`
        );
        socket.onmessage = (e) => {
          const res = JSON.parse(e.data);
          const { E, c, s } = res.data;
          ctx.commit("socketData", { E, c, s });
        };
      } catch (e) {
        console.error(e.message);
      }
    },
    async getFundingData(ctx) {
      const res = await window.fetch(
        "http://dapi.binance.com/dapi/v1/premiumIndex"
      );
      const data = await res.json();
      const bases = [
        "ADA",
        "BCH",
        "BNB",
        "BTC",
        "DOT",
        "ETH",
        "LINK",
        "LTC",
        "XRP",
      ];
      const rates = {};
      const fundingData = bases.map((coin) =>
        data.filter((symbol) => {
          if (symbol.symbol === `${coin}USD_PERP`) {
            const rate = symbol["lastFundingRate"];
            rates[coin] = parseFloat(rate);
            return rate;
          }
        })
      );
      ctx.commit("updateFundingRates", rates);
    },
  },
};
