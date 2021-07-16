import Vue from 'vue';
import moment from 'moment';
import 'whatwg-fetch';
import VueMq from 'vue-mq';

import VueSSE from 'vue-sse';

import App from './App';
import './components';
import './views';
import router from './router';
import './fontawesome';
import './bootstrapvue';
import i18n from './i18n';

import UserServicePlugin from './services/user.service';
import PointerServicePlugin from './services/pointer.service';
import ExecutionServicePlugin from './services/execution.service';

Vue.use(UserServicePlugin);
Vue.use(PointerServicePlugin);
Vue.use(ExecutionServicePlugin);

Vue.use(VueSSE);

Vue.use(VueMq, {
  breakpoints: {
    sm: 768,
    md: 992,
    lg: Infinity,
  },
  defaultBreakPoint: 'sm',
});

Vue.config.productionTip = false;

moment.locale(process.env.LOCALE);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  i18n,
  components: { App },
  template: '<App/>',
});
