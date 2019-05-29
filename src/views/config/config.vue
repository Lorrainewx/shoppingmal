<template>
    <Card>
        <p slot="title">
            {{ $route.meta.title }} 
        </p>
       	<Row>		
	       	<Col span="24" style="text-align: right;">                
	       	    <Button type="info" icon="refresh" @click="loadData">刷新</Button>
	       	    <Button type="success" icon="arrow-return-left" @click="handleBack">返回</Button>
	       	</Col>
	       	<Col span="24">
	       		<Tabs>
	       	        <TabPane label="商城设置">
						<Form :model="config_root" :label-width="160" style="width: 100%;margin: 20px auto 0;background-color: #eee;border-radius: 5px;padding: 20px; min-height: 320px;">
						    <FormItem label="商城名称">
						        <Input v-model="config_root.name" placeholder="商城名称"></Input>                
						    </FormItem>  
						    <FormItem label="货币符号">
						        <Input v-model="config_root.moneysymbol" placeholder="货币符号"></Input>                
						    </FormItem>  
						    <FormItem label="前置符号">
						        <Input v-model="config_root.premoneysymbol" placeholder="前置符号"></Input>                
						    </FormItem>  
						    <FormItem label="后置符号">
						        <Input v-model="config_root.posmoneysymbol" placeholder="后置符号"></Input>                
						    </FormItem>   
						    <FormItem label="订单接收邮件">
						        <Input v-model="config_root.orderreceivemail" placeholder="订单接收邮件"></Input>                
						    </FormItem>
						    <FormItem label="咨询接收邮件">
						        <Input v-model="config_root.qareceivemail" placeholder="咨询接收邮件"></Input>                
						    </FormItem>
						    
							<FormItem label="是否启用SMTP">
					            <i-switch v-model="config_root.smtpenable" @on-change="change">
					                <span slot="open">是</span>
					                <span slot="close">否</span>
					            </i-switch>
					        </FormItem>
					        <template v-if="config_root.smtpenable">
						        <FormItem label="SMTP服务器">
						            <Input v-model="config_root.smtphost" placeholder="SMTP服务器"></Input>                
						        </FormItem>
						        <FormItem label="SMTP端口号">
						            <Input v-model="config_root.smtpprot" placeholder="SMTP端口号"></Input>                
						        </FormItem>
						        <FormItem label="SMTP用户名">
						            <Input v-model="config_root.smtpusername" placeholder="SMTP用户名"></Input>                
						        </FormItem>
						        <FormItem label="SMTP密码">
						            <Input v-model="config_root.smtppassword" placeholder="SMTP密码"></Input>                
						        </FormItem>
						        <FormItem label="SMTP邮件地址">
						            <Input v-model="config_root.smtpformemail" placeholder="SMTP邮件地址"></Input>                
						        </FormItem>
						        <FormItem label="SMTP邮件发送者名称">
						            <Input v-model="config_root.smtpfromname" placeholder="SMTP邮件发送者名称"></Input>                
						        </FormItem>
					        </template>
							<FormItem>
					            <Button type="primary" @click="handleSave">保存</Button>
					            <Button type="ghost" style="margin-left: 8px">取消</Button>
					        </FormItem>
						</Form>
	       	        </TabPane>
	       	        <!-- <TabPane label="支付设置">
	       	                				<Table border :columns="columns_payment" :data="config_payment"></Table>       				  				
	       	        
	       	        </TabPane>
	       	        <TabPane label="配送设置">
	       	                				<Table border :columns="columns_shipping" :data="config_shipping"></Table>					
	       	        
	       	        </TabPane> -->
	       	    </Tabs>
	       	</Col>
       	</Row>
       
       	
   </Card>
</template>


<script>
	import Util from '../../libs/util';

	export default {
	    data () {
	        return {
	        	config_root: {},
	        	config_payment: [],
	        	config_shipping: [],
	        	columns_payment: [
                    { title: '序号', type: 'index',width: 80,align: 'center' }, 
                    { title: '支付方式', key: 'name' }, 
                    { title: '相关描述', key: 'description' }, 
                    { title: '支付工具', key: 'pluginname' },                                        
	        	],
	        	columns_shipping: [
	        		{ title: '序号', type: 'index',width: 80,align: 'center' }, 
	        		{ title: '取货方式', key: 'name' }, 
	        		{ title: '相关描述', key: 'description' }, 
	        	]

	        }
	    },
	    methods: {
	    	loadData() {
	    		Util.ajax.post('/api/config',{

	    		}).then((res) => {
	    			this.config_root = res.data.body;
	    		})
	    	},
	    	loadData_payment() {
	    		Util.ajax.post('/api/config/payment',{

	    		}).then((res) => {
	    			this.config_payment = res.data.body;
	    		})
	    	},
	    	loadData_shipping() {
	    		Util.ajax.post('/api/config/shipping',{

	    		}).then((res) => {
	    			this.config_shipping = res.data.body;
	    		})
	    	},
	    	handleBack () {
	    		window.history.back();
	    	},
	    	handleSave () {
	    		Util.ajax.post('/api/admin/config/save',{
	    			name: this.config_root.name,
	    			moneysymbol: this.config_root.moneysymbol,
	    			premoneysymbol: this.config_root.premoneysymbol,
	    			posmoneysymbol: this.config_root.posmoneysymbol,
	    			orderreceivemail: this.config_root.orderreceivemail,
	    			smtpenable: this.config_root.smtpenable,
	    			smtphost: this.config_root.smtphost,
	    			smtpformemail: this.config_root.smtpformemail,
	    			smtpfromname: this.config_root.smtpfromname,
	    			smtpusername: this.config_root.smtpusername,
	    			smtppassword: this.config_root.smtppassword,
	    			smtpprot: this.config_root.smtpprot,
	    		}).then((res) => {
	    			
	    		})
	    	},	    	
	    	change (status) {
                //console.log(this.config_root.smtpenable);
            }
	    },
	    beforeRouteLeave(to, from, next) {
	        // 设置下一个路由的 meta
	        to.meta.keepAlive = false; // 让 A 缓存，即不刷新
	        next();
	    },
	    created () {
	    	this.loadData();
	    	this.loadData_payment();
	    	this.loadData_shipping();
	    }
	}

</script>