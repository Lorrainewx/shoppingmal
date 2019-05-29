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
        </Row>

		<Card :bordered="false">
            <p slot="title">一级地区</p>
            <Table border :columns="columns" :data="body"></Table>
        </Card>  


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
		    	body: [],
		    	spinShow: true,
		    	columns: [
		    		{ title: '序号', type:'index', width: 80, textAlign: 'center' },
		    		{ title: '区名', key: 'name'},		
		    	]
		    }
		},
		methods: {
			loadData() {
				Util.ajax.post('/api/region',{

				}).then((res) => {
					this.spinShow = false;
	    			this.body = res.data.body;
	    		})
			},
			handleBack () {
				window.history.back();
			},
		},
		created() {
			this.loadData();
		}
	}

</script>