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
            {{ $route.meta.title }} <Icon type="ios-arrow-forward"></Icon>  {{ detail_content.name }}
        </p>

		<Row :style="{marginBottom: '20px'}">
            <Col span="24" style="text-align: right;">                
                <Button type="success" icon="arrow-return-left" @click="handleBack">返回</Button>
            </Col>
        </Row>

	    <Form :model="detail_content" :label-width="120">
	    	<FormItem label="栏目">	    	    
	    	    <Select v-model="detail_content.channelid" @on-change="changeChannelid" placeholder="请选择栏目">
	    	        <Option :key="0" :value="0">顶级栏目</Option>	    	    	
	    	        <Option v-for="item in channels_tree" :key="item.id" :value="item.id">{{ item.name }}</Option>
	    	    </Select>        
	    	</FormItem> 
	        <FormItem label="名称">
	            <Input v-model="detail_content.name" placeholder="名称"></Input>                
	        </FormItem> 
	        <FormItem label="简介">
	            <Input v-model="detail_content.summary" type="textarea" :rows="4" placeholder="简介"></Input>                
	        </FormItem>   

			<!-- 图片上传 -->
			<FormItem label="图片">
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
	                :action= "UploadSrc + '/api/admin/upload/'"  
	                style="display: inline-block;width:58px;">
	                <div style="width: 58px;height:58px;line-height: 58px;">
	                    <Icon type="camera" size="20"></Icon>
	                </div>
	            </Upload>
	            <Modal title="预览" v-model="visible">
	                <img :src="UploadSrc + imgUrl" v-if="visible" style="width: 100%">
	            </Modal> 
	        </FormItem>
			
			<FormItem label="附件">
				<Upload :action="UploadSrc + '/api/admin/upload/'"  >
				    <Button type="ghost" icon="ios-cloud-upload-outline">上传附件</Button>
				</Upload>
			</FormItem>
	        <FormItem label="SEO标题">
	            <Input v-model="detail_content.title" placeholder="SEO标题"></Input>                
	        </FormItem>  
	        <FormItem label="SEO描述">
	            <Input v-model="detail_content.description" type="textarea" :rows="4" placeholder="SEO描述"></Input>                
	        </FormItem>  
	        <FormItem label="SEO关键词">
	            <Input v-model="detail_content.keywords" placeholder="SEO关键词"></Input>                
	        </FormItem>  
	        <FormItem label="排序">
	            <Input v-model="detail_content.sortby" placeholder="排序"></Input>               
	                 
	        </FormItem> 
	        <FormItem label="发布时间">           
	           	<DatePicker type="datetime" placeholder="Select date" v-model="detail_content.createtime"></DatePicker>
	        </FormItem>
	        <FormItem label="内容">
            	<froala :tag="'textarea'" :config="config" v-model="detail_content.bodycontent"></froala>
            </FormItem>

            <FormItem>
                <Button type="primary" @click="handleSave">保存</Button>
                <Button type="ghost" style="margin-left: 8px" @click="refresh">取消</Button>
                <Alert type="success" show-icon closable v-if="status_success" :style="{textAlign: 'left',marginTop: '10px'}">修改成功！</Alert>
                <Alert type="error" show-icon closable v-if="status_error" :style="{textAlign: 'left',marginTop: '10px'}">{{error_msg}},请重新提交修改！</Alert>
            </FormItem>
	    </Form>
        <Modal 
            v-model="modal"
            @on-ok="backtocontentlist"
            @on-cancel="backtocontentlist">
            <p>保存成功！</p>
        </Modal> 

    </Card>
</template>

