  <template>
  <div class="filter">
    <h4>Search by Coin</h4>
    <input @input="setCoins" :value="financeCoin" />
    <!-- <div>
    <input @click="setFilter" type="checkbox" checked='false' v-model="stable" id="stable" />
    <label for="stable">Stables</label>
    </div>
    <div>
    <input @click="setFilter" type="checkbox" v-model="isFlex" id="isFlex" />
    <label for="isFlex">Flex Only</label>
    </div> -->
    <div>
    <ui-switch
      v-model="stable"
      input-id="stable-swtich"
      class="stable-swtich"
      true-value="on"
      false-value="off"
      :checked='stable'
      @click="setFilter"
    >
      {{ stable }} Stable Coins Only
    </ui-switch></div>
    <label for="stable-swtich">{{ stable }} Stables Only</label>
    <div><ui-switch
      v-model="isFlex"
      input-id="is-flex-switch"
      class="is-flex-switch"
      true-value="on"
      false-value="off"
      @click="setFilter"
    >
      {{ isFlex }} Felx Only
    </ui-switch></div>
    <label for="is-flex-switch">{{ isFlex }} Flex Only</label>
  </div>
</template>
<script>
import { useStore } from "vuex";
import { ref, onMounted } from "vue";
export default {
  setup() {
    const stable = ref('off');
    const isFlex = ref('off');

    const store = useStore();
    const setCoins = ($event) => {
      store.dispatch("finance/setFinanceCoin", $event.target.value);
    };
    const setFilter = () => {
      store.dispatch("finance/setCoinFilter", { stable,
                                                 isFlex });
    };
    onMounted(()=>{
        store.dispatch('finance/setCoinFilter',{stable,isFlex})
        console.log('mountedCF')
    })


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
 .filter{
     display:block;
     justify-content: center;

 }
 @use '@material/switch/variables' as switch-variables with (
  $track-width: 36px,
  $track-height: 14px,
  $thumb-diameter: 20px,
  $ripple-size: 48px,

  $minimum-size: 28px,
  $maximum-size: $ripple-size,
  $density-scale: density-variables.$default-scale,
  $density-config: (
    size: (
      minimum: $minimum-size,
      default: $maximum-size,
      maximum: $maximum-size,
    ),
  ),

  $thumb-active-margin: $track-width - $thumb-diameter,

  $toggled-off-thumb-color: surface,
  $toggled-off-track-color: on-surface,
  $toggled-off-ripple-color: red,
  $disabled-thumb-color: surface,
  $disabled-track-color: on-surface,

  $baseline-theme-color: red
);
.tab-select{
  display:block
}
</style>