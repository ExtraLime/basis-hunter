export const live = {
  namespaced: true,

  state() {
    return {
      symbols: [],
      query: "",
      messages: {},
      fundingData: {},
      uFunding: {},
      basisLive: {},
      fundingLive: {},
      spot: {},
      uData: {},
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
    uData(state, message) {
      state.uData[message.s] = message.c;
    },
    updateFundingRates(state, rates) {
      state.fundingData = rates;
    },
    updateUFundingRates(state, rates) {
      state.uFunding = rates;
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
    async subscribeU(ctx) {
      try {
        const socket = new WebSocket(
          `wss://fstream.binance.com/stream?streams=ethusdt@ticker`
        );
        socket.onmessage = (e) => {
          const res = JSON.parse(e.data);

          const { E, c, s } = res.data;

          ctx.commit("uData", { E, c, s });
        };
      } catch (e) {
        console.error(e.message);
      }
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
      const result = await window.fetch(process.env.VUE_APP_API + "funding");

      const rates = await result.json();

      ctx.commit("updateFundingRates", rates);
    },
    async getUFunding(ctx) {
      const result = await window.fetch(process.env.VUE_APP_API + "ufunding");
      //
      const rates = await result.json();

      ctx.commit("updateUFundingRates", rates);
    },
  },
};
