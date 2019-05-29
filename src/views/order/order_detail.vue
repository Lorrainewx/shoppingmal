<style>
    #print-content .ivu-col.ivu-col-span-5,
    #print-content .ivu-col.ivu-col-span-7  {
        line-height: 45px;
        height: 45px;
    }
    #print-content .ivu-col.ivu-col-span-5 {
        border-right: none;
    }
    /* table Style */
    .print-content table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 20px;
    }
    .print-content table th,
    .print-content table td {
        border: 1px solid #ccc;
        padding: 5px;
        text-align: left;
    }
    .print-content table th {
        text-align: center;
        font-size: 20px;
    }
</style>
<template>
    <Card>
        <p slot="title">
            {{ $route.meta.title }} <Icon type="ios-arrow-forward"></Icon>  买家：{{ body.name }}
        </p>

        <Row :style="{marginBottom: '20px'}">          
            <Col span="24" style="text-align: right;">              
                <!-- <Button type="info" icon="print" @click="handlePrint">订单打印</Button> -->
                <Button type="info" icon="refresh" @click="keyword='';loadData();">刷新</Button>
                <Button type="success" icon="arrow-return-left" @click="handleBack">返回</Button>
            </Col>
        </Row> 

        <!-- 详细数据 -->          
        <div id="print-content" class="print-content">                 
            <table>
                <tr>
                    <th colspan="4">收件人基本信息</th>
                </tr>
                <tr>
                    <td width="15%"><strong>收件人</strong></td>
                    <td width="35%">{{ body.name }}</td>
                    <td width="20%"><strong>会员邮箱</strong></td>
                    <td width="30%">{{ body.email }}</td>
                   
                </tr>
                <tr>
                    <td width="15%"><strong>收件人电话</strong></td>
                    <td width="35%">{{ body.phone }}</td>
                    <td width="15%"><strong>收件人手机</strong></td>
                    <td width="35%">{{ body.mobile }}</td>
                </tr>
                <tr>
                    <td width="15%"><strong>收件人地址</strong></td>
                    <td width="35%">{{ body.country }} , {{body.province}}, {{ body.city }} , {{ body.address }}</td>
                    <td width="15%"><strong>邮编</strong></td>
                    <td width="35%">{{ body.postcode }}</td>                  
                </tr>

                <tr>
                    <th colspan="24">订单基本信息</th>
                </tr>
                <tr>
                    <td width="15%"><strong>订单状态</strong></td>
                    <td width="35%"><template v-for="(value,key) in body.orderstatus"> <span v-if="key != 'id' && key != 'shortname' && key != 'alias'">{{ value }} </span> </template></td>  
                    <td width="15%"><strong>订单下单时间</strong></td>
                    <td width="35%">{{ body.confirmtime   }}</td>    
                    <!-- <td width="15%"><strong>物流</strong></td>
                                        <td width="35%">{{ body.shippingid  }}</td>  -->                    
                </tr>
              <!--   <tr>
                    <td width="15%"><strong>订单支付时间</strong></td>
                    <td width="35%">{{ body.paymenttime   }}</td>
                    <td width="15%"><strong>订单发货时间</strong></td>
                    <td width="35%">{{ body.shippingtime  }}</td>
                </tr> -->
               <!--  <tr>
                    
                   <td width="15%"><strong>订单发货时间</strong></td>
                   <td width="35%">{{ body.ratetime }}</td>
                   
               </tr> -->
            </table>

            <table>
                 <tr>
                    <th colspan="24">订单详细信息</th>
                </tr>
                <tr >
                    <td>商品名称</td>
                    <td>商品图片</td>
                    <td>商品规格名称</td>
                    <td>单价</td>
                    <td>数量</td>
                    <td>重量</td>
                    <td>总价</td>                    
                </tr>
                <tr v-for="detail in body.orderdetails">                                       
                    <td>{{ detail.goodsname }}</td>
                    <td><img :src="UploadSrc + detail.image" alt="" :style="{width: '50px'}"></td>
                    <td>
                        <span>{{ getAttributeDetail(detail.goodsid,detail.goodsattributeid) }}</span>
                    </td>                                          
                    <td>{{ detail.price }}</td>     
                    <td>{{ detail.qty }}</td>                       
                    <td>{{ detail.weight }}</td>                       
                    <td>{{ detail.subtotal }}</td>                      
                </tr>
            </table>


           <!--  <table v-if="csvDetailData != null">
                <template v-for="group in csvDetailData.groups">
                    <tr>
                        <td colspan="4" style="text-align: center;">
                            <strong>{{ group.name }}</strong><br />
                            {{ group.description }}
                        </td>
                    </tr>
                    <tr v-for="columns in groupWhere(group.id)">
                        <template v-for="column in columns" v-if="column != null">
                            <th width="20%">{{ column.name }}</th>
                            <td width="30%">{{ csvDetailData.data['f' + column.id] }}</td>
                        </template>
                    </tr>
                </template>
            </table> -->

            <Row :style="{margin: '20px auto'}">          
                <Col span="24" style="text-align: right;">              
                    <!-- <Button type="info" icon="print" @click="handlePrint">订单打印</Button> -->
                    
                        <h3>总重量： {{ body.totalweight }}</h3>
                        <h3>运费： {{ body.shippingfee }}</h3>
                   
                        <h3>总数量： {{ body.totalqty }}</h3>
                        <h3>总金额：{{ config_root.premoneysymbol }} {{ body.totalamount }} {{ config_root.posmoneysymbol }} </h3>

                    
                </Col>
            </Row> 
           
        </div>
        <div class="caozuo">
            <Card :bordered="false">
                <p slot="title">可执行操作 <span v-if="body.status != '101' && body.status != '100'">：无</span> </p>
                <div>
                    <p :style="{marginBottom: '20px'}">该订单状态：<template v-for="(value,key) in body.orderstatus" v-if="key=='alias'">{{value}}</template></p>                          
                   
                    <Input v-model="body.shippingnumber" placeholder="配送单号" v-if="body.status == '101'" style="width: 300px"></Input>
                    <Button type="primary" @click="delivery" v-if="body.status == '101'">发货</Button>      <!-- 订单已付款的情况下101 操作 -->           
                    
                    <p v-if="body.status == '102'" style="font-size: 16px;">配送编号：{{body.shippingnumber}}</p> <!-- 订单已发货的订单编号 -->


                    <Button type="error" @click="cancelorder" v-if="body.status == '100'">取消订单</Button>    <!-- 订单未付款的状态下100 操作 -->    

                    <Alert type="success" show-icon closable v-if="delivery_success">
                        操作成功
                        <span slot="desc">订单已发货！</span>
                    </Alert>
                    <Alert type="warning" show-icon closable  v-if="delivery_warning">
                        警告提示
                        <template slot="desc">未付款，订单无法发货！</template>
                    </Alert>
                    <Alert type="error" show-icon  v-if="delivery_error">
                        提示
                        <span slot="desc">已发货！</span>
                    </Alert>
                    


                    <Alert type="success" show-icon closable v-if="ordercancel_success">
                        操作成功
                        <span slot="desc">订单已取消！</span>
                    </Alert>
                    <Alert type="warning" show-icon closable  v-if="ordercancel_warning">
                        警告提示
                        <template slot="desc">已付款，订单不可取消！</template>
                    </Alert>
                    <Alert type="error" closable  v-if="ordercancel_error">
                        提示
                        <span slot="desc">已取消！</span>
                    </Alert>

                </div>
            </Card>
        </div>
        

        <Spin fix v-if="spinShow">
            <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
            <div>数据加载中...</div>
        </Spin>
    </Card>
