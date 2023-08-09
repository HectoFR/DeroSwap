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
            <li>Open your wallet (cli for example) in remote mode</li>
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
            @click="$store.dispatch('start')"
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
          <span v-if="false">✔ Daemon</span>
          <span><i class="fa fa-check" /> Wallet</span>
        </div>
        <div class="address">{{ shortAddress }}</div>
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
    },
    shortAddress() {
      const fullAddress = this.$store.state.address;

      if (!fullAddress) {
        return "Connecting..."
      }
      
      let address = fullAddress.substring(0, 15);
      address += "..."
      address += fullAddress.substring(fullAddress.length-15, fullAddress.length);

      return address
    }
  },
  mounted() {
    this.$store.dispatch("start");
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
  justify-content: center;
  align-items: center;

  background: url("@/assets/img/bg_modal.svg");
  background-color: var.$background;
  background-size: cover;
  background-repeat: no-repeat;
  font-size: 2rem;

  .content {
    overflow: auto;

    // Gérer le responsive
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 3rem 10rem;
    width: 75%;
    height: 75%;
    background-color: var.$background;
    border-radius: 1rem;
    border: 1px solid white;
    color: white;
    box-shadow: 0 1rem 5rem 0 rgba(var.$white, 0.2);
  }
  h1 {
    margin: 0 0 3rem 0;
    font-size: 5rem;
    text-align: center;
  }

  .how-to {
    margin: 4rem 0;
    ol {
      margin: 4rem auto;
      width: fit-content;
      li {
        margin: 0.5rem 0;
      }
    }
  }
  .refused {
    font-size: 3rem;
    font-weight: bold;
    text-align: center;
    color: var.$red;
  }

  .view-submit-button {
    margin-top: 5rem;
    button {
      padding: 2rem 1rem;
      width: 35%;
      font-size: 1.5rem;
    }
  }

  .auth-pending {
    margin: 2rem 0;
    font-size: 3rem;
    font-weight: bold;
    text-align: center;

    animation-name: color-change;
    animation-duration: 2s;
    animation-iteration-count: infinite;
  }
}
</style>
