<template>
    <dialog id="assets-modal">
        <div class="modal-content">
            <button
                class="close"
                @click="$emit('close')"
            >
                <i class="fa fa-times" />
            </button>
            <h2>Select an asset</h2>

            <div class="search-bar">
                <!-- add a button? -->
                <input
                    v-model="searchText"
                    placeholder="Search..."
                />
            </div>
            <AssetsGrid
                :assets="assets"
                @select="$emit('select', $event)"
            />
        </div>
    </dialog>
</template>

<script>
import AssetsGrid from "@/components/AssetsGrid.vue";

export default {
    name: 'AssetsModal',
    components: {
        AssetsGrid,
    },
    props: {
    },
    data() {
        return {
            searchText: ""
        }
    },
    computed: {
        assets() {
            const allAssets = [
                ...this.$store.state.assets,
                ...this.$store.state.assets, // TODO
                ...this.$store.state.assets,
                ...this.$store.state.assets,
            ];

            return allAssets.filter(
                (a) => {
                    console.log(a.name.toLowerCase(), this.searchText.toLowerCase(), a.name.toLowerCase().includes(this.searchText.toLowerCase()));
                    return a.name.toLowerCase().includes(this.searchText.toLowerCase());
                }
            );
        }
    }
}
</script>

<style lang="scss">
@use "@/assets/variables.scss" as var;

#assets-modal {
    box-shadow: 3px 3px 10px rgba(0 0 0 / 0.5);
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    padding: 3rem;

    display: flex;
    justify-content: center;
    align-items: center;

    .modal-content {
        background: var.$background;
        padding: 4rem;
        border-radius: 1rem;
        position: relative;
        max-height: 80%;
        display: flex;
        flex-direction: column;
    }
    .close {
        position: absolute;
        top: 0;
        right: 0;
        transform: translate(50%, -50%);
        border: var.$ascent-color;
        background-color: var.$very-light-background-color;
        border-radius: 50%;
        width: 3rem;
        height: 3rem;
        display: flex;
        justify-content: center;
        align-items: center;
        color: white;
        font-weight: bold;
        font-size: 1.8rem;
        transition: background-color 0.5s;
        cursor: pointer;
        &:hover {
            background-color: var.$light-ascent-color;
        }
    }
    h2 {
        margin-top: 0;
        color: white;
    }

    .search-bar {
        display: flex;
        input {
            flex: 1;
        }
        button {
            padding: 0 1rem;
        }
    }

    ul {
        display: grid;
        grid-template-columns: repeat(12, 1fr);
        list-style: none;
        gap: 1rem;
        padding: 0;
        overflow: auto;
        flex: 1;

        li {
            grid-column: span 4;
            span {
                width: 100%;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        }
        button {
            display: flex;
            flex-direction: column;
            width: 100%;
            height: 100%;
            align-items: center;
            gap: 1rem;
            padding: 1rem;
            color: white;
            border: none;
            background-color: var.$light-background-color;
            border-radius: 0.5rem;
            cursor: pointer;
            transition: background-color 0.5s;
            &:hover {
                background-color: var.$very-light-background-color;
            }
        }

        img {
            width: 3rem;
            height: 3rem;
        }
    }
}
</style>
