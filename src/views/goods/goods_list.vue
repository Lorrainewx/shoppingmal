<template>
    <Card>
        <p slot="title" style="padding-left: 5px;">
            {{ $route.meta.title }}
        </p>
       <Row>
            <Col span="18">
                <Select v-model="body.categoryid" style="width:180px" @on-change="changecategoryid" placeholder="分类筛选">
                    <Option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }}</Option>
                </Select>
                <label for="">关键字</label>
                <Input v-model="keyword" :value="keyword" @on-keyup.enter="loadData" placeholder="" style="width: 180px"></Input>
                <Button type="ghost" icon="android-cancel"  :disabled="keyword==''" @click="keyword='';loadData();">取消查询</Button>
                <Button type="primary" icon="ios-search" @click="loadData">查询</Button>
                <Button type="info" icon="refresh" @click="keyword='';loadData();">刷新</Button>
            </Col>
            <Col span="6" style="text-align: right;">
                <Button type="info" icon="plus-circled" @click="add_new_goods">添加新商品</Button>
                <Button type="success" icon="arrow-return-left" @click="handleBack">返回</Button>
            </Col>
       </Row> 

        <Table border :columns="columns" :data="body.items"></Table>
       
        <Page :page-size="body.size" :total="body.total" show-sizer show-elevator show-total  @on-change="changePageIndex" @on-page-size-change="changePageSize"></Page>
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
                categories: [],//所有类别
                kind : 'all',
                keyword: '',
                spinShow: true,
                columns: [
                    { title: '序号', type: 'index',width: 80,align: 'center' }, 
                    { title: '商品名称', key: 'name',width: 300 },
                    { title: '价格', key: 'price' , render: (h, params) => { return h('div','¥' + params.row.price) } }, 
                    { title: '总库存', key: 'totalstock' }, 
                    { title: '销量', key: 'totalsales' }, 
                    { title: '浏览次数', key: 'totalview' }, 
                    { title: '评价次数', key: 'totalrates' },                    
                    // {   
                    //     title: '上架', 
                    //     key: 'createtime',
                    //     render: (h, params) => { 
                    //         var str = params.row.createtime;
                    //         str = str.replace(/-/g,'/'); // 将-替换成/，因为下面这个构造函数只支持/分隔的日期字符串
                    //         var timechuo = new Date(str);
                    //         console.log(timechuo);
                    //         return h('div', timechuo <= Date.parse(new Date()) ? '已上架' : '未上架') 
                    //     }  
                    // },  
                    {
                        title: '操作', 
                        key: 'goods_operations',
                        align: 'center',
                        width: 200,
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
                                            let argu = {goods_id: params.row.id};                                                                       
                                            this.$router.push({
                                                name: 'manage-goods-edit',
                                                params: argu
                                            }); 
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
                                                Util.ajax.post('/api/admin/goods/remove',{
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
                    },

                ],
                body: { keyword:'',page: 1, size: 20 }
            }
        },
        methods: {
            loadData() {
                Util.ajax.post('/api/goods/query',{
                    keyword: this.keyword,
                    page: this.body.page,
                    size: this.body.size,
                    categoryid: this.body.categoryid,
                }).then((res) => {                 
                    this.spinShow = false;
                    this.body = res.data;                    
                })
            },
            changePageIndex(event) {
                this.body.page = event;
                this.loadData();
            },
            changePageSize(event) {
                this.body.size = event;
                this.loadData();
            },
            add_new_goods() {
                this.$router.push({
                    name: 'manage-goods-add'                   
                }); 
            },
            changecategoryid(e) {
                /*console.log('change categoryid:' + this.body.categoryid);  */               
            },
            loadCategory() {
                Util.ajax.post('/api/category/tree',{

                }).then((res) => {
                    this.categories = res.data.body;
                })
            },
            handleBack() {
                window.history.back();
            },

        },
        // beforeRouteLeave(to, from, next) {
        //     // 设置下一个路由的 meta
        //     to.meta.keepAlive = false; // 让 A 缓存，即不刷新
        //     next();
        // },
        created: function() {
            this.loadData();
            this.loadCategory();
        }
    }
</script>