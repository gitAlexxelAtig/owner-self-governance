import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

const routes = [
  {
    path: '/',
    name: 'Landing',
    component: () => import('@/views/home/Landing.vue'),
    meta: { public: true }
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/views/home/Home.vue'),
    meta: { requiresAuth: true, requiresPayment: true }
  },
  {
    path: '/auth/login',
    name: 'Login',
    component: () => import('@/views/auth/Login.vue'),
    meta: { public: true }
  },
  {
    path: '/auth/phone',
    name: 'BindPhone',
    component: () => import('@/views/auth/BindPhone.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/community/select',
    name: 'SelectCommunity',
    component: () => import('@/views/auth/SelectCommunity.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/community/create',
    name: 'CreateCommunity',
    component: () => import('@/views/auth/CreateCommunity.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/owner/verify',
    name: 'OwnerVerify',
    component: () => import('@/views/auth/OwnerVerify.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/owner/status',
    name: 'VerifyStatus',
    component: () => import('@/views/auth/VerifyStatus.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/payment',
    name: 'Payment',
    component: () => import('@/views/auth/Payment.vue'),
    meta: { requiresAuth: true, requiresVerify: true }
  },
  {
    path: '/law',
    name: 'LawIndex',
    component: () => import('@/views/law/Index.vue'),
    meta: { requiresAuth: true, requiresPayment: true }
  },
  {
    path: '/law/detail/:id',
    name: 'LawDetail',
    component: () => import('@/views/law/Detail.vue'),
    meta: { requiresAuth: true, requiresPayment: true }
  },
  {
    path: '/law/scenario/:id',
    name: 'LawScenario',
    component: () => import('@/views/law/Scenario.vue'),
    meta: { requiresAuth: true, requiresPayment: true }
  },
  {
    path: '/vote',
    name: 'VoteIndex',
    component: () => import('@/views/vote/Index.vue'),
    meta: { requiresAuth: true, requiresPayment: true }
  },
  {
    path: '/vote/create',
    name: 'VoteCreate',
    component: () => import('@/views/vote/Create.vue'),
    meta: { requiresAuth: true, requiresPayment: true }
  },
  {
    path: '/vote/detail/:id',
    name: 'VoteDetail',
    component: () => import('@/views/vote/Detail.vue'),
    meta: { requiresAuth: true, requiresPayment: true }
  },
  {
    path: '/vote/result/:id',
    name: 'VoteResult',
    component: () => import('@/views/vote/Result.vue'),
    meta: { requiresAuth: true, requiresPayment: true }
  },
  {
    path: '/forum',
    name: 'ForumIndex',
    component: () => import('@/views/forum/Index.vue'),
    meta: { requiresAuth: true, requiresPayment: true }
  },
  {
    path: '/forum/create',
    name: 'ForumCreate',
    component: () => import('@/views/forum/Create.vue'),
    meta: { requiresAuth: true, requiresPayment: true }
  },
  {
    path: '/forum/detail/:id',
    name: 'ForumDetail',
    component: () => import('@/views/forum/Detail.vue'),
    meta: { requiresAuth: true, requiresPayment: true }
  },
  {
    path: '/contact',
    name: 'Contact',
    component: () => import('@/views/forum/Contact.vue'),
    meta: { requiresAuth: true, requiresPayment: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/profile/Index.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/profile/payments',
    name: 'PaymentHistory',
    component: () => import('@/views/profile/Payments.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/profile/communities',
    name: 'MyCommunities',
    component: () => import('@/views/profile/Communities.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  
  // 公开页面直接通过
  if (to.meta.public) {
    next()
    return
  }
  
  // 检查登录
  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    next('/auth/login')
    return
  }
  
  // 检查是否选择小区
  if (to.meta.requiresPayment && !userStore.currentCommunity) {
    next('/community/select')
    return
  }
  
  // 检查是否认证
  if (to.meta.requiresPayment && userStore.ownerStatus !== 'verified') {
    next('/owner/verify')
    return
  }
  
  // 检查是否缴费
  if (to.meta.requiresPayment && !userStore.isPaid) {
    next('/payment')
    return
  }
  
  next()
})

export default router
