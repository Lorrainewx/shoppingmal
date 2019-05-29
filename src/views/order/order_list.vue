<template>
    <Card>
        <p slot="title" style="padding-left: 5px;">
            {{ $route.meta.title }}
        </p>
      	<Row>
            <Col span="20">                
                <label for="">订单号/收货人</label>
                <Input v-model="keyword" :value="keyword" @on-keyup.enter="loadData" placeholder="请输入订单号或收货人姓名" style="width: 180px"></Input>
                <Button type="ghost" icon="android-cancel"  :disabled="keyword==''" @click="keyword='';loadData();">取消查询</Button>
                <Button type="primary" icon="ios-search" @click="loadData">查询</Button>
                <Button type="info" icon="refresh" @click="keyword='';loadData();">刷新</Button>
            </Col>
            <Col span="4" style="text-align: right;">                
                <!-- <Button @click="printItems" :type="this.selection.length==0?'dashed':'info'" style="margin-right: 20px;">打印</Button>    -->         
                <Button type="success" icon="arrow-return-left" @click="handleBack">返回</Button>
            </Col>
       	</Row> 

		<Table border :columns="columns" :data="body.items" @on-selection-change="selectionChange"></Table>
       
        <Page :page-size="body.size" :total="body.total" show-sizer show-elevator show-total  @on-change="changePageIndex" @on-page-size-change="changePageSize"></Page>

        <Spin fix v-if="spinShow">
            <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
            <div>数据加载中...</div>
        </Spin>
   </Card>
</template>

<script>
	import Util from '../../libs/util';

	export default {
		data () {
			return {
				body: {},
				keyword: '',//
				spinShow: true,
                selection: [],
				columns: [
					/*{ title: '序号', type: 'selection',width: 80,align: 'center' }, */
                    { title: '序号', type: 'index',width: 80,align: 'center' }, 
                    { title: '订单号', key: 'tradeno',width: 200, },
                    { title: '收货人', key: 'name' },
                    // { title: '收货地址', key: 'address'},
                    // { title: '联系方式', key: 'mobile'},
                    { title: '总数量', key: 'totalqty',},                    
                    { title: '总金额', key: 'totalamount', render: (h,params) => { return h('div', params.row.totalamount) }},                    
                    { title: '支付金额', key: 'paymentamount', render: (h,params) => { return h('div', params.row.paymentamount) }},
                    { 
                    	title: '订单状态', 
                    	key: 'orderstatus',
                    	render: (h,params) => {
                    		return h('div',[
                    			h('span',params.row.orderstatus.name )
                    		])
                    	}
                    },
                    { title: '下单时间', key: 'createtime'},
                    {
                    	title: '操作',
                    	key: 'order_operations',
                    	align: 'center',
                        width: 200,
                    	render: (h,params) => {
                    		return h('div',[
                    			 h('Button', {
                                    props: {
                                        type: 'primary',
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {                                                                           
                                            let argu = {order_id: params.row.id};                                                                       
                                            this.$router.push({
                                                name: 'manage-order-detail',
                                                params: argu
                                            }); 
                                        }
                                    }
                                }, '查看'),  
                                
                                 h('Poptip', {
                                       props: {
                                           refs: String,
                                           confirm: true,
                                           title: '您确定要删除这条数据吗?',
                                           transfer: true
                                       },
                                       on: {
                                           'on-ok': () => {  
                                                var id = params.row.id;
                                                Util.ajax.post('/api/admin/order/remove',{
                                                    id: params.row.id
                                                }).then((res) => {
                                                    this.loadData();
                                                })                                              
                                            },
                                            'on-cancel' : () => {

                                            }
                                       }
                                },[
                                    h('Button', {
                                        style: {
                                            marginRight: '5px'
                                        },
                                        props: {
                                            type: 'error',
                                            placement: 'top'
                                        },
                                        on: {
                                            click: () => {                                             
                                                
                                            }
                                        }
                                    }, '删除')
                                ])
                    		])
                    	}
                    }
				]

			}
		},
		methods: {
			loadData() {
				Util.ajax.post('/api/admin/order/query',{					
					keyword: this.keyword,
                    page: this.body.page,
                    size: this.body.size,
                    userid: this.body.userid,
				}).then((res) => {
					if(res.data.code == 0) {
						this.body = res.data.body;
						this.spinShow = false;
					}
				})
			},           
			handleBack () {
				window.history.back();
			},
			changePageIndex(event) {
                this.body.page = event;
                this.loadData();
            },
            changePageSize(event) {
                this.body.size = event;
                this.loadData();
            },
            //批量操作
            printItems() {

            },
            selectionChange(event) {
                this.selection = event;
            }
		},
        beforeRouteLeave(to, from, next) {
            // 设置下一个路由的 meta
            to.meta.keepAlive = false; // 让 A 缓存，即不刷新
            next();
        },
		created: function() {
			this.loadData();
           
		}
	}
</script>