<template>
  <div id="pool">
    <template v-if="!selectedPool">
      <h1>
        Pools
      </h1>
      <p class="infos">
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Optio quibusdam dolor at moll.
      </p>
      <PoolArray @select="selectedPool = $event" />
    </template>
    <div
      v-else
      class="form"
    >
      <h1>
        <span>Pool: Add liquidity</span>
        <div>
          <img
            :src="selectedPool.assets.from.img"
            :alt="`${selectedPool.assets.from.name} img`"
          >
          {{ selectedPool.assets.from.name }}
          <i class="fa fa-arrow-right" />
          <img
            :src="selectedPool.assets.to.img"
            :alt="`${selectedPool.assets.to.name} img`"
          >
          {{selectedPool.assets.to.name }}
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
        <button>
          Add to pool
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import PoolArray from "@/components/PoolArray.vue"
import AssetInput from "@/components/AssetInput.vue"

export default {
  name: 'PoolView',
  components: {
    PoolArray,
    AssetInput,
  },
  data() {
    return {
      selectedPool: null,
    }
  },

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
    margin: 0 10% 3rem 10%;
    width: 80%;
    border-radius: 1rem;
    overflow: hidden;
  }

  table,
  th,
  td {
    border: 1px solid var.$ascent-color;
    border-collapse: collapse;
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
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;

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
      align-items: center;
      gap: 0.5rem;
    }

    img {
      width: 1.5rem;
      height: 1.5rem;
    }
  }

  .search-bar {
    display: flex;
    margin: 4rem 20% 1.5rem 20%;
    border: 1px solid var.$very-light-background-color;
    border-radius: 1rem;
    height: 4rem;
    overflow: hidden;
    background-color: var.$light-background-color;

    position: sticky;
    top: -1rem;
    z-index: 10;

    input {
      flex: 1;
      padding: 0.5rem 2rem;
      background-color: transparent;
      border: none;
      color: white;
    }

    button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 4rem;
      height: 4rem;
      border: none;
      border-left: 1px solid var.$very-light-background-color;
      background: var.$light-background-color;
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
      align-items: center;
      justify-content: center;
      
      img {
        width: 3rem;
        height: 3rem;
      }
      > div {
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