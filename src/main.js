import Vue from 'vue';
import App from './App.vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import VueClipboard from 'vue-clipboard2';
import { VueReCaptcha } from 'vue-recaptcha-v3'
import keys from '../config/key';

import router from './router';
import './styles/main.less';
import './plugins/element.js';

Vue.config.productionTip = false;

axios.defaults.timeout = 10000;

// set up axios
Vue.use(VueAxios, axios);

// set up clipboard plugin
Vue.use(VueClipboard);

// set up recaptcha
Vue.use(VueReCaptcha, {
    siteKey: keys.recaptcha,
    loaderOptions: {
        useRecaptchaNet: true
    }
});

new Vue({
    router,
    render: (h) => h(App),
}).$mount('#app');
