<template>
    <Card>
        <p slot="title" style="padding-left: 5px;">
            {{ $route.meta.title }}
        </p>
       <Row>
       	<Col span="12">
       	    <Button type="info" icon="refresh" @click="loadData();">刷新</Button>
       	</Col>
       	<Col span="12" style="text-align: right;">
       	    <Button type="primary" icon="plus" @click="handleAdd">增加会员</Button>
       	    <Button type="success" icon="arrow-return-left" @click="handleBack">返回</Button>
       	</Col>
       </Row>

        <Table border :columns="columns" :data="body.items"></Table>
        <Page :page-size="body.size" :total="body.total" show-sizer show-elevator show-total  @on-change="changePageIndex" @on-page-size-change="changePageSize"></Page>

        <Modal
            v-model="modal"
            :title="user.nickname"
            @on-ok="handleSave"
            @on-cancel="handleCancel">
            <Form :model="user" :label-width="120" >
                <FormItem label="昵称">
                    <Input v-model="user.nickname" placeholder="用户名称"></Input>                
        				</FormItem>
                <FormItem label="性别">
                    <Input v-model="user.sex" placeholder="性别"></Input>                
        				</FormItem>
        				<FormItem label="邮箱">
                    <Input v-model="user.email" placeholder="邮箱"></Input>                
        				</FormItem>
                <FormItem label="密码">
                    <Input v-model="user.verifycode" placeholder="密码"></Input>                
                </FormItem>
                
            </Form>
        </Modal>

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
	    		spinShow: false,
	    		user: {},//单个用户信息
	    		modal: false,
	    		addstatus: false,
	    		columns: [
            { title: '序号', type: 'index',width: 80,align: 'center' }, 
            { title: '昵称', key: 'nickname' },     		
	    			{ title: '登陆次数', key: 'totallogin' },
	    			{ title: '待付款', key: 'totalwaitpay' },
	    			{ title: '待发货', key: 'totalwaitconfirm' },
	    			{ title: '待收货', key: 'totalwaitsend' },
	    			{
                        title: '操作', 
                        key: 'users_operations',
                        align: 'center',
                        width: 260,
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
                                         /*this.modal = true;                
                                         this.addstatus = false;    
                                         this.getUserinfo(params.row.id); */

                                        let argu = {user_id: params.row.id};                                                                       
                                        this.$router.push({
                                            name: 'manage-user-query',
                                            params: argu
                                        }); 
                                      }
                                  }
                              }, '查看订单'),
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {                                                                           
                                           this.modal = true;                
                                           this.addstatus = false;    
                                           this.getUserinfo(params.row.id); 
                                        }
                                    }
                                }, '编辑'),                 
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
                                                Util.ajax.post('/api/admin/user/remove',{
                                                    id: id
                                                }).then((res)=> {
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
                            ]);                               
                        },
                    },
                ],
	    		body: {},

	    	}
	    },
	    methods: {
	    	loadData() {
	    		Util.ajax.post('/api/admin/user/query',{

	    		}).then((res) => {
	    			console.log(res.data);
	    			this.body = res.data.body;
	    		})
	    	},
	    	getUserinfo (id) {
	    		Util.ajax.post('/api/admin/user/get',{	 
	    			id: id   			
	    		}).then((res) => {
	    			this.user = res.data.body;
	    		})
	    	},
	    	handleBack () {
	    		window.history.back();
	    	},
	    	handleAdd () {	    		
	    		this.modal = true;
          this.user = {};
	    	},
	    	handleSave () {
	    		Util.ajax.post('/api/admin/user/save',{
	    			id: this.user.id,
	    			email: this.user.email,
	    			nickname: this.user.nickname,
	    			sex: this.user.sex,
	    			totallogin: this.user.totallogin,
            totalwaitconfirm: this.user.totalwaitconfirm,
	    			verifycode: this.user.verifycode,
	    		}).then((res) => {

	    		})
	    	},
	    	handleCancel () {

	    	},
        changePageIndex (event) {
          this.body.page = event;
          this.loadData();
        },
        changePageSize (event) {
          this.body.size = event;
          this.loadData();
        },
	    },
      beforeRouteLeave(to, from, next) {
          // 设置下一个路由的 meta
          to.meta.keepAlive = false; // 让 A 缓存，即不刷新
          next();
      },
	    created() {
	    	this.loadData();
	    }

	}

</script>