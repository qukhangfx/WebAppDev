import { createApp } from 'vue'
import App from './App.vue'

import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

import { handle } from "./common/promise";
import router from "./router";
import store from "./store";

import CKEditor from '@ckeditor/ckeditor5-vue';

createApp(App)
  .mixin({
    methods: {
      handle,
    }
  })
  .use(store)
  .use(router)
  .use(CKEditor)
  .mount('#app');

