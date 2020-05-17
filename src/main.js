import Vue from 'vue';
import App from './App.vue';
import axios from 'axios'
import VueAxios from 'vue-axios'
import router from './router';
import './styles/main.less';
import './plugins/element.js'

Vue.config.productionTip = false;

axios.defaults.timeout = 10000;

// set up axios
Vue.use(VueAxios, axios)

new Vue({
    router,
    render: (h) => h(App),
}).$mount('#app');
