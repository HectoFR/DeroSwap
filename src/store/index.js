import { createStore } from 'vuex'

// Decode function for hex dump: for bridge
// function decode(hex) {
//   const bytes = [];

//   for (let i = 0; i < hex.length - 1; i += 2)
//     bytes.push(parseInt(hex.substr(i, 2), 16));

//   return String.fromCharCode.apply(String, bytes);
// }

export default createStore({
  state: {
    pairs: [],
    digits: {},
    websocket: null,
    messageHandlers: {},
    currentRequestId: 1,
    connectionState: 0, // 3 = refused, 2 = connected, 1 = waiting authorization, 0 = unknown, -1 = xswd server not running
    address: "",
  },
  getters: {
    assets(state) {
      /**
       * Flatten pairs to get an assets list
       */
      const assets = [];
      const assetsName = [];

      state.pairs.forEach((p) => {
        [p.assets.from.name, p.assets.to.name].forEach((a) => {
          if (!assetsName.includes(a)) {
            assetsName.push(a)
            assets.push({
              name: a,
            })
          }
        });
      })

      return assets;
    },
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
    async start(store) {
      await store.dispatch("openWebSocket");
      await store.dispatch("getAddress");
    },
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
          scid: '0000000000000000000000000000000000000000000000000000000000000001', // keystore scid
          keysstring: ["keystore"],
        }
      }).then((sc) => {
        let keystoreScid = sc.valuesstring[0];
        keystoreScid = "80" + keystoreScid.substring(2, 64);

        const baseKeys = [
          // "k:dex.bridge.erc20", // encoded Ethereum bridge address
          "k:dex.swap.registry", // dex registry address
          // "k:dex.bridge.registry", // reverse bridge registry 
        ];
        
        return store.dispatch("sendRpcAndWait", {
          method: "DERO.GetSC",
          params: {
            scid: keystoreScid,
            keysstring: baseKeys,
          }
        }).then((keystores) => {
          // store.state.ercBridgeKey = decode(keystores.valuesstring[0]); // Utility of decode ?
          // store.state.swapKey = keystores.valuesstring[1];
          store.state.swapKey = keystores.valuesstring[0];
          // store.state.bridgeKey = keystores.valuesstring[2];
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
        // Pairs starts with p:
        store.state.pairs = Object.entries(result.stringkeys)
          .filter(([key]) => key.startsWith("p:"))
          .map(([key, value]) => {
            const [name1, name2] = key.substring(2).split(":");
            return {
              contract: String(value),
              assets: {
                from: {
                  name: name1,
                },
                to: {
                  name: name2,
                },
              }
            };
          });
        
        // Digits starts with t: and ends with :d
        const tmpDigits = {};
        Object.entries(result.stringkeys)
        .filter(([key]) => key.startsWith("t:") && key.endsWith(":d"))
        .forEach(([key, value]) => {
          const assetName = key.split(":")[1];
          tmpDigits[assetName] = value;
        });
        store.state.digits = tmpDigits;

        // Balances?
        store.state.pairs.map((p) => {
          const params = {
            scid: p.contract,
            code: false,
            variables: true,
          };
          return store.dispatch(
            "sendRpcAndWait",
            { method: "DERO.GetSC", params}
          ).then((t) => {
            const sk = t.stringkeys;
            p.assets.from.realValue = sk.val1 / Math.pow(10, store.state.digits[p.assets.from.name]);
            p.assets.to.realValue = sk.val2 / Math.pow(10, store.state.digits[p.assets.to.name]);
            p.fees = sk.fee;
          })
        })
        return store.state.pairs;
      })
    },
    getAddress(store) {
      return store.dispatch("sendRpcAndWait", { method: "GetAddress" }).then((res) => {
        if (res?.address) {
          store.state.address = res.address;
        }
      })
    }
  },
})
