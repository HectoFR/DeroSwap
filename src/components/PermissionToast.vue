<template>
    <div id="toast_container" >
        <div
            class="toast"
            :class="{ small: !toastText, }"
        >
            <LogoLoader
                v-if="toastText"
                size="32px"
            />
            <img
                v-else
                class="logo"
                src="/favicon.ico"
            />

            <span>
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
            loader: false,
        };
    },
    computed: {
        toastText() {
            if (!this.firstPendingPerm) {
                return "";
            }
            return `Waiting wallet response for "${this.firstPendingPerm}"`;
        },
        firstPendingPerm() {
            const perms = Object.values(this.$store.state.pendingRequestsPerms);
            return perms.length ? perms[0] : null;
        }
    },
    methods: {
        test() {
            if (this.perm) {
                this.perm = null;
            } else {
                this.perm = "GetBalance";
            }
        }
    }
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
    color: white;
    padding: 1rem;
    border-radius: 2rem;
    align-items: center;
    justify-content: center;
    box-shadow: 0px 0px 1rem var.$ascent-color;
    background: var.$light-background-color;
    border: 1px solid #9592cd;
    z-index: 10;
    width: 50%;
    white-space: nowrap;

    span {
        width: 0;
        overflow: hidden;
        margin-left: 1rem;
    }

    &:not(&.small) {
        background: url("@/assets/img/test.svg");
        background-size: cover;
        background-position: 0 23rem;
        right: 50%;
        transform: translateX(50%);

        transition: right 0.5s linear, width 0.3s linear 0.7s;
        span {
            transition: width 0.5s linear 0.7s, margin-left 0.1s linear 0.7s;
        }

        span {
            width: fit-content;
        }
    }
    &.small {
        right: 6rem;
        width: 53px;
        transform: translateX(50%);

        transition: right 0.5s linear 0.5s, width 0.3s linear;
        span {
            transition: width 0.5s linear, margin-left 0.1s linear;
        }

        span {
            margin-left: 0;
        }
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