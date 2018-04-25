// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import Vuex from 'vuex';
import App from './App.vue';
import router from './router';
import VCharts from 'v-charts';
import {getToken} from './common/js/auth';
import ElementUI from 'element-ui';
import './mock/index';
import store from './store';
// import 'normalize.css';
import 'element-ui/lib/theme-chalk/index.css';

Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.use(VCharts);
Vue.use(Vuex);
router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requireAuth)) {
        if (getToken()) {
           // store.dispatch('waitToDo');
            next();
        } else {
            next({
                path: '/login',
                query: {redirect: to.fullPath}
            });
        }
    } else {
        if (getToken()) {
            next({
                path: '/',
                query: {redirect: to.fullPath}
            });
        } else {
            next();
        }
    }
});
/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: {App}
});
