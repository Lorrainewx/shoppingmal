<template>
    <Card>
        <p slot="title" style="padding-left: 5px;">
            {{ $route.meta.title }} <Icon type="ios-arrow-forward"></Icon> {{ item.name }}
        </p>

        <Row :style="{marginBottom: '30px'}">          
           
		    <Col span="24" :style="{textAlign: 'right'}">
            	<Button type="info" icon="refresh" @click="loadData">刷新</Button>  
		    	<Button type="success" icon="arrow-return-left" @click="handleBack">返回</Button> 
			</Col>
		</Row>

		<Form :model="item" :label-width="80">
	        <FormItem label="所属类型">
	            <Input v-model="item.unique" placeholder="所属类型"></Input>
	        </FormItem>
	        <FormItem label="标题">
	            <Input v-model="item.name" placeholder="标题"></Input>
	        </FormItem>
	        <FormItem label="描述">
	            <Input v-model="item.description" placeholder="描述"></Input>
	        </FormItem>
	        <FormItem label="链接">
	            <Input v-model="item.href" placeholder="链接"></Input>
	        </FormItem>
	        <FormItem label="链接">
		        <Upload 
		         :action="UploadSrc + '/api/admin/upload/'" 
		         :on-success="handleSuccess">
		             <Button type="ghost" icon="ios-cloud-upload-outline">上传图片</Button>
		         </Upload>
		         <img :src=" UploadSrc + item.image" alt="" :style="{position: 'relative',top: '12px',width: '200px' }">
		     </FormItem>
	        <FormItem label="排序">
	            <Input v-model="item.sortby" placeholder="排序"></Input>
	        </FormItem>
	        <FormItem>
		        <Button type="info" @click="handleSave">确认修改</Button>
		        <Button type="ghost" @click="refresh">取消</Button>
		    </FormItem>
		</Form>
		<Modal title="保存成功" v-model="modal" @on-ok="success" @on-cancel="success">
		     
		</Modal> 
	</Card>
</template>

<script>
	import Util from '../../libs/util';
	import Upload from '../../libs/upload'


export default {
       	data () {
           	return {
           		item: {},
           		UploadSrc: Upload,
           		images: [],
           		modal: false,
           	}
       	},
       	methods: {
    		loadData() {
    			Util.ajax.post('/api/admin/link/get',{
    				id: this.$route.params.link_id
    			}).then((res) => {
    				this.item = res.data.body;
    			})
    		},
    		handleBack() {
    			window.history.back();
    		},
    		handleSuccess(file) {
    			this.images.unshift({
    				"name": file.name,
    				"url" : file.url,
    			})
    			this.item.images = JSON.stringify(this.images);

    		},
    		handleSave () {
    			Util.ajax.post('/api/admin/link/save',{
    				id: this.item.id,
    				unique: this.item.unique,
    				name: this.item.name,
    				href: this.item.href,
    				sortby: this.item.sortby,
    				description: this.item.description,
    				images: this.item.images,
    			}).then((res) => {
    				this.loadData();
    				this.modal = true;
    			})
    		},
    		refresh() {
    			this.loadData();
    		},
    		success() {
    			
    		}

       	},
        created () {
        	this.loadData();
        }
}
		

</script>