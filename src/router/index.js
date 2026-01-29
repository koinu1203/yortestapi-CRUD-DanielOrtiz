import { createRouter, createWebHistory } from 'vue-router'
import PostsHome from '../views/PostsHome.vue'
import PostDetail from '../views/PostDetail.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'posts-home',
      component: PostsHome,
    },
    {
      path: '/post/:id',
      name: 'post-detail',
      component: PostDetail,
    },
  ],
})

export default router
