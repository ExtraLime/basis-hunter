export const layout = {
  namespaced: true,

  state() {
    return {
      pages: [
        {
          name: "Learn",
          path: "/learn",
          description:
            "Learn about basis trading and discover different ways you can earn passive income with crypto",
        },
        {
          name: "Live",
          path: "/live",
          description:
            "Watch live market data, with basis rates and funding rates.",
        },
        {
          name: "Analyze",
          path: "/analyze",
          description: "Analyze recent data by coin",
        },
        {
          name: "Finance",
          path: "/finance",
          description: "Find the best staking rates available for your coins",
        },
      ],
      spot: {},
      fundingHistory: {},
    };
  },
  mutations: {
    spotSocket(state, message) {
      state.spot[message.s] = [message.c, message.P];
    },
    setHistoricalFunding(state, data) {
      state.fundingHistory = data;
    },
  },
  actions: {
    async spotSubscribe(ctx) {
      const pairs = [
        "ADAUSDT",
        "BCHUSDT",
        "BNBUSDT",
        "BTCUSDT",
        "DOTUSDT",
        "ETHUSDT",
        "LINKUSDT",
        "LTCUSDT",
        "XRPUSDT",
        "DOGEUSDT",
        "1INCHUSDT",
        "AAVEUSDT",
        "ATOMUSDT",
        "GRTUSDT",
        "ALGOUSDT",
        "MATICUSDT",
        "TRXUSDT",
        "SOLUSDT",
        "STXUSDT",
        "KSMUSDT",
        "SUSHIUSDT",
        "UNIUSDT",
        "ETCUSDT",
        "DASHUSDT",
        "XMRUSDT",
        "XTZUSDT",
        "EOSUSDT",
        "MKRUSDT",
        "CAKEUSDT",
      ];
      // build query for websocket request - optional very laggy
      const query = pairs
        .map((coin) => `${coin.toLowerCase()}@ticker/`)
        .join("");

      try {
        const socket = new WebSocket(
          // `wss://stream.binance.com/stream?streams=${query}`
          "wss://stream.binance.com/stream?streams=" +
            "adausdt@ticker/bchusdt@ticker/bnbusdt@ticker/btcusdt@ticker/dotusdt@ticker/ethusdt@ticker/linkusdt@ticker/ltcusdt@ticker/xrpusdt@ticker"
        );
        socket.onmessage = (e) => {
          const res = JSON.parse(e.data);
          const { c, s, P } = res.data;
          ctx.commit("spotSocket", { c, s, P });
        };
      } catch (e) {
        console.error(e.message);
      }
    },
    async getHistoricalFunding(ctx) {
      const res = await window.fetch(process.env.VUE_APP_API+"fundingHistory");
      const data = await res.json();
      ctx.commit("setHistoricalFunding", data);
    },
  },
};
