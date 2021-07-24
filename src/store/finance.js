import JSSoup from "jssoup";
import axios from 'axios'

export const finance = {
  namespaced: true,

  state() {
    return {
      financeCoin: null,
      allResults: [],
      filteredResults: [],
      stable:'off',
      isFlex:'off'
    };
  },
  mutations: {
    setFinanceCoin(state, coin) {
      state.financeCoin = coin;
      console.log(state.financeCoin);
    },
    setAllResults(state, results) {
      state.allResults = results;
    },
    setFilteredResults(state, results) {
      if (results == "") {
        state.filteredResults = state.allResults;
      } else {
        state.filteredResults = results;
      }
    },
    setStable(state,filters){
      state.stable = filters.stable
    },
    setIsFlex(state,filters){
      state.isFlex = filters.isFlex
    },
    setFilters(state,filters){
      state.filters = filters
    }
  },
  actions: {
    setCoinFilter(ctx,filters){
      const stables = ['USDT','USDC','TUSD','HUSD','BUSD','TrueUSD']

      ctx.commit('setFilters',filters)
      ctx.commit('setIsFlex',filters)
      ctx.commit('setStable',filters)

      console.log(ctx.state.isFlex)
      console.log(ctx.state.stable)
      console.log(ctx.state.filters,ctx.state.filters.isFlex,ctx.state.filters.stable)
      const flex = ctx.state.filters.stable.value
      console.log(flex)
      console.log(ctx.state.filters.isFlex)
      console.log(ctx.state.filters.stable)
      const results = ctx.state.filteredResults
 if(ctx.state.filters.isFlex==='off' && ctx.state.filters.stable==='off'){
  console.log('show all')

}else if(ctx.state.filters.isFlex==='on' && ctx.state.filters.stable==='off'){
  console.log("only flex")

}
      // if(filters.isFlex.value === true && filters.stable.value === true){
      //   console.log(results.filter(res => stables.includes(res.asset) && res.lock === 0))
      //   ctx.commit('setFilteredResults',results.filter(res => stables.includes(res.asset) && res.lock === 0))
      // } else if (filters.isFlex._value === true && filters.stable._value === false){
      //   console.log(results.filter(res => res.lock === 0).filter((result) =>
      //   result.asset.includes(ctx.state.financeCoin.toUpperCase())))
      //   ctx.commit('setFilteredResults', results.filter(res => res.lock === 0))

      // } 

    },
    setFinanceCoin(ctx, input) {
      ctx.commit("setFinanceCoin", input);
      if (!ctx.state.financeCoin) {
        ctx.commit("setFilteredResults", ctx.state.allResults);
      }
      if (input !== null) {
        const results = ctx.state.allResults;
        const filteredResults = results.filter((result) =>
          result.asset.includes(`${input.toUpperCase()}`)
        );
        console.log(filteredResults);
        ctx.commit("setFilteredResults", filteredResults);
      }
    },
    async getRatesData(ctx) {
      const lockedStakingData = [];
      

      // let nexoRes = await window.fetch("https://nexo.io/earn-crypto");
      // let nexoDecoder = new TextDecoder();
      // let nexoReader = nexoRes.body.getReader();
      // let stream = await nexoReader.read();
      // let nexoHtml = nexoDecoder.decode(stream.value);

      // let nexoSoup = new JSSoup(nexoHtml);
      // let nexo = nexoSoup.findAll("div", { class: "-mb-32" });
 
      // let nexoObjs = nexo[1].contents[0].contents;

      // nexoObjs.forEach((obj) => {
      //   let coinData = obj.findAll("span", { class: "value" });
      //   let imgUrl = obj.findAll("img");
      //   let asset = obj.contents[0].contents[1].contents[1].text;

      //   let key = imgUrl[0].attrs.src;
      //   let assetName = asset.replace(" Interest Account", "").trim();

      //   let rate = parseFloat(coinData[0].contents[0]._text) / 100;
      //   let url = imgUrl[0].attrs.src;
      //   lockedStakingData.push({
      //     key: key,
      //     asset: assetName,
      //     apy: rate,
      //     lock: 0,
      //     refer:"https://nexo.io/earn-crypto",
      //     src: "nexoio",
      //     icon: "lock_open",
      //     source: "nexo.io",
      //     lockTerm: 0,
      //     type: "deposit",
      //     url: url,
      //   });
      // });
 const options = {
  method: "get", 
  mode: 'no-cors'
 }
      const res = await window.fetch(
       "https://www.binance.com/bapi/earn/v1/friendly/pos/union",{options});
       console.log(res)
      const data = await res.json();
      console.log(data)
      const loops = Math.ceil(data.total / 15);
      // paginate to get data

      for (let i = 0; i < loops; i++) {
        let ix = i + 1;
        const page = await window.fetch(
          `https://www.binance.com/bapi/earn/v1/friendly/pos/union?pageSize=15&pageIndex=${ix}&status=SUBSCRIBABLE`
        );
        const pdata = await page.json();
        const pageData = pdata.data.map((paged) => {
          if (paged["annualInterestRate"] > 0) {
            lockedStakingData.push({
              key: paged["projects"][0]["id"],
              asset: paged["asset"],
              apy: paged["annualInterestRate"],
              lockTerm: paged["projects"][0]["duration"],
              src: "binanceLockedStaking",
              source: "Binance",
              refer:'https://www.binance.com/en/earn',
              lock: 1,
              icon: "lock",
              type: "staking",
              url: `https://cryptofonts.com/img/icons/${paged[
                "asset"
              ].toLowerCase()}.svg`,
            });

            return {
              asset: paged["asset"],
              apy: paged["annualInterestRate"],
              lock_term: paged["projects"][0]["duration"],
              src: "binanceLockedStaking",
              locked: 1,
              type: "staking",
              url: `https://cryptofonts.com/img/icons/${paged[
                "asset"
              ].toLowerCase()}.svg`,
            };
          }
        });
      }
//okex data
const okExRes = await window.fetch(
  "https://www.okex.com/v2/asset/balance/project-currency?t=" + new Date()
);
const okex = await okExRes.json();
okex.data.forEach((coin) => {
  let url = coin.currencyIcon;
  let asset = coin.currencyName;
  coin.projectList.forEach((project) => {
    lockedStakingData.push({
      key: "okex" + asset + project.savingType+project.rate,
      asset: asset,
      apy: parseFloat(project.rate) / 100,
      lock: project.period === "Flexible" ? 0 : 1,
      src: "okEx",
      refer:'https://www.binance.com/en/earn',
      icon: project.period === "Flexible" ? "lock_open" : "lock",
      source: "okEx",
      lockTerm: project.type,
      type: project.projectName,
      url: url,
    });
  });
});
      //binance flex savings
      const bFlexres = await window.fetch(
        "https://www.binance.com/bapi/earn/v1/friendly/lending/daily/product/list?"
      );
      const json = await bFlexres.json();
      const bloops = Math.ceil(json.total / 15);
      for (let i = 0; i < bloops; i++) {
        let ix = i + 1;
        const page = await window.fetch(
          `https://www.binance.com/bapi/earn/v1/friendly/lending/daily/product/list?pageSize=15&pageIndex=${ix}&status=ALL`
        );
        const pdata = await page.json();
        const pageData = pdata.data.map((paged) => {
          lockedStakingData.push({
            key: paged["id"],
            asset: paged["name"],
            apy: paged["avgAnnualInterestRate"],
            lockTerm: 0,
            src: "binanceFlexSavings",
            source: "Binance",
            refer:'https://www.binance.com/en/earn',
            lock: 0,
            icon: "lock_open",
            type: "deposit",
            url: `https://cryptofonts.com/img/icons/${paged[
              "name"
            ].toLowerCase()}.svg`,
          });
          return {
            asset: paged["name"],
          };
        });
      }
      // locked savings
      const lockRes = await window.fetch(
        "https://www.binance.com/bapi/earn/v1/friendly/lending/project/customizedFixedProject/list?pageSize=15&pageIndex=1&status=ALL"
      );
      const lock = await lockRes.json();
      lock.data.forEach((result) => {
        result.list.forEach((list) =>
          lockedStakingData.push({
            key: result.projectId,
            asset: result["asset"],
            apy: list["interestRate"],
            lock: 1,
            icon: "lock",
            src: "binanceLockedSavings",
            refer:'https://www.binance.com/en/earn',
            lockTerm: list["duration"],
            type: "deposit",
            source: "Binance",
            url: `https://cryptofonts.com/img/icons/${result[
              "asset"
            ].toLowerCase()}.svg`,
          })
        );
      });
      const hlimit = await window.fetch(
        `https://www.huobi.com/-/x/hbg/v1/saving/mining/index/limitTime/list?isAllow=false&r=rrjnam&x-b3-traceid=82f1704bae9b4a1827f78107811e1e27`
      );
      const hflex = await window.fetch(
        `https://www.huobi.com/-/x/hbg/v1/saving/mining/index/active/list?isAllow=false&r=4zjk1&x-b3-traceid=0e0d725230cdd53887996706d9d09c1a`
      );
      const hfix = await window.fetch(
        `https://www.huobi.com/-/x/hbg/v1/saving/mining/index/fixed/list?isAllow=false&r=lop9g&x-b3-traceid=9804330f1af1a0652560f2e2c5675e8d`
      );
      // const hl = await hlimit.json()
      // const hfl = await  hflex.json()
      // const hfi = await hfix.json()

      const huobi = [
        await hlimit.json(),
        await hflex.json(),
        await hfix.json(),
      ];

      huobi.forEach((url) => {
        url.data.forEach((product) => {
          let rate = "";
          let lock = "";
          let icon = "";
          let lockTerm = "";
          let dType = "";
          if (product.projectStatus === 1) {
            if (product.shelfType === 0) {
              rate = product["day7YearRate"];
              lock = 0;
              icon = "lock_open";
              lockTerm = "0";
              dType = "deposit";
            } else {
              rate = product["viewYearRate"];
              lock = 1;
              icon = "lock";
              lockTerm = "0";
              dType = "deposit";
            }
            lockedStakingData.push({
              key: `h${product.projectId}`,
              asset: product["currency"],
              apy: rate,
              lock: lock,
              src: "huobi",
              icon: icon,
              refer:'https://www.huobi.com/en-us/financial/earnings',
              source: "Huobi",
              lock_term: lockTerm,
              type: dType,
              url: `https://cryptofonts.com/img/icons/${product[
                "currency"
              ].toLowerCase()}.svg`,
            });
          }
        });
      });
      let cryptocomRes = await window.fetch("https://crypto.com/earn");
      let reader = await cryptocomRes.body.getReader().read();
      let utf8decoder = new TextDecoder();
      const cryptocomHtml = utf8decoder.decode(reader.value);
   
      const cryptocomSoup = await new JSSoup(cryptocomHtml);
      const tabs = cryptocomSoup.findAll("div", { class: "css-11bys66" });
   
      tabs.forEach((tab) => {
        const coinData = tab.findAll("p");
        const imgUrl = tab.findAll("div", { class: "css-1aca62p" });
        let key = coinData[0].contents[0]._text + coinData[1].contents[0]._text;
        let asset = coinData[0].contents[0]._text;
        let rate = parseFloat(coinData[1].contents[0]._text) / 100;
        let url = "https://crypto.com" + imgUrl[0].contents[0].attrs.src;

        lockedStakingData.push({
          key: key,
          asset: asset,
          apy: rate.toFixed(5),
          lock: 0,
          src: "cryptocom",
          icon: "lock_open",
          source: "Crypto.com",
          refer:'https://crypto.com/earn',
          lockTerm: 0,
          type: "deposit",
          url: url,
        });
      });


      console.log(lockedStakingData);
      ctx.commit("setAllResults", lockedStakingData);
    },
    async getFlaskRates(ctx){
      const results = await window.fetch('http://localhost:5000/rates')
      console.log(results)
      const data = await results.json()
      console.log(data)
      ctx.commit("setAllResults", data);
    }
  },
};