</template>

<script>
	import Util from '../../libs/util';
    import Upload from '../../libs/upload';
	export default{
		data () {
			return {
				body: {},
				spinShow: true,

                UploadSrc: Upload,
                //几种操作 弹出框                
                //发货
                delivery_warning: false,
                delivery_success: false,
                delivery_error: false,
                //取消订单
                ordercancel_warning: false,
                ordercancel_success: false,
                ordercancel_error: false,

                config_root: {},
                goods_info: [],

                attributes: [],
                //goods_attribute_info: {},                
			}
		},
		methods: {
			loadData() {
				Util.ajax.post('/api/admin/order/get',{
                    id:  this.$route.params.order_id
                }).then((res) => {    
                	if(res.data.code == 0) {
                		this.body = res.data.body;
                		this.spinShow = false;    
                	}
                })
                /*orderdetails字段信息里 根据会员购买商品时的goodsid 来获取商品的详细信息
                再根据goodsattributeid 来获取商品属性（商品规格信息）
                再进行for循环 通过goodsattributeid 在 商品详细信息中找到指定的商品属性信息*/

			},
            loadConfig () {
                Util.ajax.post('/api/config',{

                }).then((res) => {
                    this.config_root = res.data.body;
                })
            },

            loadAttribute() {   
                Util.ajax.post('/api/attribute',{                    
                }).then((res) => {  
                    this.attributes = res.data.body;//总属性
                })
            },
            getAttributeDetail(goodsid,goodsattributeid) {
                console.log(goodsid,goodsattributeid);
                var goods_attr_detail = [],
                    goods_sku = {},
                    goods_attr_name = "",
                    _this = this;

                /*$.ajax('/api/goods/get',{
                    id: goodsid
                }).then((res) => {
                    goods_attr_detail = res.data.body.goodsattributes;//商品属性详细信息
                    goods_attr_name = "";
                    this.goods_info = [];
                    for(var j in goods_attr_detail) {
                        if(goodsattributeid == goods_attr_detail[j].id) {//找到该商品规格的详细信息

                            //找到属性详细信息之后 再找属性编码                                        
                            goods_sku = goods_attr_detail[j].sku;
                            //找到属性编码之后 根据属性id找名称
                            console.log(goods_sku);
                            for(var k in goods_sku) {
                                console.log(goods_sku[k],k);
                                for(var m in this.attributes) {
                                    if(parseInt(this.attributes[m].id) == parseInt(goods_sku[k])) {
                                        //取出规格名称
                                        goods_attr_name += this.attributes[m].name + '、';
                                    }
                                }
                            }  
                            console.log(goods_attr_name);   
                        }
                    }
                    this.goods_info.push({"name": goods_attr_name});                   
                })*/

                $.ajax({
                    url: '/api/goods/get',
                    type: 'post',
                    async: false,
                    data: {
                        id: goodsid
                    },
                    timeout: 5000,
                    dataType: 'json',
                    success: function(res) {
                        goods_attr_detail = res.body.goodsattributes;//商品属性详细信息
                        
                        for(var j in goods_attr_detail) {
                            if(goodsattributeid == goods_attr_detail[j].id) {//找到该商品规格的详细信息

                                //找到属性详细信息之后 再找属性编码                                        
                                goods_sku = goods_attr_detail[j].sku;
                                //找到属性编码之后 根据属性id找名称
                                goods_attr_name = "";
                                for(var k in goods_sku) {
                                    for(var m in _this.attributes) {
                                        if(parseInt(_this.attributes[m].id) == parseInt(goods_sku[k])) {
                                            //取出规格名称
                                            goods_attr_name += _this.attributes[m].name + '、';
                                        }
                                    }
                                }  
                            }
                        }
                    }
                })
                
               return goods_attr_name;
                
            },
            handlePrint () {

            },
            handleBack() {
                window.history.back();
            },
            /// 100 刚下单  place   待付款  waitpay
            /// 101 已付款  payed   待发货  waitsend
            /// 102 已发货  sended  待收货  waitconfirm
            /// 200 完成  success   待评价  waitrate
            /// 300 取消  cancel
            /// 400 退货  refund
            /// 500 异常  warn
            cancelorder() { 
                //取消订单
                if(this.body.status == 100) {
                     Util.ajax.post('/api/admin/order/status',{
                        id: parseInt(this.$route.params.order_id),
                        status: 'cancel',
                    }).then((res) => {
                        if(res.data.code == 0) { 
                           alert('订单成功取消');
                        }else {
                            alert('无法取消订单') ;
                        }
                        
                    }).catch((res) => { 
                        alert('无法取消订单') ;
                    })
                    
                }else if(this.body.status == 101) { // 付款
                    alert('已付款，不可取消订单');
                    
                }else if(this.body.status == 300) {
                    alert('已取消，请勿重复提交请求');
                }else {
                    alert('订单无法取消');
                }
            },           
            delivery() {
                //发货
                if(this.body.status == 101) {
                    Util.ajax.post('/api/admin/order/status',{
                        id: parseInt(this.$route.params.order_id),
                        status: 'shipped',
                        shippingnumber: this.body.shippingnumber,
                    }).then((res) => {                        
                        alert("发货成功！");                                                                       
                        this.loadData();
                    }).catch((res) => {
                        alert('无法完成发货');
                    })
                }else if(this.body.status == 100) { //未付款
                    alert('订单未付款,不可发货');
                }
            },

            shippingnum () {
                if(this.body.status == 102 && this.body.shippingnumber != "") { //发货状态下
                    // Util.ajax.post('/api/admin/order/status',{
                    //     id: parseInt(this.$route.params.order_id),
                    //     status: 'shipped',
                    //     shippingnumber: this.body.shippingnumber,
                    // }).then((res) => {
                        
                    // }).catch((res) => {
                        
                    // }) 
                    
                }
            },
		},
        beforeRouteLeave(to, from, next) {
            // 设置下一个路由的 meta
            to.meta.keepAlive = false; // 让 A 缓存，即不刷新
            next();
        },
		created: function() {
            this.loadAttribute();
			this.loadData();
            this.loadConfig();
		}
	}
</script>