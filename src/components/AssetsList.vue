<template>
    <div>
        <h2>
            My assets
        </h2>
        <ul>
            <li
                v-for="asset in assets"
                :key="asset.name"
            >   
                <a href="">
                    <img :src="asset.img" :alt="`${asset.name} image`">
                    <span>{{ asset.name }}</span>
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
  