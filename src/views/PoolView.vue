<template>
  <div id="pool">
    <transition name="fade">
      <div v-if="!selectedPool">
        <h1>
          Pools
        </h1>
        <p class="infos">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Optio quibusdam dolor at moll.
        </p>
        <PoolArray @select="selectedPool = $event" />
      </div>
      <div
        v-else
        class="form"
      >
        <h1>
          <span>Pool: Add liquidity</span>
          <div>
            <img
              :src="`/assets/${selectedPool.assets.from}.png`"
              :alt="`${selectedPool.assets.from} img`"
            />
            {{ selectedPool.assets.from }}
            <i class="fa fa-arrow-right" />
            <img
              :src="`/assets/${selectedPool.assets.to}.png`"
              :alt="`${selectedPool.assets.to} img`"
            />
            {{ selectedPool.assets.to }}
          </div>
        </h1>
        <div class="inputs">
          <AssetInput
            :asset="selectedPool.assets.from"
            no-select-asset
          />
          <AssetInput
            :asset="selectedPool.assets.to"
            no-select-asset
          />
        </div>
        <p>
          Estimated fees: 0.000 DERO
        </p>
        <div class="view-submit-button">
          <button @click="displayConfirmation = true">
            Add to pool
          </button>
          <button @click="selectedPool = null">
            Back to pool's list
          </button>
        </div>
      </div>
    </transition>
    <transition name="fade-slow">
      <!-- :amount="selectedPool.assets.from.amount" -->
      <ConfirmationModal
        v-if="displayConfirmation"
        :asset-from="selectedPool.assets.from"
        :asset-to="selectedPool.assets.to"
        operation="Pool"
        @close="displayConfirmation = false"
        @submit="null"
      />
    </transition>
  </div>
</template>

<script>
import PoolArray from "@/components/PoolArray.vue";
import AssetInput from "@/components/AssetInput.vue";
import ConfirmationModal from "@/components/ConfirmationModal.vue";

export default {
  name: 'PoolView',
  components: {
    PoolArray,
    AssetInput,
    ConfirmationModal,
  },
  data() {
    return {
      selectedPool: null,
      displayConfirmation: false,
    }
  },
  computed: {
    assets() {
      return this.$store.state.assets;
    }
  }

}
</script>

<style lang="scss">
@use "@/assets/variables.scss" as var;

#pool {
  margin: 0;

  h1 {
    margin: 0 20%;

    div {
      margin-top: 1rem;
    }

    img {
      margin-right: 0.5rem;
    }
  }

  p {
    margin: 3rem 20% 0 20%;
    text-align: center;
  }

  table {
    overflow: hidden;
    margin: 0 10% 3rem 10%;
    width: 80%;
    border-radius: 1rem;
  }

  table {
    border: 1px solid var.$ascent-color;
    border-collapse: collapse;
  }
  th {
    border-bottom: 1px solid var.$ascent-color;
    border-left: 1px solid lighten(var.$light-background-color, 5%);
    border-right: 1px solid lighten(var.$light-background-color, 5%);
  }

  td,
  th {
    padding: 1rem;
  }

  th {
    font-weight: bold;
  }

  tr {
    background-color: var.$light-background-color;
    transition: background-color 0.5s;
  }

  tbody tr:nth-child(2n+1) {
    background-color: var.$very-light-background-color;
  }

  tbody tr:hover {
    background-color: var.$ascent-color;
    cursor: pointer;
  }

  .coins {
    display: flex;
    gap: 0.5rem;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    >div {
      display: flex;
      gap: 1rem;

      img {
        width: 3.2rem;
        height: 3.2rem;
      }
    }
  }

  .from,
  .to {
    >div {
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }

    img {
      width: 1.5rem;
      height: 1.5rem;
    }
  }

  .search-bar {
    position: sticky;
    top: -1rem;
    z-index: 10;
    overflow: hidden;
    display: flex;
    margin: 4rem 20% 1.5rem 20%;
    height: 4rem;
    background-color: var.$light-background-color;
    border: 1px solid var.$very-light-background-color;
    border-radius: 1rem;

    input {
      flex: 1;
      padding: 0.5rem 2rem;
      background-color: transparent;
      border: none;
      color: white;
    }

    button {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 4rem;
      height: 4rem;
      background: var.$light-background-color;
      border: none;
      border-left: 1px solid var.$very-light-background-color;
      color: white;
      transition: background-color 0.5s;

      &:hover {
        background-color: lighten(var.$light-background-color, 35%);
      }
    }
  }

  .form {
    margin: 0 20%;

    h1 {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      img {
        width: 3rem;
        height: 3rem;
      }

      >div {
        display: flex;
        align-items: center;
      }

      .fa-arrow-right {
        margin: 0 1rem;
      }
    }

    .inputs {
      margin: 3rem 0;

      .asset-input {
        margin: 5rem 0;
      }
    }
  }
}
</style>