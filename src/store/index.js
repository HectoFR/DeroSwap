import { createStore } from 'vuex'

// Decode function for hex dump
function decode(hex) {
  var bytes = [];

  for (var i = 0; i < hex.length - 1; i += 2)
    bytes.push(parseInt(hex.substr(i, 2), 16));

  return String.fromCharCode.apply(String, bytes);
}

const TOKEN_IMGS = {
  DWETH: "https://cryptologos.cc/logos/ethereum-eth-logo.png?v=023",
  COCO: "https://seeklogo.com/images/C/cocos-blockchain-expedition-cocos-bcx-logo-A0123AFFED-seeklogo.com.png",
  DZRX: "https://cryptologos.cc/logos/0x-zrx-logo.png?v=023",
  DUSDT: "https://cryptologos.cc/logos/tether-usdt-logo.png?v=023",
  DDAI: "https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png?v=023",
  DLINK: "https://cryptologos.cc/logos/chainlink-link-logo.png?v=023",
  DUSDC: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=023",
  DWBTC: "https://cryptologos.cc/logos/wrapped-bitcoin-wbtc-logo.png?v=023",
  DFRAX: "https://cryptologos.cc/logos/frax-frax-logo.png?v=023",
  DgOHM: "https://imgs.search.brave.com/mS-KF2LDb6WXaSTQH7-MbxmuDuEnkwGwNkpgAOEUUsg/rs:fit:40:40:1/g:ce/aHR0cHM6Ly9hc3Nl/dHMuY29pbmdlY2tv/LmNvbS9jb2lucy9p/bWFnZXMvMjExMjkv/bGFyZ2UvdG9rZW5f/d3NPSE1fbG9nby5w/bmc_MTYzODc2NDkw/MA",
  DERO: "https://imgs.search.brave.com/ZDVXj_uLx1b3331Xfw_wDUWNQYTnf7MCgePV2Ry1u00/rs:fit:40:40:1/g:ce/aHR0cHM6Ly9hc3Nl/dHMuY29pbmdlY2tv/LmNvbS9jb2lucy9p/bWFnZXMvMzUyMi9s/YXJnZS9kZXJvX2xv/Z29fcG5nLnBuZz8x/NTgyMTgwMzkw",
  DST: "https://stakingcrypto.info/static/assets/coins/dragon-soul-token-logo.png?v=101",
};

