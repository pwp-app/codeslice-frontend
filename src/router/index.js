import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
    },
    {
        path: '/404',
        name: '404',
        component: () => import(/* webpackChunkName: "404" */ '../views/404.vue'),
    },
    {
        path: '/:key',
        name: 'Presentation',
        component: () => import(/* webpackChunkName: "presentation" */ '../views/Presentation.vue'),
    },
    {
        path: '*',
        redirect: '/404'
    }
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes,
});

export default router;
