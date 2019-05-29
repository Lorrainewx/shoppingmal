import axios from 'axios';
import env from '../config/env';

let util = {

};
util.title = function(title) {
    title = (title ? title + ' - ' : '') + '商城后台管理系统';
    window.document.title = title;
};

const ajaxUrl = env === 'development'
    ? 'http://www.ftdolls.com' : env === 'production'
        ? '' : 'https://debug.url.com';

util.ajax = axios.create({
    baseURL: ajaxUrl,
    timeout: 30000,
    withCredentials: true //允许携带Cookie
    /*withCredentials: true *///允许携带Cookie
});

export default util;