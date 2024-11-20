import { useUserStore } from '@/stores/userStore'
import { useCookie } from '@/utils/useCookie'
import Create from '@/views/Create.vue'

import { createRouter, createWebHistory } from 'vue-router'
// Page components
import Dashboard from '@/views/Dashboard.vue'
import List from '@/views/List.vue'
import ListRoutes from '@/views/ListRoutes.vue'
import Login from '@/views/Login.vue'

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { auth: true, layout: 'dashboard' }
  },
  {
    path: '/models/:model',
    name: 'model-list',
    component: List,
    meta: {
      layout: 'dashboard'
    }
  },
  {
    path: '/models/:model/create',
    name: 'model-create',
    component: Create,
    meta: {
      layout: 'dashboard'
    }
  },
  {
    path: '/routes',
    name: 'routes',
    component: ListRoutes,
    meta: { layout: 'dashboard' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  const { get: getCookie } = useCookie()
  const token = getCookie('token')

  // Check if the route requires authentication
  const auth = to.matched.some(record => record.meta.auth)
  // If token exists but user is not loaded, try to load user data
  if (token && !userStore.user) {
    try {
      // You would typically make an API call here to get user data
      await userStore.loadUser()
    }
    catch (error) {
      console.error('Failed to load user:', error)
      userStore.clearUser()
    }
  }

  if (auth && !userStore.isAuthenticated) {
    // Redirect to login if trying to access protected route without authentication
    next({ name: 'Login', query: { redirect: to.fullPath } })
  }
  else if (to.name === 'Login' && userStore.isAuthenticated) {
    // Redirect to dashboard if trying to access login while authenticated
    next({ name: 'Dashboard' })
  }
  else {
    next()
  }
})

export default router
