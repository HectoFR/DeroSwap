<template>
    <dialog
        id="confirmation-modal"
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
            <h2>{{operation}} - Confirm the operation</h2>
            <div class="center">
                <div class="from">
                    <h3>
                        <img :src="`/assets/${assetFrom.name}.png`" />
                        {{ assetFrom.name }}
                    </h3>
                    <div>1100</div>
                    <div>
                        Balance: <del>3254</del> <i class="fa fa-arrow-right" /> 2154
                    </div>
                </div>
                <i class="fa fa-arrow-down" />
                <div class="to">
                    <h3>
                        <img :src="`/assets/${assetTo.name}.png`" />
                        {{ assetTo.name }}
                    </h3>
                    <div>200</div>
                    <div>
                        Balance: <del>0</del> <i class="fa fa-arrow-right" /> 200
                    </div>
                </div>
                <div class="view-submit-button">
                    <button
                        type="submit"
                        @click="$emit('submit')"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    </dialog>
</template>

<script>
export default {
    name: 'AssetsModal',
    components: {
    },
    props: {
        assetFrom: Object,
        assetTo: Object,
        amountFrom: Number,
        operation: String,
    },
    data() {
        return {
            searchText: ""
        }
    },
    computed: {

    }
}
</script>

<style lang="scss">
@use "@/assets/variables.scss" as var;

.center {
    display: flex;
    flex-direction: column;
    align-items: center;
}

#confirmation-modal {
    font-size: 2rem;
    .modal-content {
        width: unset;
    }

    h3 {
        display: flex;
        gap: 1rem;
        align-items: center;
        margin: 0;
        font-size: 3rem;
        img {
            width: 3.2rem;
            height: 3.2rem;
        }
    }

    .fa-arrow-down {
        margin: 4rem 0;
        font-size: 3rem;
    }
    .fa-arrow-right {
        font-size: 1.6rem;
    }

    .from, .to {
        display: flex;
        gap: 1rem;
        flex-direction: column;
        align-items: center;
    }

}
</style>
