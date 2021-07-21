export const layout = {
  namespaced: true,

  state() {
    return {
        pages: [
                    {
                        name: 'About',
                        path:'/about',
                        description:'Learn about basis trading and discover different ways you can earn passive income with crypto'
                    },
                    {
                        name: 'Live',
                        path:'/live',
                        description:'watch live market data, with basis rates and funding rates.'
                    },
                    {
                        name: 'Analyze',
                        path:'/analyze',
                        description:'Analyze recent data by coin'
                    },
                    {
                        name: 'Finance',
                        path:'/finance',
                        description:'find the best staking rates available for your coin'
                    },

                ],
        spot:{}

    };
  },
  mutations:{
    spotSocket(state, message) {
        state.spot[message.s] = [message.c, message.P];

      },
  },
  actions:{
    async spotSubscribe(ctx) {
        const pairs = [
          "adausdt",
          "bchusdt",
          "bnbusdt",
          "btcusdt",
          "dotusdt",
          "ethusdt",
          "linkusdt",
          "ltcusdt",
          "xrpusdt",'DOGEUSDT','1INCHUSDT','AAVEUSDT','ATOMUSDT','GRTUSDT','ALGOUSDT','MATICUSDT','TRXUSDT'
        ];
        // build query for websocket request
        const query = pairs
          .map((coin) => `${coin.toLowerCase()}@ticker/`)
          .join("");
          console.log(query)
        try {
          
          const socket = new WebSocket(
            // `wss://stream.binance.com/stream?streams=${query}`
            'wss://stream.binance.com/stream?streams='+'adausdt@ticker/bchusdt@ticker/bnbusdt@ticker/btcusdt@ticker/dotusdt@ticker/ethusdt@ticker/linkusdt@ticker/ltcusdt@ticker/xrpusdt@ticker/dogeusdt@ticker/1inchusdt@ticker/aaveusdt@ticker/atomusdt@ticker/grtusdt@ticker/algousdt@ticker/maticusdt@ticker/trxusdt@ticker'
          );
          socket.onmessage = (e) => {
            const res = JSON.parse(e.data);
            const { c, s, P } = res.data;
            ctx.commit("spotSocket", {  c, s, P });
          };
        } catch (e) {
          console.error(e.message);
        }
      },
  }

};
