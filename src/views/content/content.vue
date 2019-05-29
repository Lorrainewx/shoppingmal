
<template>
    <Card>
        <p slot="title" style="padding-left: 5px;">
            {{ $route.meta.title }}
        </p>

        <Row>
             <Col span="16">
                 <Select v-model="content_item.channelid" style="width:200px" @on-change="changeChannelid" placeholder="选择栏目">
                     <Option v-for="channel in channel_tree" :key="channel.id" :value="channel.id">{{ channel.name }}</Option>
                 </Select>
                 <label for="">关键字</label>
                 <Input v-model="keyword" :value="keyword" @on-keyup.enter="loadContentData" placeholder="" style="width: 180px"></Input>
                 <Button type="ghost" icon="android-cancel"  :disabled="keyword==''" @click="keyword='';loadContentData();">取消查询</Button>
                 <Button type="primary" icon="ios-search" @click="loadContentData">查询</Button>
                
             </Col>
             <Col span="8" style="text-align: right;">              
             	<Button type="info" icon="refresh" @click="refresh">刷新</Button>
                <Button type="primary" icon="plus" @click="handleAdd">添加内容</Button>  

                <Button type="success" icon="arrow-return-left" @click="handleBack">返回</Button>
             </Col>
        </Row> 

        <!-- 添加 -->
        <!-- <Modal
            v-model="modal"
            :title="category_item.name"
            @on-ok="handleSave"
            @on-cancel="handleCancel">
        </Modal>
         -->

		<Table border :columns="columns" :data="body_content.items"></Table>
       
        <Page :page-size="body_content.size" :total="body_content.total" show-sizer show-elevator show-total  @on-change="changePageIndex" @on-page-size-change="changePageSize"></Page>
        <Spin fix v-if="spinShow">
            <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
            <div>数据加载中...</div>
        </Spin>



    </Card>
</template>

<script>
	import Util from '../../libs/util';
    import Upload from '../../libs/upload';

    export default {
        data () {
            return {   
            	body_content: {},
            	body_channel: [],
            	channel_tree: [],
            	content_item: {},//单个内容列表
                UploadSrc: Upload,
            	keyword:'',
            	spinShow: true,
            	columns: [
            		{ title: '序号', type: 'index',width: 80,align: 'center' }, 
                    { title: '内容标题', key: 'name' },                    
                    { 
                    	title: '栏目', 
                    	key: 'channelid' , 
                    	render: (h, params) => { 
                    		var channel_name='';
                    		for(var i in this.channel_tree) {
                    			if(params.row.channelid == this.body_channel[i].id) {
                    				channel_name = this.body_channel[i].name;
                    			}
                    		}
                    		return h('div',channel_name == '' ? '无' : channel_name );
                    	} 
                    },
                    { title: '访问量', width: 80,align: 'center', key: 'totalview' }, 
                    {
                    	title: '操作',
                    	key:'background_operation',
                    	width: 200,
                    	align: 'center',
                    	render: (h,params) => {
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
                    		                let argu = {content_id: params.row.id}; 
                    		                this.$router.push({
                                                name: 'manage-content-edit',
                                                params: argu
                                            });                                                                      
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
                    		                    Util.ajax.post('/api/admin/content/remove',{
                        		            		id: params.row.id
                        		            	}).then((res) => {
                                                    this.loadContentData();
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
            loadContentData() {
            	Util.ajax.post('/api/content/query',{
            		keyword: this.keyword,
            		page: this.body_content.page,
            		size: this.body_content.size,
            		channelid: this.content_item.channelid,//栏目编号
            	}).then((res) => {        
            		this.spinShow = false;			
        			this.body_content = res.data;        			
            	})
			},
			loadChannelData() {

				Util.ajax.post('/api/channel',{
				}).then((res) => { 
					
					this.body_channel = res.data.body;
				})
			},
			loadChannel_tree() {
				Util.ajax.post('/api/channel/tree',{

				}).then((res) => {
					this.channel_tree = res.data.body;
				})
			},
			changeChannelid() { //栏目编号
				this.content_item.channelid;               
			},
			handleBack() { 
				window.history.back();
			},
			changePageIndex (event) {
				this.body_content.page = event;
				this.loadContentData();
			},
			changePageSize (event) {
				this.body_content.size = event;
				this.loadContentData();
			},
            refresh() {
                this.keyword = '';
                this.content_item.channelid = '';
                this.loadContentData();
            },
            handleAdd () {//添加内容
                let argu = {content_id: 'add'}; 
                this.$router.push({
                    name: 'manage-content-edit',
                    params: argu
                }); 
            },

		},
        beforeRouteLeave(to, from, next) {
            // 设置下一个路由的 meta
            to.meta.keepAlive = false; // 让 A 缓存，即不刷新
            next();
        },
        created: function() {
            this.loadContentData();   
            this.loadChannelData();    
            this.loadChannel_tree();
        }
    }

</script>