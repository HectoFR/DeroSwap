<template>
    <div id="toast_container" >
        <div
            class="toast"
            :class="{ small: !toastText, }"
        >
            <LogoLoader
                v-if="loader"
                size="32px"
                @click="loader = !loader"
            />
            <img
                v-else
                class="logo"
                src="/favicon.ico"
                @click="loader = !loader"
            />

            <span v-if="toastText">
                {{ toastText }}
            </span>
        </div>
    </div>
</template>

<script>
import LogoLoader from "@/components/LogoLoader.vue";

export default {
    name: "PermissionToast",
    components: {
        LogoLoader,
    },
    data() {
        return {
            loader: false
        };
    },
    computed: {
        toastText() {
            // eslint-disable-next-line
            if (true) {
                return "";
            }

            const perm = "GetBalance";
            return `Waiting wallet response for "${perm}"`;
        }
    },
}
</script>

<style lang="scss">
@use "@/assets/variables.scss" as var;

#toast_container {
  position: absolute;
  bottom: 3rem;
  left: 0;
  width: 100%;
  margin: 0;
  height: 10px;

  .toast {
    position: absolute;
    bottom: 0;
    display: flex;
    gap: 1rem;
    color: white;
    padding: 1rem;
    border-radius: 2rem;
    align-items: center;
    justify-content: center;
    box-shadow: 0px 0px 1rem var.$ascent-color;
    background: var.$light-background-color;
    border: 1px solid #9592cd;
    z-index: 10;

    &:not(&.small) {
        background: url("@/assets/img/test.svg");
        background-size: cover;
        background-position: 0 23rem;
        min-width: 50%;
        left: 50%;
        transform: translateX(-50%);
    }
    &.small {
        right: 3rem;
    }
  }

  .logo-loader {
    background-color: var.$light-ascent-color !important;
    border-radius: 100%;
  }

  .logo {
    border-radius: 100%;
    width: calc(32px - calc(3px * 2));
    height: calc(32px - calc(3px * 2));
    margin: 3px;
  }
}
</style>