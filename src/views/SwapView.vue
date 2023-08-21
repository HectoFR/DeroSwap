<template>
  <div
    v-if="to.asset && from.asset"
    id="swap"
  >
    <h1>
      Swap your assets
    </h1>
    <p class="infos">
      Lorem ipsum, dolor sit amet consectetur adipisicing elit. Optio quibusdam dolor at mollitia numquam et possimus
      harum praesentium consequatur reiciendis est aspernatur incidunt, veniam accusamus sint beatae quaerat assumenda
      eligendi!
    </p>
    <div>
      <AssetInput
        :asset="from.asset"
        :amount="from.amount"
        @amount-changed="from.amount = $event; amountFromChanged()"
        @asset-select="modalOpen = 'from'"
      />
      <!-- @select="" -->

      <div class="arrow">
        <button @click="invert">
          <i class="fa fa-arrow-up" />&nbsp;
          <i class="fa fa-arrow-down" />
        </button>
      </div>

      <AssetInput
        :asset="to.asset"
        :amount="to.amount"
        @amount-changed="to.amount = $event; amountToChanged()"
        @asset-select="modalOpen = 'to'"
        no-buttons
      />

      <div
        v-if="!isNaN(currentRealRatio)"
        class="fees"
      >
        1 {{ from.asset.name }} &asymp; {{ currentRealRatio }} {{ to.asset.name }}
        <div
          v-if="from.amount"
          :style="{ color: slippageColor }"
        >
          Slippage = {{ slippage < .001 ? 'less than 0,001' : slippage }}%
        </div>
        <!-- TODO Fees {{ from.amount * (currentPair.fees/1000)}} DERO -->
      </div>
      <div class="view-submit-button">
        <button
          type="submit"
          @click="displayConfirmation = true"
          :disabled="isNaN(currentRealRatio) || !from.amount || !to.amount || from.amount > from.asset.realBalance"
        >
          <template v-if="from.amount > from.asset.realBalance">
            Not enough liquidity
          </template>
          <template v-else>
            {{ isNaN(currentRealRatio) ? "No liquidity in pool" : "Swap" }}
          </template>
        </button>
      </div>
    </div>
    <transition name="fade-slow">
      <AssetsModal
        v-if="modalOpen"
        @close="modalOpen = null"
        @select="this[modalOpen].asset = $event; modalOpen = null"
        :type="modalOpen"
        :assets="assetsTo"
      />
    </transition>
    <transition name="fade-slow">
      <ConfirmationModal
        v-if="displayConfirmation"
        :asset-from="from"
        :asset-to="to"
        :amount="from.amount"
        :current-pair="currentPair"
        :slippage="slippage"
        operation="Swap"
        @close="displayConfirmation = false"
        @submit="submit"
      />
    </transition>
  </div>
</template>

<script>
import AssetInput from "@/components/AssetInput.vue";
import AssetsModal from "@/components/AssetsModal.vue";
import ConfirmationModal from "@/components/ConfirmationModal.vue";

export default {
  name: 'SwapView',
  components: {
    AssetInput,
    AssetsModal,
    ConfirmationModal
  },
  data() {
    return {
      from: {},
      to: {},
      modalOpen: false,
      displayConfirmation: false,
    };
  },
  computed: {
      assets() {
          return this.$store.state.assets;
      },
      currentPair() {
        return this.$store.state.pairs.find((p) => (
          p.asset1.name === this.from.asset.name && p.asset2.name === this.to.asset.name
          || p.asset2.name === this.from.asset.name && p.asset1.name === this.to.asset.name
        ))
      },
      assetsTo() {
        if (this.modalOpen === "from") {
          return Object.values(this.assets)
        } else {
          const fromName = this.from.asset.name;

          const compatibleAssets = [];
          this.$store.state.pairs.forEach((p) => {
            if (p.asset1.name == fromName) {
              compatibleAssets.push(p.asset2);
            } else if (p.asset2.name == fromName) {
              compatibleAssets.push(p.asset1);
            }
          })

          return compatibleAssets;
        }
      },
      inverted() {
        return this.currentPair.asset1.name !== this.from.asset.name;
      },
      currentRealRatio() {
        let ratio = null;

        if (this.inverted) {
          ratio = 1 / this.currentPair.realRatio;
        } else {
          ratio = this.currentPair.realRatio;
        }

        return ratio.toFixed(this.to.asset.digit);
      },
      slippage() {
        const realAmountFrom = this.from.amount * Math.pow(10, this.from.asset.digit)
        const contractVal = this.inverted ? this.currentPair.val2 : this.currentPair.val1;
        const slippage = 100 - (1 / (1 + realAmountFrom / contractVal) * 100);
        return Math.round((slippage || 0) * 1000) / 1000;
      },
      slippageColor() {
        if (this.slippage > 25) {
          return "red";
        } else if (this.slippage > 10) {
          return "orange";
        } else {
          return undefined;
        }
      }
  },
  watch: {
    "from.asset.name"() {
      if(!this.to.asset) {
        this.to.asset = this.assetsTo[0];
      }
      
      const notFound = !this.assetsTo.some((a) => a.name === this.to.asset.name)
      if (notFound) {
        this.to.asset = this.assetsTo[0];
      }
    },
  },
  mounted() {
    this.from = {
      asset: Object.values(this.assets)[1],
      amount: null,
    };
  },
  methods: {
    invert() {
      const tmp = this.from.asset;
      this.from.asset = this.to.asset;
      this.to.asset = tmp;
    },
    amountFromChanged() {
      // With slippage
      const amount = this.from.amount;
      const valueFrom = this.inverted ? this.currentPair.val2 : this.currentPair.val1;
      const valueTo = this.inverted ? this.currentPair.val1 : this.currentPair.val2;
      const digitsFrom = this.from.asset.digit;
      const digitsTo = this.to.asset.digit;

      const amountToWithSlippage = Math.floor(
        ((amount * Math.pow(10, digitsFrom)) * valueTo) / (valueFrom + amount * Math.pow(10, digitsFrom))
      ) / Math.pow(10, digitsTo);
      this.to.amount = amountToWithSlippage;
    },
    amountToChanged() {
      // TODO: Slippage
      const ratio = this.inverted ? (1 / this.currentPair.realRatio) : (1 / this.currentPair.realRatio);
      this.from.amount = this.to.amount * ratio;
    },
    async submit() {
      const res = await this.$store.dispatch("swap", {
        asset1: this.to.asset,
        atomicAmountFrom: Math.floor(this.from.amount * Math.pow(10, this.from.asset.digit)),
        pairScId: this.currentPair.contract,
      })

      if (res.message) { // Error
        this.$store.dispatch("displayToast", res.message);
      } else {
        this.$store.dispatch("displayToast", "Success. Txid:" + res.txid);
      }
    }
  }
}
</script>

<style lang="scss">
@use "@/assets/variables.scss" as var;

#swap {
  .arrow {
    text-align: center;
    margin: 3rem 0;

    .fa {
      font-size: 3rem;
    }

    button {
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      transition: color 0.5s;

      &:hover {
        color: var.$light-ascent-color;
      }
    }
  }

  .fees {
    margin: 3rem 0;
    text-align: center;
  }
}
</style>
