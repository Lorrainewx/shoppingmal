<template>
    <Card>
        <p slot="title">
            {{ $route.meta.title }} 
        </p>

		<Table border :columns="columns" :data="body.items"></Table>

		<Page :page-size="body.size" :total="body.total" show-sizer show-elevator show-total  @on-change="changePageIndex" @on-page-size-change="changePageSize"></Page>

    </Card>
</template>

<script>
	import Util from '../../libs/util';

	export default {
	    data () {
	        return {
	        	body: {},
	        	keyword: '',
	        	columns: [
                    { title: '序号', type: 'index',width: 80, align: 'center' },
                    { title: '操作者', key: 'nickname' },
                    { title: '修改内容', key: 'bodycontent' },	 
                    { title: 'ip地址', key: 'ipaddress' },
                    { title: '操作时间', key: 'createtime' },                    	                            	
                ],
			}
	   	},
	    methods: {
	        loadData() {
	        	Util.ajax.post('/api/admin/log/query',{
	        		page: this.body.page,
	        		size: this.body.size,
	        		keyword: this.keyword,

	        	}).then((res) => {
	        		this.body = res.data.body;
	        	}) 
			},
			changePageIndex(event) {
				this.body.page = event;
				this.loadData();
			},
			changePageSize(event) {
				this.body.size = event;
				this.loadData();
			}
	 	},
	     beforeRouteLeave(to, from, next) {
	         // 设置下一个路由的 meta
	         to.meta.keepAlive = false; // 让 A 缓存，即不刷新
	         next();
	     },
        created: function() {
            this.loadData();            
            
        },
    }
</script>