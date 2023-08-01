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
    top: 0;
    left: 0;

    display: flex;
    justify-content: center;
    align-items: center;
    padding: 3rem;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    box-shadow: 3px 3px 10px rgba(0 0 0 / 0.5);

    .modal-content {
        position: relative;
        display: flex;
        flex-direction: column;
        padding: 4rem;
        max-height: 80%;
        background: var.$background;
        border-radius: 1rem;
    }

    .close {
        position: absolute;
        top: 0;
        right: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 3rem;
        height: 3rem;
        background-color: var.$very-light-background-color;
        font-size: 1.8rem;
        font-weight: bold;
        transform: translate(50%, -50%);
        border: var.$ascent-color;
        border-radius: 50%;
        color: white;
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
        overflow: auto;
        display: grid;
        gap: 1rem;
        flex: 1;
        padding: 0;
        grid-template-columns: repeat(12, 1fr);
        list-style: none;

        li {
            grid-column: span 4;

            span {
                overflow: hidden;
                width: 100%;
                text-overflow: ellipsis;
            }
        }

        button {
            display: flex;
            gap: 1rem;
            flex-direction: column;
            align-items: center;
            padding: 1rem;
            width: 100%;
            height: 100%;
            background-color: var.$light-background-color;
            color: white;
            border: none;
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
