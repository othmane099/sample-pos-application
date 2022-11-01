import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Dashboard',
      component: () => import('../components/DashboardComponent.vue')
    },
    {
      path: '/products/create',
      name: 'ProductCreate',
      component: () => import('../components/ProductCreateComponent.vue')
    },
    {
      path: '/products/index',
      name: 'ProductIndex',
      component: () => import('../components/ProductIndexComponent.vue')
    },
    {
      path: '/products/edit',
      name: 'ProductEdit',
      component: () => import('../components/ProductCreateComponent.vue'),
      props: true
    },
    {
      path: '/products/show',
      name: 'ProductShow',
      component: () => import('../components/ProductShowComponent.vue'),
      props: true
    },
    {
      path: '/categories/index',
      name: 'CategoryIndex',
      component: () => import('../components/CategoryIndexComponent.vue')
    },
    {
      path: '/sales/create',
      name: 'SaleCreate',
      component: () => import('../components/SaleCreateComponent.vue')
    },
    {
      path: '/sales/index',
      name: 'SaleIndex',
      component: () => import('../components/SaleIndexComponent.vue')
    },
    {
      path: '/sales/show',
      name: 'SaleShow',
      component: () => import('../components/SaleShowComponent.vue'),
      props: true
    },
    {
      path: '/users/index',
      name: 'UserIndex',
      component: () => import('../components/UserIndexComponent.vue')
    },
    {
      path: '/customers/index',
      name: 'CustomerIndex',
      component: () => import('../components/CustomerIndexComponent.vue')
    },
  ]
})

export default router
