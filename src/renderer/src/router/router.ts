// 初始化router.ts

import { createRouter, createWebHistory } from 'vue-router'
import DefaultLayout from '../layout/DefaultLayout.vue'
// Adjust the path as necessary

const routes = [
  {
    path: '/',
    component: DefaultLayout,
    children: [
      {
        path: '',
        component: () => import('../views/welcome/welcomePage.vue') // Adjust the path as necessary
      },
      {
        path: 'dataexport',
        component: () => import('../views/dataExport/dataExportPage.vue')
      },
      {
        path: 'deviceSetup',
        component: () => import('../views/deviceSetup/deviceSetupPage.vue')
      },
      {
        path: 'settings',
        component: () => import('../views/settings/settingsPage.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router