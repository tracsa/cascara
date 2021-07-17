import Vue from 'vue';

import { availableRoutes } from './dashboard.constants';

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
        executionId: to.query.exe,
        payload: {},
        fixedPayload: {},
      };

      if (to.query.searchText) {
        actualProp.payload.searchText = to.query.searchText;
      }
      if (to.query.objType) {
        actualProp.payload.objType = to.query.objType;
      }
      if (to.query.pointerStatus) {
        actualProp.payload
          .pointerStatus = to.query.pointerStatus.split(',');
      }
      if (to.query.executionStatus) {
        actualProp.payload
          .pointerStatus = to.query.executionStatus.split(',');
      }
      if (to.query.minDate) {
        actualProp.payload.minDate = to.query.minDate;
      }
      if (to.query.maxDate) {
        actualProp.payload.maxDate = to.query.maxDate;
      }
      if (to.query.searchUsers) {
        actualProp.payload.searchUsers = to.query.searchUsers;
      }
      if (to.query.notifiedUsers) {
        actualProp.payload
          .notifiedUsers = to.query.notifiedUsers.split(',');
      }
      if (to.query.actoredUsers) {
        actualProp.payload
          .actoredUsers = to.query.actoredUsers.split(',');
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

        delete actualProp.payload[k];
      });

      return actualProp;
    },
  },
];

export const dashboardRoutes = {
  routes,
};

export default dashboardRoutes;
