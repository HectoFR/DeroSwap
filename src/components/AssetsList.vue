<template>
    <div>
        <h2>
            My assets
        </h2>
        <ul class="assets-list">
            <li v-for="asset in Object.values(assets)" :key="asset.name">
                <a>
                    <div>
                        <img
                            :src="`/assets/${asset.name}.png`"
                            :alt="`${asset.name} image`"
                        >
                        <span>{{ asset.name }}</span>
                    </div>
                    <div v-if="asset.realBalance !== undefined">
                        Balance:
                        {{
                            asset.realBalance.toFixed(asset.digit)
                        }}
                    </div>
                </a>
            </li>
        </ul>
    </div>
</template>
  
<script>
export default {
    name: 'AssetsList',
    data() {
        return {
        }
    },
    computed: {
        assets() {
            return this.$store.state.assets;
        }
    },
    mounted() {
    }
}
</script>
  
<style lang="scss">
@use "@/assets/variables.scss" as var;

.assets-list {
    position: relative;
    overflow: auto;
    display: flex;
    flex-direction: column;
    flex: 1;
    padding: 0;
    height: 100%;
    list-style: none;

    li {
        margin: 0 3rem;
        padding: 1rem 0;
        font-size: var.$font-size-regular;

        a {
            position: relative;
            display: flex;
            display: flex;
            gap: 1rem;
            flex-direction: column;
            align-items: center;
            padding: 1rem;
            width: 100%;
            background: none;
            border: none;
            color: white;

            >div {
                display: flex;
                gap: 1rem;
                align-items: center;
                width: 100%;

                >span {
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
            }

            // &.active,
            // &:hover {
            //     background: rgba(#dedede, 0.2);
            //     border-radius: 1rem;
            // }
        }

        &+li {
            border-top: 1px solid white;
        }
    }

    img {
        width: 3rem;
        height: 3rem;
    }
}
</style>