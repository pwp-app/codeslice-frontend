import Vue from 'vue';
import { Button, Form, FormItem, Input, Select, Option, Message, MessageBox } from 'element-ui';
import './theme/index.css';

Vue.use(Button);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Select);
Vue.use(Option);

Vue.prototype.$message = Message;
Vue.prototype.$msgbox = MessageBox;