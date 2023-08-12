<template>
  <div
    v-if="assetTo.asset && assetFrom.asset"
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
        :asset="assetFrom.asset"
        :amount="assetFrom.amount"
        @amount-changed="assetFrom.amount = $event"
        @asset-select="modalOpen = 'assetFrom'"
      />
      <!-- @select="" -->

      <div class="arrow">
        <button @click="invert">
          <i class="fa fa-arrow-up" />&nbsp;
          <i class="fa fa-arrow-down" />
        </button>
      </div>

      <AssetInput
        :asset="assetTo.asset"
        :amount="assetTo.amount"
        @amount-changed="assetTo.amount = $event"
        @asset-select="modalOpen = 'assetTo'"
      />

      <p class="fees">
        1 {{ assetFrom.asset.name }} = 0.0000000020221321312 {{ assetTo.asset.name }}
        <br />
        Fees 0.000 {{ assetFrom.asset.name }}
      </p>
      <div class="view-submit-button">
        <button
          type="submit"
          @click="displayConfirmation = true"
        >
          Swap
        </button>
      </div>
    </div>
    <transition name="fade-slow">
      <AssetsModal
        v-if="modalOpen"
        @close="modalOpen = null"
        @select="this[modalOpen].asset = $event; modalOpen = null"
      />
    </transition>
    <transition name="fade-slow">
      <ConfirmationModal
        v-if="displayConfirmation"
        :asset-from="assetFrom.asset"
        :asset-to="assetTo.asset"
        :amount="assetFrom.amount"
        operation="Swap"
        @close="displayConfirmation = false"
        @submit="null"
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
      assetFrom: {},
      assetTo: {},
      modalOpen: false,
      displayConfirmation: false,
    };
  },
  computed: {
      assets() {
          return this.$store.state.assets;
      }
  },
  mounted() {
    this.assetFrom = {
      asset: Object.values(this.assets)[0],
      amount: null,
    };

    this.assetTo = {
      asset: Object.values(this.assets)[1],
      amount: null,
    };
  },
  methods: {
    invert() {
      const tmp = this.assetFrom.asset;

      this.assetFrom.asset = this.assetTo.asset;
      this.assetTo.asset = tmp;
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
