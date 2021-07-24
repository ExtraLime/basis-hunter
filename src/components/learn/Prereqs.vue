<template>
  <div class="prereqs">
    <div class="intro">
      <p>
        Welcome to BasisTrade. This site contains a plethora of reaserch and
        market information regarding crypto currency future contracts and is not investment advice. Some
        terms and concepts will be explained breifly to lay out a few
        fundamentals.
      </p>
    </div>
    <ui-collapse :ripple="2">
      <template #toggle>
        <h2 class="point">Spot, Perpertual, Current Quarter, Next Quarter</h2>
        <h5 class="desc">
          These are the markets that make up the foundation of the material on
          this site.
        </h5>
      </template>

      <section class="prices">
        <ui-collapse class="ridge" :ripple="2">
          <template #toggle>
            <h3 class="subpoint">The Spot Price</h3>
          </template>
          <h5 class="desc">
            The spot price is the current price of the asset. The prices quoted
            in spot markets across various exchanges usually do not differ much
            from one to the other. There is no delivery or time obligation for
            settlement.
          </h5>
        </ui-collapse>
        <ui-collapse :ripple="2">
          <template #toggle>
            <h3 class="subpoint">Current Quarter and Next Quarter Futures</h3>
          </template>
          <p class="desc">
            A futures contract is an obligation to purchase or take delivery of
            a predetermined amount of goods or services for some predetermined
            price at some predetermined point in the future. In traditional
            markets, futures contracts can be used for securing supply chains,
            hedging risk and even speculation. In the crypto space, the
            mechanics are similar. The two most popular futures contracts are
            the current quarter contract and next quarter contract. Giving one
            up to 6 months of hedging time before settlement.
          </p>
          <ui-collapse :ripple="2">
            <template #toggle>
              <h5 class="sspoint">In-Kind/Coin Settlement</h5>
            </template>
            <h5 class="desc">
              In-kind settlement means that your account is collateralized by
              that asset. For example, one could transfer 1 ETH into their
              futures account, then open a short position of 1 ETH on the
              current quarter future contract. If the price of the underlying
              asset increases, the value of thier position would decrease. If
              the position were close at this point, the value of the 1 ETH of
              collateral would decrese.
            </h5>
          </ui-collapse>
          <ui-collapse :ripple="2">
            <template #toggle>
              <h5 class="sspoint">USDx Settlement</h5></template
            >
            <h5 class="desc">
              USDx settlement is a little different. One would transfer
              (usually) USDT in their futures account and open positions on
              differnt assets but denominated in a USD pegged asset. For
              example, one could transfer USDT 1000 into their account and open
              positions on multiple assets. When the positions are closed, the
              balanced is settled in USDT.
            </h5>
          </ui-collapse>
        </ui-collapse>

        <ui-collapse :ripple="2">
          <template #toggle>
            <span
              ><h3 class="subpoint">The Perpetual Swap (inverse swap)</h3></span
            ></template
          >
          <h5 class="desc">
            The perpetual swap, also known as the "inverse swap" is an asset
            that operates exactly like a futures contract but is settled every 8
            hours (on most exchanges). As a consequence of the short settlement
            interval, the expected premium for holding the asset is usually
            close to 0. This implies that the perptetual swap price is closely
            linked with the spot price. To ensure liquidity, the perpetual swap
            market has a "funding fee" associated with the settlement interval.
          </h5>
        </ui-collapse>
      </section>
    </ui-collapse>
    <!-- point 2 -->
    <ui-collapse :ripple="2">
      <template #toggle>
        <h2 class="point">Market Conditions</h2>
        <h5 class="desc">Breifly describes some general market scenarios</h5>
      </template>

      <section class="prices">
        <ui-collapse :ripple="2">
          <template #toggle>
            <h3 class="subpoint">Contango</h3>
          </template>
          <h5 class="desc">
            When the market is in "Contango" it means that the price in the
            quarterly markets is higher than the spot price. The funding rate in
            the perpetual swap market is usually positive.
          </h5>

        </ui-collapse>
        <ui-collapse :ripple="2">
          <template #toggle>
            <h3 class="subpoint">Backwardation</h3>
          </template>
          <h5 class="desc">
            The market is in "Backwardation" when the futures price is lower than the spot price. The basis is negative, and the funding rate is also negative.
          </h5>
        </ui-collapse>
      </section>
    </ui-collapse>
  </div>
</template>
<style scoped >
@import url(./learn.css);
</style>