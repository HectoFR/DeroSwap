<template>
  <div
    id="swap"
  >
    <h1>
      Swap your assets
    </h1>
    <p class="infos">
      Lorem ipsum, dolor sit amet consectetur adipisicing elit. Optio quibusdam dolor at mollitia numquam et possimus harum praesentium consequatur reiciendis est aspernatur incidunt, veniam accusamus sint beatae quaerat assumenda eligendi!
    </p>
    <div>
      <AssetInput
        :asset="assetFrom.asset"
        :amount="assetFrom.amount"
        @amount-changed="assetFrom.amount = $event"
        @asset-select="modalOpen='assetFrom'"
      />
      <!-- @select="" -->
      
      <div
        class="arrow"
      >
        <button @click="invert">
          <i class="fa fa-arrow-up" />&nbsp;
          <i class="fa fa-arrow-down" />
        </button>
      </div>

      <AssetInput
        :asset="assetTo.asset"
        :amount="assetTo.amount"
        @amount-changed="assetTo.amount = $event"
        @asset-select="modalOpen='assetTo'"
      />

      <p class="fees">
        1 {{ assetFrom.asset.name }} = 0.0000000020221321312 {{ assetTo.asset.name }}
        <br />
        Fees 0.000 {{ assetFrom.asset.name }}
      </p>
      <div class="swap-button-container">
        <button>
          Swap
        </button>
      </div>
    </div>
    <AssetsModal
      v-if="modalOpen"
      @close="modalOpen = null"
      @select="this[modalOpen].asset = $event; modalOpen = null"
    />
  </div>
</template>

<script>
import AssetInput from "@/components/AssetInput.vue";
import AssetsModal from "@/components/AssetsModal.vue";

export default {
  name: 'SwapView',
  components: {
    AssetInput,
    AssetsModal,
  },
  data() {
    return {
      assetFrom: {
        asset: this.$store.state.assets[0],
        amount: null,
      },
      assetTo: {
        asset: this.$store.state.assets[1],
        amount: null,
      },
      modalOpen: false,
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
  margin: 0 20%;
  h1 {
    text-align: center;
    margin: 2rem 0 0 0;
  }

  .infos {
    margin: 5rem 0;
  }

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

  .swap-button-container {
    text-align: center;
    button {
      border: 1px solid var.$light-background-color;
      border-radius: 1rem;
      width: 50%;
      padding: 1rem;
      background-color: var.$ascent-color;
      color: white;
      font-weight: bold;
      text-transform: uppercase;
      cursor: pointer;
      transition: background-color 0.5s;
      &:hover {
        background-color: var.$light-ascent-color;
      }
    }
  }

  .fees {
    margin: 3rem 0;
    text-align: center;
  }
}
</style>
