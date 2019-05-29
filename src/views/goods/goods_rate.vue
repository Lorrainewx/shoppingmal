<template>
    <Card>
        <p slot="title" style="padding-left: 5px;">
            {{ $route.meta.title }}
        </p>

         <Row>
            <Col span="16">                
                <label for="">请输入商品名称</label>
                <Input v-model="keyword" :value="keyword" @on-keyup.enter="loadData" placeholder="" style="width: 180px"></Input>
                <Button type="ghost" icon="android-cancel"  :disabled="keyword==''" @click="keyword='';loadData();">取消查询</Button>
                <Button type="primary" icon="ios-search" @click="loadData">查询</Button>
                <Button type="info" icon="refresh" @click="keyword='';loadData();">刷新</Button>
            </Col>
            <Col span="8" style="text-align: right;">
                <Button type="success" icon="arrow-return-left" @click="handleBack">返回</Button>
            </Col>
       </Row>  

       <Table border :columns="columns" :data="body.items"></Table>

        <!-- <Modal
           v-model="modal"
           :title="评论出现前台时间"
           @on-ok="handleSave"
           @on-cancel="handleCancel">
        <Form :model="attribute_item" :label-width="120" style="width: 100%;margin: 20px auto 0;background-color: #eee;border-radius: 5px;padding: 20px; min-height: 320px;">
               </Form>
               </Modal> -->
       
       
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
				body: {keyword: '',page: 1,size: 20,items:[],total: 1,},
				modal: false,
				spinShow: true,
				keyword: '',//关键词
				attributes_all : [],
				attribute_name: '',//规格名称
				columns: [
				    { title: '序号', type: 'index',width: 80,align: 'center' }, 
				    { title: '买家昵称', key: 'usernickname'},
				    { title: '商品名称', key: 'goodsname' }, 
				    { 
				    	title: '规格名称',
				    	key: 'goodsattributeid', 
				    	render: (h, params) => { 
				    	 	//params.row.goodsattributeid
				    	 	for(var i in this.attributes_all) {
				    	 		if(this.attributes_all[i].id == params.row.goodsattributeid) {
				    	 			console.log(this.attributes_all[i].name);
				    	 			this.attribute_name = this.attributes_all[i].name;
				    	 		}
				    	 	}

				    	 	return h('div',this.attribute_name)
				    	} 
				    }, 				    
				    { title: '商品规格名称', key: 'goodsattributename' }, 				    
				    { 
				    	title: '好评等级', 
				    	key: 'star' ,
				    	width: 180,
				    	render: (h,params) => {
				    		return h('div',[
				    			h('Rate', {                                    
                                    props: {
                                    	allowHalf: true,  
                                    	value: params.row.star,  
                                    	size: 'small',
                                    },
				    			}, '')
				    		])				    					    		
				    	}
				    }, 
				    { title: '评论', key: 'content' }, 
				    { title: '确认收货', width: 180, key: 'confirmtime' }, 
				    { title: '评论前台显示时间', width: 180, key: 'createtime'}, 
				    {
				    	title: '操作',
				    	key: 'rate_oprations',
				    	align: 'center',
				    	width: 200,
				    	render: (h,params) => {
				    		return h('div',[
				    			h('Button',{
				    				props: {
				    					type: 'primary',
				    					disabled: params.row.createtime == null ? false : true,
				    				},
				    				style: {
				    					marginRight: '5px',
				    				},
				    				on: {
				    					click: () => {				    						                                                      
				    						
				    					}
				    				}
				    			},'确认显示'),
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
                                            Util.ajax.post('/api/admin/goodsrate/remove',{
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
				    		])
				    	}
				    }
				],
			}
		},
		methods: {
			loadData() {
				Util.ajax.post('/api/goodsrate/query',{
					keyword: this.keyword,
					page: this.body.page,
					size: this.body.size,
					goodsid: this.body.goodsid,//商品编号
				}).then((res) => {
					this.body = res.data.body;
					this.spinShow = false;
				})
			},
			loadAttribute () {
				Util.ajax.post('/api/attribute',{

				}).then((res) => {
					if(res.data.code == 0) {
						this.attributes_all = res.data.body;
					}
				})
			},
			changePageIndex (event) {
				this.body.page = event;
			},
			changePageSize (event) {
				this.body.size = event;
			},
			handleBack () {
				window.history.back();//返回
			},
			confirm () {

			},
			handleCancel () {

			},

		},
		//beforeRouteLeave(to, from, next) {
		    // 设置下一个路由的 meta
		    // to.meta.keepAlive = false; // 让 A 缓存，即不刷新
		    // next();
		//},
		created: function(){
			this.loadData();
			this.loadAttribute();//总属性
		}
	}
</script>