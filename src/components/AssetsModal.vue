<template>
    <dialog
        id="assets-modal"
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
                ...this.$store.getters.assets,
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
    .search-bar {
        display: flex;
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

        // button {
        //     padding: 0 1rem;
        // }
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
