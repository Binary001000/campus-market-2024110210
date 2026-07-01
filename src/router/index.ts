import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // 首页
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { title: '首页' },
    },
    // 四类业务页面
    {
      path: '/lost-found',
      name: 'lostFound',
      component: () => import('../views/LostFoundView.vue'),
      meta: { title: '失物招领' },
    },
    {
      path: '/group-buy',
      name: 'groupBuy',
      component: () => import('../views/GroupBuyView.vue'),
      meta: { title: '拼单搭子' },
    },
    {
      path: '/errand',
      name: 'errand',
      component: () => import('../views/ErrandView.vue'),
      meta: { title: '跑腿委托' },
    },
    // 功能页面
    {
      path: '/publish',
      name: 'publish',
      component: () => import('../views/PublishView.vue'),
      meta: { title: '发布信息' },
    },
    {
      path: '/message',
      name: 'message',
      component: () => import('../views/MessageView.vue'),
      meta: { title: '消息中心' },
    },
    {
      path: '/user',
      name: 'user',
      component: () => import('../views/UserCenterView.vue'),
      meta: { title: '个人中心' },
    },
    // 二手集市 + 详情页
    {
      path: '/list',
      name: 'list',
      component: () => import('../views/ListView.vue'),
      meta: { title: '二手集市' },
    },
    {
      path: '/detail/:id',
      name: 'detail',
      component: () => import('../views/DetailView.vue'),
      meta: { title: '商品详情' },
    },
    // 数据看板
    {
      path: '/board',
      name: 'board',
      component: () => import('../views/BoardView.vue'),
      meta: { title: '数据看板' },
    },
    // 404 兜底（必须放在最后）
    {
      path: '/:pathMatch(.*)*',
      name: 'notFound',
      component: () => import('../views/NotFoundView.vue'),
      meta: { title: '404' },
    },
  ],
})

export default router
