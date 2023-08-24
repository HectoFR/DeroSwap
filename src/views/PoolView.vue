<template>
  <div id="pool">
    <transition name="fade">
      <div v-if="!selectedPair">
        <h1>
          Pools
        </h1>
        <p class="infos">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Optio quibusdam dolor at moll.
        </p>
        <PoolArray @select="selectedPair = $event" />
      </div>
      <div
        v-else
        class="form"
      >
        <h1>
          <span>Pool: Add liquidity</span>
          <div>
            <img
              :src="`/assets/${selectedPair.asset1.name}.png`"
              :alt="`${selectedPair.asset1.name} img`"
            />
            {{ selectedPair.asset1.name }}
            <i class="fa fa-arrow-right" />
            <img
              :src="`/assets/${selectedPair.asset2.name}.png`"
              :alt="`${selectedPair.asset2.name} img`"
            />
            {{ selectedPair.asset2.name }}
          </div>
        </h1>
        <div class="inputs">
          <AssetInput
            :asset="selectedPair.asset1"
            no-select-asset
            :amount="amountFrom"
            @amount-changed="amountFrom = $event; amountFromChanged()"
          />
          <AssetInput
            :asset="selectedPair.asset2"
            no-select-asset
            :amount="amountTo"
            @amount-changed="amountTo = $event; amountToChanged()"
          />
        </div>
        <p>
          Estimated fees: 0.000 DERO
        </p>
        <div class="view-submit-button">
          <button @click="submit()/*displayConfirmation = true*/">
            Add to pool
          </button>
          <button @click="selectedPair = null">
            Back to pool's list
          </button>
        </div>
      </div>
    </transition>
    <transition name="fade-slow">
      <!-- :amount="selectedPair.asset1.amount" -->
      <ConfirmationModal
        v-if="displayConfirmation"
        :asset-from="selectedPair.asset1"
        :asset-to="selectedPair.asset2"
        operation="Pool"
        @close="displayConfirmation = false"
        @submit="submit"
      />
    </transition>
  </div>
</template>

<script>
import PoolArray from "@/components/PoolArray.vue";
import AssetInput from "@/components/AssetInput.vue";
import ConfirmationModal from "@/components/ConfirmationModal.vue";
import { Decimal } from "decimal.js"

// TODO: afficher gas fees
export default {
  name: 'PoolView',
  components: {
    PoolArray,
    AssetInput,
    ConfirmationModal,
  },
  data() {
    return {
      selectedPair: null,
      displayConfirmation: false,
      amountFrom: 0,
      amountTo: 0,
    }
  },
  computed: {
    assets() {
      return this.$store.state.assets;
    },
    atomicFrom() {
      return this.amountFrom * Math.pow(10, this.selectedPair.asset1.digit)
    },
    atomicTo() {
      return this.amountTo * Math.pow(10, this.selectedPair.asset2.digit)
    },
  },
  methods: {
    // Updates 'amountTo' based on the changes in 'amountFrom'
    amountFromChanged() {
      this.amountTo = this.divideIntByPowerOfTen(
        this.multiplyDivideThenFloor(
          this.multiplyByPowerOfTenInt(this.atomicFrom, this.selectedPair.asset1.digit),
          this.selectedPair.val2, 
          this.selectedPair.val1
        ), 
        this.selectedPair.asset2.digit
      );
    },
     // Updates 'amountFrom' based on the changes in 'amountTo'
    amountToChanged() {
      this.amountFrom = this.divideIntByPowerOfTen(
        this.multiplyDivideThenFloor(
          this.multiplyByPowerOfTenInt(this.atomicTo, this.selectedPair.asset2.digit),
          this.selectedPair.val1,
          this.selectedPair.val2
        ), 
        this.selectedPair.asset1.digit
      );
    },
    // Multiplies two numbers, then divides by a third, and returns the floor of the result.
    multiplyDivideThenFloor(I, valueTo, valueFrom) {
      Decimal.set({precision: 80});
      return new Decimal(I).mul(valueTo).div(valueFrom).floor().toNumber();
    },
    // Multiplies a number by 10^exponent and returns the integer value.
    multiplyByPowerOfTenInt(n, exponent) {
      const str = n.toString().replace('.', '') + Array(exponent).fill(0).join('');
      const res = str.length > exponent ? str.slice(0, str.length - exponent) : str;
      return Number.parseInt(res);
    },

    // Divides an integer by 10^exponent.
    divideIntByPowerOfTen(n, exponent) {
      const str = n.toString();
      const full = Array(exponent).fill(0).join('') + str;
      const res = full.slice(0, full.length - exponent) + '.' + full.slice(full.length - exponent);
      return Number.parseFloat(res);
    },

    submit() {
      this.$store.dispatch("poolAdd", {
        pair: this.selectedPair,
        atomicAmountFrom: this.multiplyByPowerOfTenInt(this.atomicFrom, this.selectedPair.asset1.digit),
        atomicAmountTo: this.multiplyByPowerOfTenInt(this.atomicTo, this.selectedPair.asset2.digit),
      });
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