<template>
    <Card>
    	<p slot="title" style="padding-left: 5px;">
    	    {{ $route.meta.title }}
    	</p>

    	<Table border :columns="columns" :data="shipping_kinds"></Table>

   </Card>
</template>

<script>
	import Util from '../../libs/util';
	export default {
		data () {
			return {
				shipping_kinds: [],
				columns: [
					{ title: '序号', type: 'index',width: 80,align: 'center' }, 
					{ title: '配送方式', key: 'name' }, 
					{ 
						title: '操作', 
						key: 'operations',
						render: (h,params) => {
							return h('div',[
								 h('Button', {
					                props: {
					                    type: 'primary',
					                },				               
					                on: {
					                    click: () => {                                                                           
					                        let argu = {shipping_id: params.row.id};                                                                       
					                        this.$router.push({
					                            name: 'manage-shipping-detail',
					                            params: argu
					                        }); 
					                    }
					                }
					            }, '配置')				            
							])
						}
					},
				]
			}			
		},
		methods: {
			loadData() {
				Util.ajax.post('/api/config/shipping',{					
					
				}).then((res) => {
					if(res.data.code == 0) {								
						this.shipping_kinds = res.data.body;
					}
				})
			},    
		},
		created () {
			this.loadData();
		}		        
	}
	</script>