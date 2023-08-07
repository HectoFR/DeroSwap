<template>
  <div>
    <aside>
      <AssetsList  class="top"/>
      <div class="bottom">
        <div class="states">
          <span>✔ Daemon</span>
          <span>⨉ Wallet</span>
        </div>
        <div class="address">bc1qxy2kgdygjrs...rf2493pkkfjhx0wlh</div>
        <!-- <router-link
          class="see-more"
          :to="{name: 'assets'}"
        >
          See more assets
        </router-link> -->
      </div>
    </aside>
    <section>
      <header>
        <nav>
          <ul>
            <li>
              <router-link :to="{ name: 'swap', }">Swap</router-link>
            </li>
            <li>
              <router-link :to="{ name: 'pool', }">Pool</router-link>
            </li>
            <!-- <li>
              <router-link :to="{ name: 'bridge', }">Bridge</router-link>
            </li> -->
          </ul>
        </nav>
      </header>
      <main>
        <router-view v-slot="{ Component }">
          <transition name="fade">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </section>
    <footer>

    </footer>
  </div>
</template>

<script>
import AssetsList from "@/components/AssetsList.vue";

export default {
  name: "App",
  components: {
    AssetsList,
  }
}
</script>

<style lang="scss">
</style>
