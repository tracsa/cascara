import Vue from 'vue';

import availableRoutes from './dashboard.constants';

export const routes = [
  {
    name: 'inbox',
    path: 'inbox',
    redirect: () => (
      {
        name: 'dashboard',
        query: {
          feed: 'myPendingTasks',
        },
      }
    ),
  },
  {
    name: 'inbox-item',
    path: 'inbox/:id',
    redirect: to => (
      {
        name: 'dashboard',
        query: {
          e: to.params.id,
          feed: 'myPendingTasks',
        },
      }
    ),
  },
  {
    name: 'inbox-item-pid',
    path: 'inbox/:id/:pid',
    redirect: to => (
      {
        name: 'dashboard',
        query: {
          e: to.params.id,
          feed: 'allTasks',
          highlight: to.params.pid,
          q: to.params.pid,
        },
      }
    ),
  },
];

export const inboxRoutes = {
  routes,
};

export default inboxRoutes;
