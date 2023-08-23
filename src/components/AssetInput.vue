<template>
    <div class="asset-input">
        <div>
            <component
                :is="noSelectAsset ? 'div' : 'button'"
                class="asset-selector"
                @click="$emit('asset-select')"
            >
                <template v-if="asset">
                    <img :src="`/assets/${asset.name}.png`" />
                    {{ asset.name }}
                </template>
            </component>
        </div>
        <div class="input-container">
            <i
                class="fa fa-info"
                @click.stop=""
                v-tooltip="{
                    content: asset.scid,
                    triggers: ['hover', 'click'],
                }"
            />
            <input 
                type="number"
                :value="amount"
                placeholder="0"
                @change="$emit('amount-changed', $event.target.valueAsNumber)"
                :class="{ 'no-buttons': noButtons }"
            />
            <div
                v-if="!noButtons"
                class="amount-selector"
            >
                <button @click="percent(25)">25%</button>
                <button @click="percent(50)">50%</button>
                <button @click="percent(75)">75%</button>
                <button @click="percent(100)">
                    Max
                    <span v-if="asset.realBalance !== undefined">
                        ({{ asset.realBalance.toFixed(asset.digit) }})
                    </span>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'AssetInput',
    props: {
        asset: Object,
        amount: Number,
        noSelectAsset: Boolean,
        noButtons: Boolean,
    },
    methods: {
        percent(val) {
            const amount = this.asset.atomicBalance * (val/100);
            this.$emit('amount-changed', amount / Math.pow(10, this.asset.digit));
        }
    }
}
</script>

<style lang="scss">
@use "@/assets/variables.scss" as var;

.asset-input {
    // overflow: hidden;
    display: flex;
    align-items: center;
    align-items: stretch;
    
    .asset-selector {
        display: flex;
        gap: 1rem;
        align-items: center;
        padding: 1rem 2rem 1rem 1rem;
        background: var.$light-background-color;
        border: 1px solid lighten(var.$light-background-color, 35%);
        border-radius: 1rem 0 0 1rem;
        color: white;
        transition: background-color 0.5s;
    }

    button.asset-selector {
        cursor: pointer;

        &:hover {
            background-color: lighten(var.$light-background-color, 35%);
        }
    }

    img {
        width: 3.2rem;
        height: 3.2rem;
    }

    .input-container {
        width: 100%;
        position: relative;
    }

    input {
        padding: 1rem 4rem 1rem 2rem;
        width: 100%;
        height: 5.2rem;
        background: var.$light-background-color;
        font-size: var.$font-size-regular;
        color: white;
        border: 1px solid lighten(var.$light-background-color, 35%);
        border-top-right-radius: 1rem;
        height: 5.4rem; // Meeeh
        outline: none;

        &.no-buttons {
            border-bottom-right-radius: 1rem;
        }
    }

    .amount-selector {
        display: flex;

        >button {
            flex: 1;
            padding: 1rem;
            background: var.$light-background-color;
            color: white;
            border: none;
            border: 1px solid lighten(var.$light-background-color, 35%);
            cursor: pointer;
            transition: background-color 0.5s;

            &:first-child {
                border-bottom-left-radius: 1rem;
            }

            &:last-child {
                border-bottom-right-radius: 1rem;
            }

            &:hover {
                background-color: lighten(var.$light-background-color, 35%);
            }
        }
    }

    .fa-info {
        display: flex;
        align-items: center;
        position: absolute;
        top: 0;
        right: 0;
        height: 5.4rem;
        padding: 1rem;
        border-left: 1px solid lighten(var.$light-background-color, 35%);
    }
}
</style>
