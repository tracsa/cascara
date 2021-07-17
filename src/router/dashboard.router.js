import Vue from 'vue';

import availableRoutes from './routes.constants';

export const routes = [
  {
    name: 'dashboard',
    path: 'dashboard',
    component: Vue.component('app-inbox'),
    beforeEnter: (to, from, next) => {
      if (!availableRoutes.map(x => x.feed).includes(to.query.feed)) {
        next({
          name: 'dashboard',
          query: {
            ...to.query,
            feed: availableRoutes[0].feed,
          },
        });
      } else {
        next();
      }
    },
    props: (to) => {
      const actualRoute = availableRoutes.find(x => x.feed === to.query.feed);

      const actualProp = {
        executionId: to.query.e,
        query: to.query.q,
        fixedPayload: {},
      };

      if (to.query.nu) {
        actualProp.notified = (to.query.nu || '').split(',') || null;
      }
      if (to.query.au) {
        actualProp.actored = (to.query.au || '').split(',') || null;
      }

      [
        'feed',
        'title',
        'description',
      ].forEach((k) => {
        if (typeof actualRoute[k] === 'function') {
          actualProp[k] = actualRoute[k](to);
        } else {
          actualProp[k] = actualRoute[k];
        }
      });

      Object.keys(actualRoute.fixedPayload).forEach((k) => {
        if (typeof actualRoute.fixedPayload[k] === 'function') {
          actualProp.fixedPayload[k] = actualRoute.fixedPayload[k](to);
        } else {
          actualProp.fixedPayload[k] = actualRoute.fixedPayload[k];
        }
      });

      return actualProp;
    },
  },
];

export const dashboardRoutes = {
  routes,
};

export default dashboardRoutes;
