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
                                :src="`/assets/${pair.asset1.name}.png`"
                                :alt="`${pair.asset1.name} img`"
                            >
                            <img
                                :src="`/assets/${pair.asset2.name}.png`"
                                :alt="`${pair.asset2.name} img`"
                            >
                        </div>
                        {{ pair.asset1.name }}:{{ pair.asset2.name }}
                    </td>

                    <td v-if="pair.realVal2 != 0">
                        1 {{ pair.asset1.name }} &asymp;
                        {{ pair.realRatio.toFixed(pair.asset2.digit) }}
                        {{ pair.asset2.name }}
                    </td>
                    <td v-else>
                        No liquidity
                    </td>

                    <td class="from">
                        <div>
                            <img
                                :src="`/assets/${pair.asset1.name}.png`"
                                :alt="`${pair.asset1.name} img`"
                            >
                            {{ pair.realVal1?.toFixed(pair.asset1.digit) }}
                        </div>
                    </td>
                    <td class="to">
                        <div>
                            <img
                                :src="`/assets/${pair.asset2.name}.png`"
                                :alt="`${pair.asset2.name} img`"
                            >
                            {{ pair.realVal2?.toFixed(pair.asset2.digit) }}
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
                const toLower = p.asset2.name.toLowerCase();
                const fromLower = p.asset1.name.toLowerCase();
                const searchLower = this.searchText.toLowerCase();

                return toLower.includes(searchLower) || fromLower.includes(searchLower);
            })
        }
    }
}
</script>
  