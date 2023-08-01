<template>
    <div class="asset-input">
        <div>
            <component
                :is="noSelectAsset ? 'div' : 'button'"
                class="asset-selector"
                @click="$emit('asset-select')"
            >   
                <template v-if="asset">
                    <img :src="asset.img" />
                    {{ asset.name }}
                </template>
            </component>
        </div>
        <div class="input-container">
            <input 
                type="number"
                :value="amount"
                placeholder="0"
                @change="$emit('amount-changed', $event.target.valueAsNumber)"
            />
            <div class="amount-selector">
                <button>25%</button>
                <button>50%</button>
                <button>75%</button>
                <button>Max (112122)</button>
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
    },
}
</script>

<style lang="scss">
@use "@/assets/variables.scss" as var;

.asset-input {
    display: flex;
    align-items: center;
    overflow: hidden;
    align-items: stretch;

    .asset-selector {
        display: flex;
        align-items: center;
        gap: 1rem;
        border: 1px solid lighten(var.$light-background-color, 35%);
        padding: 1rem 2rem 1rem 1rem;
        background: var.$light-background-color;
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
    }
    input {
        width: 100%;
        background: var.$light-background-color;
        padding: 1rem 2rem;
        color: white;
        font-size: var.$font-size-regular;
        height: 5.2rem;
        border: 1px solid lighten(var.$light-background-color, 35%);
        border-top-right-radius: 1rem;
        outline: none;
    }
    .amount-selector {
        display: flex;
        > button {
            flex: 1;
            color: white;
            border: none;
            border: 1px solid lighten(var.$light-background-color, 35%);
            cursor: pointer;
            transition: background-color 0.5s;
            background: var.$light-background-color;
            padding: 1rem;

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
}
</style>
