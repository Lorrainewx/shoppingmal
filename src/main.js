import ElementDataset from 'element-dataset';
ElementDataset();

import 'babel-polyfill';


import Vue from 'vue';
import iView from 'iview';
import VueRouter from 'vue-router';
import Routers from './router';

import Util from './libs/util';
import App from './app.vue';
import 'iview/dist/styles/iview.css';
import env from './config/env';


import $ from 'jquery';
window.jQuery = $;
window.$ = $;






//编辑器 start
// Require Froala Editor js file.
import 'froala-editor/js/froala_editor.pkgd.min';
import 'froala-editor/js/languages/zh_cn.js';

// Require Froala Editor css files.
import 'froala-editor/css/froala_editor.pkgd.min.css';
import 'font-awesome/css/font-awesome.css';
import 'froala-editor/css/froala_style.min.css';
// 编辑器 end

// Import and use Vue Froala lib.
import VueFroala from 'vue-froala-wysiwyg'
Vue.use(VueFroala)


// import mavonEditor from 'mavon-editor'
// import 'mavon-editor/dist/css/index.css'
// Vue.use(mavonEditor)


Vue.use(VueRouter);

Vue.use(iView);

// 路由配置
const RouterConfig = {
    mode: 'history',
    base: env === 'development' ? '' : '/hzradmin/',
    routes: Routers
};

const router = new VueRouter(RouterConfig);

router.beforeEach((to, from, next) => {
    iView.LoadingBar.start();
    Util.title(to.meta.title);
    next();
});

router.afterEach(() => {
    iView.LoadingBar.finish();
    window.scrollTo(0, 0);
});

new Vue({
    el: '#app',
    router,
    mounted () {
        // ...
    },
    render: h => h(App)
});