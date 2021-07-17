import Vue from 'vue';
import Router from 'vue-router';
import { requireAuth, requireAnon } from '../utils/auth';
import { dashboardRoutes } from './dashboard.router';
import { inboxRoutes } from './inbox.router';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      beforeEnter: requireAuth,
      component: Vue.component('app'),
      children: [
        ...dashboardRoutes.routes,
        ...inboxRoutes.routes,
        {
          name: 'history',
          path: 'history',
          redirect: () => (
            {
              name: 'dashboard',
              query: {
                feed: 'executionHistory',
              },
            }
          ),
        },
        {
          name: 'processes',
          path: 'process',
          component: Vue.component('app-processes'),
        },
        {
          name: 'process',
          path: 'process/:id',
          component: Vue.component('app-processes'),
        },
        {
          name: 'task-redirect',
          path: 'task/:id',
          redirect: to => (
            {
              name: 'dashboard',
              query: {
                feed: 'myPendingTasks',
                highlight: to.params.id,
                q: to.params.id,
              },
            }
          ),
        },
        {
          name: 'default',
          path: '',
          redirect: 'dashboard',
        },
      ],
    },
    {
      path: '/signin',
      beforeEnter: requireAnon,
      component: Vue.component('sign-in'),
    },
  ],
});