export default createStore({
  state: {
    pairs: [],
    websocket: null,
    messageHandlers: {},
    currentRequestId: 1,
    connectionState: 0, // 3 = refused, 2 = connected, 1 = waiting authorization, 0 = unknown, -1 = xswd server not running
  },
  getters: {
    assets(state) {
      /**
       * Flatten pairs to get an asset list (with img)
       */
      const assets = [];
      const assetsName = [];

      state.pairs.forEach((p) => {
        [p.name1, p.name2].forEach((a) => {
          if (!assetsName.includes(a)) {
            assetsName.push(a)
            assets.push({
              name: a,
              img: TOKEN_IMGS[a],
            })
          }
        });
      })

      return assets;
    },
    pairs(state) {
      /**
       * Format and add img to pairs
       */
      return state.pairs.map((p) => ({
          contract: p.contract,
          assets: {
            from: {
              name: p.name1,
              img: TOKEN_IMGS[p.name1]
            },
            to: {
              name: p.name2,
              img: TOKEN_IMGS[p.name2]
            },
          }
      }));
    }
  },
  mutations: {
    setMessageHandler(state, {key, handler}) {
      state.messageHandlers[key] = handler;
    },
    removeMessageHandler(state, key) {
      delete state.messageHandlers[key];
    }
  },
  actions: {
    openWebSocket(store) {
      return new Promise((resolve) => {
        /**
         * 1. Initiates the WebSocket
         * 2. When opened, asks the authorization
         * 3. Waits for the accept message
         * 4. Resolves
         */
        store.state.websocket = new WebSocket("ws://localhost:44326/xswd");
  
        store.state.websocket.onmessage = (message) => {
          const data = JSON.parse(message.data)
          Object.values(store.state.messageHandlers).forEach((handler) => {
            handler(data)
          });

          if (data.accepted === true) {
            store.state.connectionState = 2;
            resolve()
          } else if (data.accepted === false) {
            store.state.connectionState = 3;
            resolve()
          }
        };
    
        store.state.websocket.onerror = (error) => {
          store.state.connectionState = -1;
          console.error(error);
        };
  
        store.state.websocket.onopen = () => {
          store.dispatch("askAppAuthorization");
          store.state.connectionState = 1;
        };
      })
    },
    askAppAuthorization(store) {
      return store.state.websocket.send(JSON.stringify({
        "id": "ed606a2f4c4f499618a78ff5f7c8e51cd2ca4d8bfa7e2b41a27754bb78b1df1f",
        "name": "DEROSwap",
        "description": "DEROSwap allows you to easily swap any token on DERO chain",
        "url": "https://deroswap.io",
      }))
    },
    sendRpc(store, { method, id, params }) {
      return store.state.websocket.send(JSON.stringify({
        jsonrpc: "2.0",
        id,
        method,
        params,
      }))
    },
    sendRpcAndWait(store, { method, params }) {
      /**
       * Create a promise where we add a message handler, then send a request and resolve the promise only when a
       * message with the same id is received, then remove the message handler
       */
      const currentId = store.state.currentRequestId;
      const keyHandler = `req${currentId}`

      return new Promise((resolve) => {
        store.commit("setMessageHandler", {
            key: keyHandler,
            handler(message) {
              if (message.id == currentId) {
                resolve(message.result);
                store.commit("removeMessageHandler", keyHandler);
              }
            }
        });
        store.dispatch("sendRpc", {
          method,
          id: currentId,
          params,
        });
        store.state.currentRequestId += 1;
      });
    },
    getMainScid(store) {
      /**
       * Get the three keys for dex.bridge.erc20, dex.swap.registry and dex.bridge.registry
       * Used to get the swap pairs, for example.
       */
      return store.dispatch("sendRpcAndWait", {
        method: "DERO.GetSC",
        params: {
          scid: '0000000000000000000000000000000000000000000000000000000000000001',
          keysstring: ["keystore"],
        }
      }).then((sc) => {
        let keystoreScid = sc.valuesstring[0];
        keystoreScid = "80" + keystoreScid.substring(2, 64);

        const baseKeys = [
          "k:dex.bridge.erc20", // encoded Ethereum bridge address
          "k:dex.swap.registry", // dex registry address
          "k:dex.bridge.registry", // reverse bridge registry 
        ];
        
        return store.dispatch("sendRpcAndWait", {
          method: "DERO.GetSC",
          params: {
            scid: keystoreScid,
            keysstring: baseKeys,
          }
        }).then((keystores) => {
          store.state.ercBridgeKey = decode(keystores.valuesstring[0]); // Utility of decode ?
          store.state.swapKey = keystores.valuesstring[1];
          store.state.bridgeKey = keystores.valuesstring[2];
          return true;
        })
      })
    },
    async getSwapPairs(store) {
      /**
       * Get and save the pairs from dex.swap.registry
       */

      let scid = store.state.swapKey;

      // We need the dex.swap.registry to retrieve swap pairs
      if (!scid) {
        await store.dispatch("getMainScid");
        scid = store.state.swapKey;
      }
      
      return store.dispatch("sendRpcAndWait", {
        method: "DERO.GetSC",
        params: {
          scid,
          code: false,
          variables: true,
        }
      }).then((result) => {
        // This request returns a lot of informations, we only need variable starting with "p:"
        store.state.pairs = Object.entries(result.stringkeys)
          .filter((entry) => entry[0].startsWith("p:"))
          .map((entry) => {
            const [key, value] = entry;
            const [name1, name2] = key.substring(2).split(":");

            return { name1, name2, contract: String(value) };
          });
        return store.state.pairs;
      })
    },
  },
})
