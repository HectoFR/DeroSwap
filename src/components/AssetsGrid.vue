<template>
    <ul class="asset-grid">
        <li v-for="asset in assets" :key="asset.name">
            <button @click="$emit('select', asset)">
                <img
                    :src="`/assets/${asset.name}.png`"
                    :alt="`${asset.name} image`"
                >
                <span>{{ asset.name }}</span>
                <i
                    class="fa fa-info"
                    @click.stop=""
                    v-tooltip="{
                        content: asset.scid,
                        triggers: ['hover', 'click'],
                    }"
                />
            </button>
        </li>
    </ul>
</template>

<script >
export default {
    name: "AssetGrid",
    props: {
        assets: Array,
    },
}
</script>

<style lang="scss">
@use "@/assets/variables.scss" as var;

.asset-grid {
    display: grid;

    gap: 1rem;
    grid-template-columns: repeat(12, 1fr);
    list-style: none;

    li {
        grid-column: span 4;
        position: relative;

        span {
            overflow: hidden;
            width: 100%;
            text-overflow: ellipsis;
        }
    }

    img {
        width: 3rem;
        height: 3rem;
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

    .fa-info {
        position: absolute;
        top: 0;
        right: 0;
        z-index: 99;
        padding: 1rem;
    }
}
</style>