  <template>
  <div class="filter">
    <h4>Search by Coin</h4>
    <div class="coinInput">
    <input @input="setCoins" :value="financeCoin" />
    </div>
    <!-- <div>
    <input @click="setFilter" type="checkbox" checked='false' v-model="stable" id="stable" />
    <label for="stable">Stables</label>
    </div>
    <div>
    <input @click="setFilter" type="checkbox" v-model="isFlex" id="isFlex" />
    <label for="isFlex">Flex Only</label>
    </div> -->
              <label for="stable-swtich">Stables Only</label>
    <div class=stable>

      <ui-switch
        v-model="stable"
        input-id="stable-swtich"
        class="stable-swtich"
        true-value="on"
        false-value="off"
        :checked="stable"
        @click="setFilter"
      >
        {{ stable }} Stable Coins Only
      </ui-switch>
    </div>
          <label for="is-flex-switch">Flex Only</label>
    <div class=flex>

      <ui-switch
        v-model="isFlex"
        input-id="is-flex-switch"
        class="is-flex-switch"
        true-value="on"
        false-value="off"
        @click="setFilter"
      >
        {{ isFlex }} Felx Only
      </ui-switch>
    </div>

  </div>
</template>
<script>
import { useStore } from "vuex";
import { ref, onMounted } from "vue";
export default {
  setup() {
    const stable = ref("off");
    const isFlex = ref("off");

    const store = useStore();
    const setCoins = ($event) => {
      store.dispatch("finance/setFinanceCoin", $event.target.value);
    };
    const setFilter = () => {
      store.dispatch("finance/setCoinFilter", { stable, isFlex });
    };
    onMounted(() => {
      store.dispatch("finance/setCoinFilter", { stable, isFlex });
      console.log("mountedCF");
    });

    return {
      setCoins,
      setFilter,
      stable,
      isFlex,
    };
  },
};
</script>
  <style lang='scss' scoped>
.filter {
  display: inline-block;
  justify-content: center;
  text-align:center;
}
.coinInput{
  margin-bottom:1rem
}
.tab-select {
  display: block;
}
.stable{
  margin:1rem;

  justify-content: center;
  display:grid;
}
.flex{
  margin:1rem;

  justify-content: center;
  display:grid;
  text-align:center
}
.mdc_switch{
  justify-content:center
}
</style>