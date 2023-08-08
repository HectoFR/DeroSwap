<template>
    <div>
        <div class="search-bar">
            <input placeholder="Filter pairs..." v-model="searchText" />
            <button>
                <i class="fa fa-search" />
            </button>
        </div>
        <table>
            <thead>
                <tr>
                    <th>Pair</th>
                    <th>Rate</th>
                    <th colspan="2">Liquidities</th>
                    <th>Shares</th>
                    <th>Fees</th>
                </tr>
            </thead>
            <tbody>
                <tr
                    v-for="pair in filteredPairs" :key="pair.id"
                    @click="$emit('select', pair)"
                >
                    <td class="coins">
                        <div>
                            <img :src="pair.assets.from.img" :alt="`${pair.assets.from.name} img`">
                            <img :src="pair.assets.to.img" :alt="`${pair.assets.to.name} img`">
                        </div>
                        {{ pair.assets.from.name }}:{{ pair.assets.to.name }}
                    </td>
                    <td>1 {{ pair.assets.from.name }} &asymp; 12345 {{ pair.assets.to.name }}</td>
                    <td class="from">
                        <div>
                            <img :src="pair.assets.from.img" :alt="`${pair.assets.from.name} img`">
                            1234.53646
                        </div>
                    </td>
                    <td class="to">
                        <div>
                            <img :src="pair.assets.to.img" :alt="`${pair.assets.to.name} img`">
                            1234.53646
                        </div>
                    </td>
                    <td>0.0 %</td>
                    <td>0.5 %</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
  
<script>
export default {
    name: 'PoolArray',
    data() {
        return {
            searchText: "",
            // pairs: [
            //     {
            //         id: 1,
            //         assets: {
            //             to: this.$store.state.assets[0],
            //             from: this.$store.state.assets[1],
            //         }
            //     },
            //     {
            //         id: 2,
            //         assets: {
            //             to: this.$store.state.assets[3],
            //             from: this.$store.state.assets[4],
            //         }
            //     },
            //     {
            //         id: 2,
            //         assets: {
            //             to: this.$store.state.assets[3],
            //             from: this.$store.state.assets[4],
            //         }
            //     },
            //     {
            //         id: 2,
            //         assets: {
            //             to: this.$store.state.assets[3],
            //             from: this.$store.state.assets[4],
            //         }
            //     },
            //     {
            //         id: 2,
            //         assets: {
            //             to: this.$store.state.assets[3],
            //             from: this.$store.state.assets[4],
            //         }
            //     },
            //     {
            //         id: 2,
            //         assets: {
            //             to: this.$store.state.assets[3],
            //             from: this.$store.state.assets[4],
            //         }
            //     },
            //     {
            //         id: 1,
            //         assets: {
            //             to: this.$store.state.assets[0],
            //             from: this.$store.state.assets[1],
            //         }
            //     },
            //     {
            //         id: 2,
            //         assets: {
            //             to: this.$store.state.assets[3],
            //             from: this.$store.state.assets[4],
            //         }
            //     },
            //     {
            //         id: 2,
            //         assets: {
            //             to: this.$store.state.assets[3],
            //             from: this.$store.state.assets[4],
            //         }
            //     },
            //     {
            //         id: 2,
            //         assets: {
            //             to: this.$store.state.assets[3],
            //             from: this.$store.state.assets[4],
            //         }
            //     },
            //     {
            //         id: 2,
            //         assets: {
            //             to: this.$store.state.assets[3],
            //             from: this.$store.state.assets[4],
            //         }
            //     },
            //     {
            //         id: 2,
            //         assets: {
            //             to: this.$store.state.assets[3],
            //             from: this.$store.state.assets[4],
            //         }
            //     },
            //     {
            //         id: 1,
            //         assets: {
            //             to: this.$store.state.assets[0],
            //             from: this.$store.state.assets[1],
            //         }
            //     },
            // ],
        }
    },
    computed: {
        pairs() {
            return this.$store.getters.pairs;
        },
        filteredPairs() {
            return this.pairs.filter((p) => {
                const toLower = p.assets.to.name.toLowerCase();
                const fromLower = p.assets.from.name.toLowerCase();
                const searchLower = this.searchText.toLowerCase();

                return toLower.includes(searchLower) || fromLower.includes(searchLower);
            })
        }
    }
}
</script>
  