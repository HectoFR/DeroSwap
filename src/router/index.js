import { createRouter, createWebHistory } from 'vue-router'
import SwapView from '../views/SwapView.vue'
import PoolView from '../views/PoolView.vue'
import BridgeView from '../views/BridgeView.vue'

const routes = [
  {
    path: '/swap',
    name: 'swap',
    component: SwapView
  },
  {
    path: '/pool',
    name: 'pool',
    component: PoolView
  },
  {
    path: '/bridge',
    name: 'bridge',
    component: BridgeView
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
