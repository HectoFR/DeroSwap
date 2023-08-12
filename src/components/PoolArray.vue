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
                    v-for="pair in filteredPairs" :key="pair.contract"
                    @click="$emit('select', pair)"
                >
                    <td class="coins">
                        <div>
                            <img
                                :src="`/assets/${pair.assets.from}.png`"
                                :alt="`${pair.assets.from} img`"
                            >
                            <img
                                :src="`/assets/${pair.assets.to}.png`"
                                :alt="`${pair.assets.to} img`"
                            >
                        </div>
                        {{ pair.assets.from }}:{{ pair.assets.to }}
                    </td>

                    <td v-if="pair.toRealValue != 0">
                        1 {{ pair.assets.from }} &asymp;
                        {{(
                                pair.toRealValue / pair.fromRealValue).toFixed(
                                assets[pair.assets.to].digit
                        )}}
                        {{ pair.assets.to }}
                    </td>
                    <td v-else>
                        No liquidity
                    </td>

                    <td class="from">
                        <div>
                            <img
                                :src="`/assets/${pair.assets.from}.png`"
                                :alt="`${pair.assets.from} img`"
                            >
                            {{ pair.assets.fromRealValue?.toFixed(assets[pair.assets.from].digit) }}
                        </div>
                    </td>
                    <td class="to">
                        <div>
                            <img
                                :src="`/assets/${pair.assets.to}.png`"
                                :alt="`${pair.assets.to} img`"
                            >
                            {{ pair.toRealValue?.toFixed(assets[pair.assets.to].digit) }}
                        </div>
                    </td>
                    <td>0.0 %<!-- TODO --></td>
                    <td>{{ pair.fees/100 }} %</td>
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
        }
    },
    computed: {
        pairs() {
            return this.$store.state.pairs;
        },
        assets() {
            return this.$store.state.assets;
        },
        filteredPairs() {
            return this.pairs.filter((p) => {
                const toLower = p.assets.to.toLowerCase();
                const fromLower = p.assets.from.toLowerCase();
                const searchLower = this.searchText.toLowerCase();

                return toLower.includes(searchLower) || fromLower.includes(searchLower);
            })
        }
    }
}
</script>
  