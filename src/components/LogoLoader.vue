<template>
    <div
        class="logo-loader"
        :style="{
            width: size,
            height: size,
        }"
    >
        <MoonLoader :size="size" />
        <img src="/favicon.ico" />
    </div>
</template>

<script>
import MoonLoader from "vue-spinner/src/MoonLoader.vue";

export default {
    name: "LogoLoader",
    components: {
        MoonLoader,
    },
    props: {
        size: {
            type: String,
            default: "140px",
        }
    }
}
</script>

<style lang="scss">
@use "@/assets/variables.scss" as var;

.logo-loader {
  position: relative;
  .v-moon2 {
    background-color: var.$light-ascent-color !important;
  }
  .v-moon3 {
    border-color: #151339 !important;
    opacity: 1;
  }
  img {
    border-radius: 100%;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    opacity: 75%;
    width: 72%;
    height: 72%;
  }
}
</style>