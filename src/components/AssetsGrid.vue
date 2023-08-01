<template>
    <ul class="asset-grid">
        <li v-for="asset in assets" :key="asset.name">
            <button @click="$emit('select', asset)">
                <img :src="asset.img" :alt="`${asset.name} image`">
                <span>{{ asset.name }}</span>
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
    grid-template-columns: repeat(12, 1fr);
    list-style: none;

    gap: 1rem;
    
    li {
        grid-column: span 4;

        span {
            width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    }

    img {
        width: 3rem;
        height: 3rem;
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
}
</style>