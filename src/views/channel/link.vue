<template>
    <Card>
        <p slot="title" style="padding-left: 5px;">
            {{ $route.meta.title }}
        </p>

        <Row>          
            <Col span="12">
            	<Button type="info" icon="plus" @click="handleAdd">增加类型</Button>  
		    </Col>
		    <Col span="12" :style="{textAlign: 'right'}">
            	<Button type="info" icon="refresh" @click="loadData">刷新</Button>  
		    	<Button type="success" icon="arrow-return-left" @click="handleBack">返回</Button> 
			</Col>
		</Row>

		<Table border :columns="columns" :data="body"></Table>

	</Card>
</template>

<script>
	import Util from '../../libs/util';
	import Upload from '../../libs/upload'

 	export default {
        data () {
            return {
            	body: [],
            	columns: [
            		{ title: '序号', type: 'index' , width: 80, align: 'center' },
            		{ title: '类型', key: 'unique' },
            		{ title: '图片', key: 'image' , render: (h,params) => {
            			return h('div',[
            				h('img',{
            					attrs: {
            						src: Upload + params.row.image
            					},
            					style: {
            						width: '100px'
            					}
            				})
            			])
            		} },
            		{
            			title: '操作',
            			key: 'operations',
            			width: 200,
            			align: 'center',
            			render: (h,params) => {
            				return h('div',[
            					h('Button',{
            					    props: {
            					        type: 'primary',
            					        /*disabled: params.row.replytime == null ? false : true,*/
            					    },
            					    style: {
            					        marginRight: '5px',
            					    },
            					    on: {
            					        click: () => {                                                                                                
            					            let argu = {link_id: params.row.id};                                                                       
            					            this.$router.push({
            					                name: 'manage-link-edit',
            					                params: argu
            					            });                                                                       
            					        }
            					    }
            					},'编辑'),
            					h('Poptip', {
            					        props: {
            					            refs: String,
            					            confirm: true,
            					            title: '您确定要删除这条数据吗?',
            					            transfer: true
            					        },
            					        on: {
            					            'on-ok': () => { 
            					                //console.log(params.row.id) 
            					                Util.ajax.post('/api/admin/link/remove',{
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

            	]
            }
        },
        methods: {
        	loadData() {
        		Util.ajax.post('/api/admin/link/query',{

        		}).then((res) => {
        			this.body = res.data.body;
        		})
        	},
        	handleBack() {
        		window.history.back();
        	},
        	handleAdd () {
        		this.$router.push({
        			name: "manage-link-add"
        		})
        	},
        },
        created () {
        	this.loadData();
        }
    }
</script>


