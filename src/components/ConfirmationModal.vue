<template>
    <dialog
        id="confirmation-modal"
        class="modal"
        @click="$emit('close')"
    >
        <div
            class="modal-content"
            @click.stop=""
        >
            <button
                class="close"
                @click="$emit('close')"
            >
                <i class="fa fa-times" />
            </button>
            <h2>{{operation}} - Confirm the operation</h2>
            
            <div class="gas-fees">
                Pool fees: {{ poolFees.toFixed(assetTo.asset.digit) }} {{ assetTo.asset.name }}
                <br />
                Gas fees: {{ gasFees }} DERO
                <br />
                Slippage: {{ slippage < .001 ? 'less than 0,001' : slippage }}%
            </div>

            <div class="center">
                <div class="from">
                    <h3>
                        <img :src="`/assets/${assetFrom.asset.name}.png`" />
                        {{ assetFrom.asset.name }}
                    </h3>
                    <div>{{ assetFrom.amount }}</div>
                    <div>
                        Est. balance:
                        <del>{{ assetFrom.asset.realBalance.toFixed(assetFrom.asset.digit) }}</del>
                        <i class="fa fa-arrow-right" /> {{ newRealBalanceFrom }}
                    </div>
                </div>
                <i class="fa fa-arrow-down" />
                <div class="to">
                    <h3>
                        <img :src="`/assets/${assetTo.asset.name}.png`" />
                        {{ assetTo.asset.name }}
                    </h3>
                    <div>{{ amountToWithFees.toFixed(assetTo.asset.digit) }}</div>
                    <div>
                        Est. balance:
                        <del>{{ assetTo.asset.realBalance.toFixed(assetTo.asset.digit) }}</del>
                        <i class="fa fa-arrow-right" /> {{ newRealBalanceTo }}
                    </div>
                </div>
                <div class="view-submit-button">
                    <button
                        type="submit"
                        @click="$emit('submit')"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    </dialog>
</template>

<script>
export default {
    name: 'AssetsModal',
    components: {
    },
    props: {
        assetFrom: Object,
        assetTo: Object,
        currentPair: Object,
        slippage: Number,
        operation: String,
    },
    data() {
        return {
            searchText: "",
            poolFees: 0,
            gasFees: 0,
            amountToWithFees: 0,
        }
    },
    computed: {
        newRealBalanceFrom() {
            const atomicAmount = this.assetFrom.amount * Math.pow(10, this.assetFrom.asset.digit)
            return (
                (this.assetFrom.asset.atomicBalance - atomicAmount) / Math.pow(10, this.assetFrom.asset.digit)
            ).toFixed(this.assetFrom.asset.digit);
        },
        newRealBalanceTo() {
            const atomicAmount = this.amountToWithFees * Math.pow(10, this.assetTo.asset.digit)
            return (
                (this.assetTo.asset.atomicBalance + atomicAmount) / Math.pow(10, this.assetTo.asset.digit)
            ).toFixed(this.assetTo.asset.digit);
        },
    },
    async mounted() {
        this.amountToWithFees = (this.assetTo.amount * (10000 - this.currentPair.fees)) / 10000;

        this.poolFees = (this.assetTo.amount * this.currentPair.fees) / 10000;
        
        this.gasFees = await this.$store.dispatch("getEstimatedGasFees", {
            asset1: this.assetTo.asset,
            atomicAmountFrom: Math.floor(this.assetFrom.amount * Math.pow(10, this.assetFrom.asset.digit)),
            pairScId: this.currentPair.contract,
        })
    }
}
</script>

<style lang="scss">
@use "@/assets/variables.scss" as var;

.center {
    display: flex;
    flex-direction: column;
    align-items: center;
}

#confirmation-modal {
    font-size: 2rem;
    .modal-content {
        width: unset;
    }

    h3 {
        display: flex;
        gap: 1rem;
        align-items: center;
        margin: 0;
        font-size: 3rem;
        img {
            width: 3.2rem;
            height: 3.2rem;
        }
    }

    .fa-arrow-down {
        margin: 4rem 0;
        font-size: 3rem;
    }
    .fa-arrow-right {
        font-size: 1.6rem;
    }

    .from, .to {
        display: flex;
        gap: 1rem;
        flex-direction: column;
        align-items: center;
    }
    .gas-fees {
        text-align: center;
        margin-bottom: 3rem;
    }
}
</style>
