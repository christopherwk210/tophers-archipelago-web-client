import { createRouter, createWebHashHistory } from 'vue-router';
import Login from './views/Login.vue';
import Connected from './views/Connected.vue';

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/connected',
      name: 'Connected',
      component: Connected
    }
  ],
});

export default router;
