<template>
    
</template>

<script>
import Cookies from 'js-cookie';
import Util from '../libs/util';
import env from '../config/env';

export default {
    data () {
        return {
        };
    },
    created: function(){

        Util.ajax.post('/api/admin/logout').then((response) => { console.log(Cookies.get('user_type'))});   
        Cookies.remove('user_name');
        Cookies.remove('user_type'); //销售
        Cookies.remove('admin_token');
        Cookies.remove('admin_info');        
        location.href = (env === 'development' ? '' : '/hzradmin') + '/login';
       
    }
};
</script>