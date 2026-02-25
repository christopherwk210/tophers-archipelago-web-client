import { createRouter, createWebHashHistory } from 'vue-router';
import Login from '@/views/Login.vue';
import Connected from '@/views/Connected.vue';
import { client } from '@/lib/archipelago';
import { settings } from '@/state/settings';
import { AppStorage } from '@/lib/storage';

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
      component: Connected,
      beforeEnter: (to, from) => {
        // Prevent unauthenticated users from seeing the business
        if (client.authenticated) return true;

        if (!settings.value.generalAutoReconnect) {
          return '/';
        } else {
          const url = AppStorage.get('url');
          const slot = AppStorage.get('slot');
          const password = AppStorage.get('password');

          return { name: 'Login', query: { url, slot, password } };
        }
      }
    }
  ]
});

export default router;
