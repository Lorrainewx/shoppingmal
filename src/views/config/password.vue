<template>
    <Card>
        <p slot="title" style="padding-left: 5px;">
            {{ $route.meta.title }} 
        </p>

		<!-- 登陆时 验证是否是超管 -->
        <Row :style="{marginBottom: '30px'}">   
			<Col span="12" >							
		    	<label for="">关键字</label>
                <Input v-model="keyword" :value="keyword" @on-keyup.enter="loadData" placeholder="" style="width: 180px"></Input>
                <Button type="ghost" icon="android-cancel"  :disabled="keyword==''" @click="keyword='';loadData();">取消查询</Button>
                <Button type="primary" icon="ios-search" @click="loadData">查询</Button>
		    	<Button type="primary" icon="plus" @click="handleAdd">增加管理员</Button> 	
			</Col>
		    <Col span="12" :style="{textAlign: 'right'}">             	
		    	<Button type="success" icon="arrow-return-left" @click="handleBack">返回</Button> 
		    	<Button type="primary" icon="refresh" @click="loadData">刷新</Button> 
			</Col>
		</Row>
		<Table border :columns="columns" :data="user.items"></Table>
		<Page :page-size="user.size" :total="user.total" show-sizer show-elevator show-total  @on-change="changePageIndex" @on-page-size-change="changePageSize"></Page>
		<Spin fix v-if="spinShow">
		    <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
		    <div>数据加载中...</div>
		</Spin>

		<Modal
		    v-model="modal"
		    :title="useritem.nickname"
		    @on-ok="handleSave"
		    @on-cancel="handleCancel">
		    <Form :model="useritem" :label-width="120" >
		        <FormItem label="用户名">
		            <Input v-model="useritem.username" placeholder="用户名"></Input>                
				</FormItem>		        
		        <FormItem label="昵称">
		            <Input v-model="useritem.nickname" placeholder="昵称"></Input>                
				</FormItem>         
		        <FormItem label="权限">
		            <Input v-model="useritem.issuper == true ? '超管':'客服'" placeholder="管理员" disabled></Input>                
				</FormItem>	
		        <FormItem label="密码">
		            <Input v-model="useritem.password" placeholder="密码"></Input>             
				</FormItem>	
		    </Form>
		</Modal>
    </Card>
</template>

<script>
	import Util from '../../libs/util';

	export default {
		data () {
		   	return {
		   		user: {},//管理员信息
		   		useritem: {},
		   		keyword: '',
		   		modal: false,
		   		columns: [
                    { title: '序号', type: 'index',width: 80,align: 'center' }, 
                    { title: '用户名', key: 'username', },
                    { title: '昵称', key: 'nickname', }, 
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
	                                        this.modal = true;

	                                        Util.ajax.post('/api/admin/admin/get',{
	                                        	id: params.row.id
	                                        }).then((res) => {
	                                        	this.useritem = res.data.body;
	                                        })
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
	                                            Util.ajax.post('/api/admin/admin/remove',{
	                                                id: params.row.id
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
                    		])
                    	}
                    }
		   		],
		   		spinShow: true,
			}
		},
		methods: {    
			loadData () {
				Util.ajax.post('/api/admin/admin/query',{
					keyword: this.keyword,
					page: this.user.page,
					size: this.user.size,					
				}).then((res) => {
					this.user = res.data.body;
					this.spinShow = false;
				})
			},
			handleBack () {
				window.history.back();
			},
			changePageIndex(event) {
				this.user.page = event;
				this.loadData();
			},
			changePageSize(event) {
				this.user.size = event;
				this.loadData();
			},
			handleSave () {
				Util.ajax.post('/api/admin/admin/save',{
	    			id: this.useritem.id,
	    			nickname: this.useritem.nickname,   
	    			username: this.useritem.username,			
	    			password: this.useritem.password,	    			
	    		}).then((res) => {
	    			if(res.data.code == 0) {
	    				this.loadData();
	    			}
	    		})

			},
			handleCancel () {

			},
			handleAdd () {
				this.modal = true;
				this.useritem = {};
			},
		},
        created () {
        	this.loadData();
        }
	}
</script>