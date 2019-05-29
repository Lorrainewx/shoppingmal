<template>
    <Card>
        <p slot="title" style="padding-left: 5px;">
            {{ $route.meta.title }} 
        </p>

		<!-- 登陆时 验证是否是超管 -->
        <Row :style="{marginBottom: '30px'}">   

		    <Col span="24" :style="{textAlign: 'right'}">             	
		    	<Button type="success" icon="arrow-return-left" @click="handleBack">返回</Button> 
		    	
			</Col>
		</Row>
		
		

	    <Form :model="admin" :label-width="120" >
	        <FormItem label="旧密码">
	            <Input v-model="admin.oldpassword" placeholder="旧密码"></Input>                
			</FormItem>		        
	        <FormItem label="新密码">
	            <Input v-model="admin.newpassword" placeholder="新密码"></Input>                
			</FormItem>         
	        <FormItem label="确认密码">
	            <Input v-model="admin.confirmpassword" placeholder="确认密码"></Input>                
			</FormItem>		        

			<FormItem>
			    <Button type="primary" @click="handleSave">保存</Button>
	            <Button type="ghost" @click="handleCancel" style="margin-left: 8px">取消</Button>
	        </FormItem>
	    </Form>
    </Card>
</template>

<script>
	import Util from '../../libs/util';
	import Cookies from 'js-cookie';

	export default {
		data () {
		   	return {
		   		admin: {},
		   		
		   		
			}
		},
		methods: {   
			handleBack () {
				window.history.back();
			},			
			handleSave () {
				Util.ajax.post('/api/admin/password',{
	    			oldpassword: this.admin.oldpassword,
	    			newpassword: this.admin.newpassword,   
	    			confirmpassword: this.admin.confirmpassword,			    			
	    		}).then((res) => {
	    			if(res.data.code > 0) {
	    				alert('保存成功！');
	    			}	    			
	    		})
			},
			handleCancel () {

			}
		},
        created () {
        	/*this.loadData();*/
        }
	}
</script>