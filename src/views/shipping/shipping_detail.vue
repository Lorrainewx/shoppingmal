<template>
    <Card>
    	<p slot="title" style="padding-left: 5px;">
    	    {{ $route.meta.title }}
    	</p>

		<Row :style="{marginBottom: '20px'}">          
		    <Col span="24" style="text-align: right;">              
		        <!-- <Button type="info" icon="print" @click="handlePrint">订单打印</Button> -->
		        <Button type="info" icon="plus" @click="handleAdd">添加</Button>
		        <Button type="info" icon="refresh" @click="loadData">刷新</Button>
		        <Button type="success" icon="arrow-return-left" @click="handleBack">返回</Button>
		    </Col>
		</Row> 
		
		<Table border :columns="columns" :data="body"></Table>

		 <Modal
            v-model="modal"
            title="配置运费"
            @on-ok="handleSave"
            @on-cancel="handleCancel">
            <Form :model="item" :label-width="120">
				<FormItem label="区域" >
				    <Select  v-model="regions" multiple style="width:260px" @on-change="changeRegions">
				        <Option v-for="(item,key) of cityList" :value="item" :key="item">{{ item }}</Option>
				    </Select>             
				</FormItem>

                <FormItem label="基础费用">
                    <Input v-model="item.amount" placeholder="基础费用"></Input>                
                </FormItem> 

                <FormItem label="首重">
                    <Input v-model="item.firstweight" placeholder="首重"></Input>                
                </FormItem> 

                <FormItem label="首费">
                    <Input v-model="item.firstamount" placeholder="首费"></Input>                
                </FormItem> 

                <FormItem label="续重">
                    <Input v-model="item.secondweight" placeholder="续重"></Input>                
                </FormItem> 

                <FormItem label="续费">
                    <Input v-model="item.secondamount" placeholder="续费"></Input>                
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
				modal: false,
				body: [],
				item: {},
				regions: [],
				cityList: [],
                modal10: [],
				columns: [
					{ title: '序号', type: 'index',width: 80,align: 'center' }, 
					{ title: '国家', key: 'regions' },
					{ title: '基础费用', key: 'amount' },
					{ title: '首重', key: 'firstweight' },
					{ title: '首费', key: 'firstamount' },
					{ title: '续重', key: 'secondweight' },
					{ title: '续费', key: 'secondamount' },
					{ 
						title: '操作', 
						key: 'operations', 
						width: 220,
						align: 'center',
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
						                    this.getId(params.row.id);
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
						                        Util.ajax.post('/api/admin/shipping/fare/remove',{
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
					}
				]
			}
		},
		methods: {
			loadData() {
				Util.ajax.post('/api/admin/shipping/fare/query',{
					shippingid:  this.$route.params.shipping_id
				}).then((res) => {
					this.body =  res.data.body;
				})
			},

			loadRegions() {
				Util.ajax.post('/api/region/lite',{

				}).then((res) => {
					this.cityList = res.data.body;
				})
			},

			handleBack() {
				window.history.back();
			},

			getId(id) {
				Util.ajax.post('/api/admin/shipping/fare/get',{
					id:  id
				}).then((res) => {
					this.item =  res.data.body;
					this.regions = JSON.parse(this.item.regions);
				})
			},
			handleSave() {				
				Util.ajax.post('/api/admin/shipping/fare/save',{
					id: this.item.id,
					shippingid:  this.$route.params.shipping_id,
					regions: JSON.stringify(this.regions),
					amount: this.item.amount,
					firstamount: this.item.firstamount,
					firstweight: this.item.firstweight,
					secondamount: this.item.secondamount,
					secondweight: this.item.secondweight
				}).then((res) => {
					this.loadData();
				})
			},
			handleCancel () {

			},
			changeRegions (item) {				
				this.regions = item;
			},
			handleAdd () {
				this.modal = true;
				this.item = {};		
				this.regions = [];		
			}
		},
		created () {
			this.loadData();
			this.loadRegions();
		}	
	}
</script>