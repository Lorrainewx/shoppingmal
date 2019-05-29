<template>
	<Row :gutter="16">
		<Col span="8">
			<Card :bordered="false">
                <p slot="title">下单总数</p>
				10 人
			</Card>
		</Col>
		<Col span="8">
			<Card :bordered="false">
                <p slot="title">昨日下单数</p>
				2 人
			</Card>
		</Col>
		<Col span="8">
			<Card :bordered="false">
                <p slot="title">今日下单数</p>
				1 人
			</Card>
		</Col>
	</Row>
</template>
<script>
    import Util from '../libs/util';

	export default {
        data() {
            return {
                count: { }
            };
        },
        created () {
            /*Util.ajax.post('/ajax/count').then((response) => {                    
                this.count = response.data;
            });*/
        },
	};
</script>