<template>
    <div>
        <h2>
            My assets
        </h2>
        <ul class="assets-list">
            <li v-for="asset in assets" :key="asset.name">
                <a>
                    <div>
                        <img :src="asset.img" :alt="`${asset.name} image`">
                        <span>{{ asset.name }}</span>
                    </div>
                    <div v-if="asset.balance">Balance: {{asset.balance}}</div>
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
    }
}
</script>
  
<style lang="scss">
@use "@/assets/variables.scss" as var;

.assets-list {
    position: relative;
    flex: 1;
    display: flex;
    flex-direction: column;
    list-style: none;
    padding: 0;
    height: 100%;
    overflow: auto;

    &::-webkit-scrollbar {
        width: 0.5rem;
        /* width of the entire scrollbar */
    }

    &::-webkit-scrollbar-track {
        background: transparent;
        /* color of the tracking area */
    }

    &::-webkit-scrollbar-thumb {
        background-color: white;
        /* color of the scroll thumb */
        border-radius: 0.5rem;
        /* roundness of the scroll thumb */
    }

    li {
        margin: 0 3rem;
        padding: 1rem 0;
        font-size: var.$font-size-regular;

        a {
            background: none;
            border: none;
            color: white;
            display: flex;
            padding: 1rem;
            align-items: center;
            gap: 1rem;
            position: relative;
            width: 100%;
            display: flex;
            flex-direction: column;

            > div  {
                width: 100%;
                display: flex;
                gap: 1rem;
                align-items: center;
                > span {
                    text-overflow: ellipsis;
                    overflow: hidden;
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