<script>
	import Util from '../../libs/util';
    import Upload from '../../libs/upload';

    export default {
    	data() {
    		return {
                UploadSrc: Upload,
    			detail_content: {},//内容详情
    			channels_tree: [],
    			spinShow: true,
    			status_success: false,
    			status_error: false,
				config: {
                    imageUploadURL: '/api/admin/upload/froala',
                    imageInsertButtons: ['imageBack', '|', 'imageUpload', 'imageByURL'],
                    language: 'zh_cn',
                    toolbarButtons: ['undo', 'redo', '|', 'insertImage', 'insertTable', '|', 'bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', '|', 'fontSize', 'color', '|', 'paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', '|', 'specialCharacters', 'selectAll', 'clearFormatting', '|', 'help', 'html'],
                },
                images: [],
                //图片 上传
                defaultList: [],
                imgUrl: '',
                uploadList: [],                
                visible: false,
                modal: false,

                addstatus: true, // 添加产品的开关
    		}
    	},
    	methods: {
    		loadData() {               
                //区分编辑还是添加
                var content_id = this.$route.params.content_id;
                if(content_id != 'add') {   //编辑状态
                    Util.ajax.post('/api/content/get',{
                        id: this.$route.params.content_id
                    }).then((res) => {                      
                        this.detail_content = res.data.body;
                        if(this.detail_content.images != null){
                            this.images = JSON.parse(this.detail_content.images);
                            for(var i in this.images) {
                                console.log(this.images[i].url);
                                this.uploadList.push({
                                    'name' : this.images[i].name,
                                    'url': this.UploadSrc + this.images[i].url,
                                    'status': 'finished',
                                })
                            }
                        }                        
                    })
                }			
    		},
    		refresh() {
    			this.uploadList = [];
    			this.loadData();
    		},
    		loadChannel_tree() {
    			Util.ajax.post('/api/channel/tree',{

    			}).then((res) => {
    				this.channels_tree = res.data.body;
    			})
    		},
    		handleSave() {
    			this.status_success = false;
    			this.status_error = false;
    			this.uploadList = [];
                
                //id
                var id = new Number;

                if(this.$route.params.content_id != 'add') {
                    id = this.$route.params.content_id;
                    this.addstatus = false;
                }
    			Util.ajax.post('/api/admin/content/save',{
    				id: id,
    				title: this.detail_content.title,
    				summary: this.detail_content.summary,
    				name: this.detail_content.name,
    				description: this.detail_content.description,
    				sortby: this.detail_content.description,
    				keywords: this.detail_content.keywords,
    				bodycontent: this.detail_content.bodycontent,
    				images: JSON.stringify(this.images),
    				channelid: this.detail_content.channelid,
    			}).then((res) => {    				
    				if(res.data.code == 0) {
    					this.status_success = true;
    					this.status_error = false;
                        if(!this.addstatus) { //未添加状态
                            this.loadData();
                        }else {
                            this.modal = true;                           
                        }
            					
    				}else {
    					this.status_error = true;
    					this.status_success = false;
    				}
    			})
    			
    		},
    		changeChannelid(e) {

    		},
    		//上传图片
    		handleView (name) {    			
                for(var i in this.images) {
                    if(this.images[i].name == name) {
                        this.imgUrl = this.images[i].url;
                    }
                }                 
                this.visible = true;
            },
            handleRemove (file) { //移除图片
                const fileList = this.$refs.upload.fileList;
                this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);

                for(var i in this.images) {
                	if(this.UploadSrc +this.images[i].url == file.url) {
                		this.images.splice(i,1);
                		this.uploadList.splice(i,1);
                	}
                }
            },
            handleSuccess (res, file) {//上传成功
            	//console.log(res,file);
            	this.images.push({"name" : file.name,"url": res.url});  
                file.url = this.UploadSrc + res.url;
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
            handleBack () {
            	window.history.back();
            },
            backtocontentlist () {
                this.$router.push({
                    name: 'manage-content'
                    
                }); 
            },
		},
        beforeRouteLeave(to, from, next) {
            // 设置下一个路由的 meta
            to.meta.keepAlive = false; // 让 A 缓存，即不刷新
            next();
        },
		created: function() {
			this.loadData();
			this.loadChannel_tree();

 		},
 		mounted() {
 			this.uploadList = this.$refs.upload.fileList;
 			
 		}
    }
</script>
