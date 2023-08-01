<template>
  <div id="assets">
    <AssetsGrid :assets="assets" />
  </div>
</template>

<script>
import AssetsGrid from '@/components/AssetsGrid.vue';

export default {
    name: 'AssetsView',
    components: { AssetsGrid },
    computed: {
        assets() {
            return this.$store.state.assets;
        }
    }
}
</script>

<style lang="scss">
#assets {
  margin: 0 10%;
  ul {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    list-style: none;
    gap: 2rem;
  }

  li {
    grid-column: span 4;
  }

  img {
    width: 8rem;
    height: 8rem;
  }
}
</style>
