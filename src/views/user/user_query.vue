<template>
    <Card>
        <p slot="title" style="padding-left: 5px;">
            {{ $route.meta.title }} <Icon type="ios-arrow-forward"></Icon> {{ body.name }}
        </p>
        <Row>
        	<Col span="24" :style="{textAlign: 'right'}">
            <Button type="success" icon="arrow-return-left" @click="handleBack">返回</Button>
	        </Col>
	     </Row>

	    <Table border :columns="columns" :data="body.items"></Table>

     
    </Card>

</template>


<script>
import Util from '../../libs/util';

export default {
    data () {
    	return {
    		body: {},
    		columns: [
	            { title: '序号', type: 'index',width: 80,align: 'center' }, 
	            { title: '收货人', key: 'name' },     
	            { title: '手机号码', key: 'mobile' },	
    			{ title: '商品', key: 'tradebody' },	            	
    			{ title: '商品编号', key: 'tradeno' , width: 200 },
    			{ title: '商品数量', key: 'totalqty' },
    			{ title: '商品总价', key: 'totalamount' },
    			{ 
                	title: '订单状态', 
                	key: 'orderstatus',
                	render: (h,params) => {
                		return h('div',[
                			h('span',params.row.orderstatus.name )
                		])
                	}
               	},
    			{
                    title: '操作', 
                    key: 'users_operations',
                    align: 'center',
                    width: 120,
                    render: (h ,params) => {
                        return h('div', [
                          h('Button', {
                              props: {
                                  type: 'primary',
                              },
                              style: {
                                  marginRight: '5px'
                              },
                              on: {
                                  click: () => {                                                                           
                                     /*Util.ajax.post('/api/admin/order/query',{
                                      userid: params.row.id

                                     }).then((res) => {
                                        console.log(res.data);

                                        
                                     })*/
                                     let argu = {order_id: params.row.id};                                                                       
                                     this.$router.push({
                                         name: 'manage-order-detail',
                                         params: argu
                                     });
                                 }
                              }
                          }, '查看')
                    ])		
                  }
              }	,
    		]

		}

	},
	methods: {
		loadData() {
			Util.ajax.post('/api/admin/order/query',{
				userid: this.$route.params.user_id,
			}).then((res) => {
				this.body = res.data.body;
			})

      Util.ajax.post('/api/admin/user/query',{
      }).then((res) => {
      })
		},
    handleBack() {
      window.history.back();
    }
	},
  beforeRouteLeave(to, from, next) {
      // 设置下一个路由的 meta
      to.meta.keepAlive = false; // 让 A 缓存，即不刷新
      next();
  },
	created () {
		this.loadData();
	}

}

</script>

