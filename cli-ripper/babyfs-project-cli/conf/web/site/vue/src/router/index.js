import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const routes = [
  {
    name: 'home',
    path: '/',
    component: () => import('../pages/home/home.vue')
  }, {
    name: 'error',
    path: '/error',
    component: () =>
      import('../pages/error/error.vue')
  }, {
    name: 'notFound',
    path: '/notfound',
    component: () =>
      import('../pages/error/notFound.vue')
  }, {
    name: 'notFound_default',
    path: '*',
    component: () =>
      import('../pages/error/notFound.vue')
  }
];

export default new Router({
  mode: 'history',
  routes: routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      if (to.hash) {
        return {
          selector: to.hash
        };
      } else {
        return {
          x: 0,
          y: 0
        };
      }
    }
  }
});
