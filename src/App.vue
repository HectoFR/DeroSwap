<template>
  <div
    id="connecting"
    v-if="connectionState !== 2"
  >
    <div class="content">
      <h1>DeroSwap</h1>
      <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sunt nesciunt natus cumque, quas facere perspiciatis? Quis non maiores praesentium voluptates, placeat aut impedit, exercitationem soluta quo, delectus iste officiis officia.</p>
    
      <div 
        class="auth-pending"
        v-if="connectionState === 1"
      >
        Waiting for the wallet authorization...
      </div>
      <div
        v-else-if="connectionState === -1 || connectionState === 3"
        class="how-to"
      >
        <div v-if="connectionState === -1">
          Start the XSWD Server on your DERO Wallet:
          <ol>
            <li>Open your wallet (cli for example)</li>
            <li>Select "16: Start XSWD Server"</li>
            <li>Click on the button to ask for the authorization</li>
          </ol>
          <p>
            You may have to accept additionnal authorizations for some requests while using this app
            (ex: reading balance).
          </p>
        </div>
        <div
          v-else
          class="refused"
        >
          Authorization refused :(
        </div>
        <div class="view-submit-button">
          <button
            type="submit"
            @click="$store.dispatch('openWebSocket')"
          >
            Ask authorization
          </button>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
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
  },
  data() {
    return {
      authorizationPending: false,
    };
  },
  computed: {
    connectionState() {
      return this.$store.state.connectionState;
    }
  },
  mounted() {
    this.$store.dispatch("openWebSocket");
  },
  methods: {
  }
}
</script>

<style lang="scss">
@use "@/assets/variables.scss" as var;

$ascent-color: #392fa5;
$light-ascent-color: lighten(#392fa5, 20%);

$light-background-color: #13295b;
$very-light-background-color: lighten(#13295b, 20%);

@keyframes color-change {
  0% { color: var.$ascent-color; }
  50% { color: var.$light-ascent-color; }
  100% { color: var.$ascent-color; }
}

#connecting {
  display: flex;
  align-items: center;
  justify-content: center;

  background: url("@/assets/img/bg_modal.svg");
  background-color: var.$background;
  background-size: cover;
  background-repeat: no-repeat;
  font-size: 2rem;

  .content {
    width: 75%;
    height: 75%;
    border-radius: 1rem;
    background-color: var.$background;
    border: 1px solid white;
    color: white;
    padding: 3rem 10rem;
    box-shadow: 0 1rem 5rem 0 rgba(var.$white, 0.2);
    overflow: auto;

    // Gérer le responsive
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  h1 {
    margin: 0 0 3rem 0;
    text-align: center;
    font-size: 5rem;
  }

  .how-to {
    margin: 4rem 0;
    ol {
      width: fit-content;
      margin: 4rem auto;
      li {
        margin: 0.5rem 0;
      }
    }
  }
  .refused {
    color: var.$red;
    text-align: center;
    font-size: 3rem;
    font-weight: bold;
  }

  .view-submit-button {
    margin-top: 5rem;
    button {
      font-size: 1.5rem;
      padding: 2rem 1rem;
      width: 35%;
    }
  }

  .auth-pending {
    margin: 2rem 0;
    text-align: center;
    font-size: 3rem;
    font-weight: bold;

    animation-name: color-change;
    animation-duration: 2s;
    animation-iteration-count: infinite;
  }
}
</style>
