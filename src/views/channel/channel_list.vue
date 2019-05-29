<style>
    .demo-upload-list{display: inline-block;width: 60px;height: 60px;text-align: center;line-height: 60px;border: 1px solid transparent;border-radius: 4px;overflow: hidden;background: #fff;position: relative;box-shadow: 0 1px 1px rgba(0,0,0,.2);margin-right: 4px;}
    .demo-upload-list img{width: 100%;height: 100%;}
    .demo-upload-list-cover{display: none;position: absolute;top: 0;bottom: 0;left: 0;right: 0;background: rgba(0,0,0,.6);}
    .demo-upload-list:hover .demo-upload-list-cover{display: block;}
    .demo-upload-list-cover i{color: #fff;font-size: 20px;cursor: pointer;margin: 0 2px; }
</style>


<template>
    <Card>
        <p slot="title" style="padding-left: 5px;">
            {{ $route.meta.title }}
        </p>

        <Row>          
            <Col span="12">  
                <Button type="info" icon="refresh" @click="loadData_tree();">刷新</Button>
            </Col>
            <Col span="12" style="text-align: right;">               
                <Button type="primary" icon="plus" @click="handleAdd">添加新栏目</Button>
                <Button type="success" icon="arrow-return-left" @click="handleBack">返回</Button>
            </Col>
        </Row> 

		<Table border :columns="columns" :data="channel_tree"></Table> 

        <Modal
            v-model="modal"
            :title="channel_item.name"
            @on-ok="handleSave"
            @on-cancel="handleCancel">
            <Form :model="channel_item" :label-width="120" >
                <FormItem label="栏目名称">
                    <Input v-model="channel_item.name" placeholder="栏目名称"></Input>                
                </FormItem>
                <FormItem label="栏目别名">
                    <Input v-model="channel_item.alias" placeholder="栏目别名"></Input>                
                </FormItem>
                <!-- 图片上传 -->
                <!-- <FormItem label="图片">
                    <div class="demo-upload-list" v-for="item in uploadList">
                        <template v-if="item.status === 'finished'">
                            <img :src="item.url">
                            <div class="demo-upload-list-cover">
                                <Icon type="ios-eye-outline" @click.native="handleView(item.name)"></Icon>
                                <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                            </div>
                        </template>
                        <template v-else>
                            <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                        </template>
                    </div>
                    http://shop.haizr.com/api/admin/upload/
                    <Upload
                        ref="upload"
                        :show-upload-list = 'false'
                        :default-file-list="defaultList"
                        :on-success="handleSuccess"
                        :format="['jpg','jpeg','png']"
                        :max-size="2048"
                        :on-format-error="handleFormatError"
                        :on-exceeded-size="handleMaxSize"
                        :before-upload="handleBeforeUpload"
                        multiple
                        type="drag"
                        action= ""  
                        style="display: inline-block;width:58px;">
                        <div style="width: 58px;height:58px;line-height: 58px;">
                            <Icon type="camera" size="20"></Icon>
                        </div>
                    </Upload>
                    <Modal title="预览" v-model="visible">
                        <img :src="ajaxUrl + imgUrl" v-if="visible" style="width: 100%">
                    </Modal> 
                </FormItem>      -->

                <FormItem label="父级栏目" v-if="addstatus">
                    <Select v-model="channel_item.parentid" @on-change="changeChannelid" placeholder="选择栏目">
                        <Option :key="0" :value="0">一级栏目</Option>
                        <Option v-for="channel in channel_tree" :key="channel.id" :value="channel.id">{{ channel.name }}</Option>
                    </Select>               
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
                ajaxUrl: 'http://shop.haizr.com',
            	channel_tree: [],
            	channel_all: [],
                channel_item: { 
                    name: '',
                    alias: '',

                },
                modal: false,//编辑框
                addstatus: false,
            	columns: [
            		{ title: '序号', type: 'index',width: 80,align: 'center' }, 
            		{ title: '栏目名称', key: 'name'}, 
                    {
                        title: '移动',
                        key: 'channel_move',
                        align: 'center',
                        width: 240,
                        render: (h,params) => {
                            return h('div',[
                                h('Button',{
                                    props: {
                                        type: 'ghost',
                                        icon: 'arrow-up-a'                                        
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click : () => {
                                            Util.ajax.post('/api/admin/channel/sortby', {
                                                sortby: -1,                    
                                                id: params.row.id              
                                            }).then((res) => {                           
                                                // this.channel_all = res.data.body;      
                                                this.loadData_tree();  
                                                alert('排序成功！');                                           
                                            }).catch((res) => {                                                
                                                alert('处于此级的最高级，无法上移！');
                                            });
                                        }
                                    }
                                },'上移'),
                                h('Button',{
                                    props: {
                                        type: 'ghost',
                                        icon: 'arrow-down-a'  
                                    },                                    
                                    on: {
                                        click : () => {
                                            Util.ajax.post('/api/admin/channel/sortby', {
                                                sortby: 1,                    
                                                id: params.row.id               
                                            }).then((res) => {                           
                                                // this.channel_all = res.data.body;  
                                                this.loadData_tree();  
                                                alert('排序成功！');                                               
                                            }).catch((res) => {                                                 
                                                 alert('处于此级的最低级，无法下移！');
                                            });
                                        }
                                    }
                                },'下移')
                            ])
                        }
                    },   
                    {
                        title: '操作', 
                        key: 'channel_operations',
                        align: 'center',
                        width: 200,
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
                                            this.addstatus = false;    
                                            this.getChannel(params.row.id);                                            
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
                                                Util.ajax.post('/api/admin/channel/remove',{
                                                    id: params.row.id,
                                                }).then((res) => {
                                                    this.loadData_tree();
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
                    }             
            	],
                image: '',
                //图片上传
                defaultList: [],//图片默认列表 （已有图片）
                uploadList:[],//图片上传列表
                imgUrl: '',
                visible: false, 
 			}
        },
        methods: {
            loadData() {
            	Util.ajax.post('/api/channel',{

            	}).then((res) => {
            		this.channel_all = res.data.body;                    
            	})
			},
			loadData_tree () {
				Util.ajax.post('/api/channel/tree',{

				}).then((res) => {
					this.channel_tree = res.data.body;
				})
			},
            getChannel(id) { //栏目
                Util.ajax.post('/api/admin/channel/get',{
                    id: id,
                }).then((res) => {
                    if(res.data.code == 0){
                        this.channel_item = res.data.body;
                        
                        if(this.channel_item.image != '') {
                            console.log(this.channel_item.image);
                                        
                           
                        }
                    }
                })
            },
            changeChannelid() {

            },
            handleSave () {
                this.uploadList = [];
                Util.ajax.post('/api/admin/channel/save',{
                    id: this.channel_item.id,
                    parentid: this.channel_item.parentid,
                    name: this.channel_item.name,
                    alias: this.channel_item.alias,        

                }).then((res) => {
                    this.loadData_tree();
                })

            },
            handleCancel () {

            },
            handleBack() {
                window.history.back();
            },
            handleAdd() {
                //添加栏目
                
                this.addstatus = true;
                this.modal = true;
                this.channel_item = {};
            },
            //图片上传
            handleView (name) {             
                           
                this.visible = true;
            },
            handleRemove (file) { //移除图片
                const fileList = this.$refs.upload.fileList;
                this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);

              
            },
            handleSuccess (res, file) {//上传成功
                //console.log(res,file);
                // this.image = {"name" : file.name,"url": res.url};  
                file.url = this.ajaxUrl + res.url;

            },
            handleFormatError (file) { //格式错误提示
                this.$Notice.warning({
                    title: '文件格式不正确',
                    desc: '文件 ' + file.name + ' 是不正确的，请选择jpg或png的格式重新上传'
                });
            },
            handleMaxSize (file) { //图片大小限制提示
                this.$Notice.warning({
                    title: '超出文件大小',
                    desc: '文件  ' + file.name + ' 太大，最多不超过2M'
                });
            },
            handleBeforeUpload () { //上传数量的限制提示
                const check = this.uploadList.length < 10;
                if (!check) {
                    this.$Notice.warning({
                        title: '最多上传10张图片'
                    });
                }
                return check;
            },
		},      
        mounted() {
            // this.uploadList = this.$refs.upload.fileList;            
        }, 
        beforeRouteLeave(to, from, next) {
            // 设置下一个路由的 meta
            to.meta.keepAlive = false; // 让 A 缓存，即不刷新
            next();
        },
        created: function() {
            this.loadData();     
            this.loadData_tree();       
        },
    }
</script>