import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import "@/assets/index.scss";
import { VTooltip } from "floating-vue";

import "floating-vue/dist/style.css";

const app = createApp(App)
app.use(store)
app.use(router)
app.directive('tooltip', VTooltip)

app.mount('#app')
