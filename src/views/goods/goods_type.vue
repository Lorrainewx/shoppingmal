
<template>
    <Card>
        <p slot="title" style="padding-left: 5px;">
            {{ $route.meta.title }}
        </p>
        <Row>
            <Col span="12">
                <Button type="info" icon="plus" @click="handleAdd">增加分类</Button>
            </Col>
            <Col span="12" style="text-align: right;">
                <Button type="info" icon="refresh" @click="loadData();">刷新</Button>
                <Button type="success" icon="arrow-return-left" @click="window.history.back();">返回</Button>
            </Col>
        </Row> 

        <Table border :columns="columns" :data="body"></Table>

        <!-- 编辑 MODAL -->
        <Modal
            v-model="modal"
            :title="category_item.name"
            @on-ok="handleSave"
            @on-cancel="handleCancel">
            <Form :model="category_item" :label-width="120" style="width: 100%;margin: 20px auto 0;background-color: #eee;border-radius: 5px;padding: 20px; min-height: 320px;">
                <FormItem label="分类名称">
                    <Input v-model="category_item.name" placeholder="分类名称"></Input>                
                </FormItem>

                <FormItem label="每页显示个数">
                    <Input v-model="category_item.pagesize" placeholder="每页显示"></Input>  
                    <p>默认为12/页</p>              
                </FormItem>

                <FormItem label="所属分类" v-if="add_status">
                    <Select v-model="category_item.parentid" @on-change="getcateid">        
                        <Option :key="0" :value="0"> 顶级分类 </Option>          
                        <template v-for="category in body">                            
                            <Option :key="category.id" :value="category.id">{{category.name}}</Option>
                        </template>
                    </Select>              
                </FormItem>

                <FormItem label="该分类的属性"> <!-- 顶级分类之后出现 -->
                    <Select v-model="category_item.attributeid" >                  
                        <Option :key="0" :value="0">无属性</Option>
                        <template v-for="attribute in attributes_all" >
                            <Option v-if="attribute.parentid=='0'" :key="attribute.id" :value="attribute.id">{{attribute.name}}</Option>
                        </template>  
                    </Select>
                </FormItem>
            </Form>
        </Modal>

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
                modal: false,
                kind : 'all',
                spinShow: true, 
                body: [],//树形分类
                categories_all: [], //所有分类
                category_item: {parentid: 0},//单个分类
                cate_model: '',//分类 model
                categoryid: '',//选中值
                attributes_all: [],//树形属性
                attribute_item: {id: 0},//单个属性
                attr_model: '',//属性 model
                add_status: false,//增加状态码
                formDrag: {//拖拽属性
                    hasDragged: false,
                    isDragging: false,
                    oldIndex: 0,
                    newIndex: 0,
                    draggingRecord: []
                },  
                columns: [
                    { title: '序号', type: 'index',width: 80,align: 'center' }, 
                    { title: '分类名称', key: 'name' ,
                        render: (h,params) => {
                            return h('div',params.row.name.split('├')[0] == '' ? [
                                h('strong',params.row.name)
                            ] : params.row.name.split('└')[0] == '' ? [
                                h('strong', params.row.name)
                            ]:  [h('span', params.row.name)])
                        }
                    }, {
                        title: '移动',
                        key: 'goods_sortby',
                        align: 'center',
                        width: 240,
                        render: (h,params) => {
                            return h('div',[
                                h('Button',{
                                    props: {
                                        type: 'ghost',
                                        icon: 'arrow-up-a'                                        
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click : () => {
                                            //console.log("上移操作");
                                            //上移 sortby -1
                                            Util.ajax.post('/api/admin/category/sortby', {
                                                sortby: -1,                    
                                                id: params.row.id              
                                            }).then((res) => {                           
                                                this.categories_all = res.data.body;      
                                                this.loadData();  
                                                alert('排序成功！');                                              
                                            }).catch((res) => {                                                
                                                alert('处于此级的最高级，无法上移！');
                                            });
                                        }
                                    }
                                },'上移'),
                                h('Button',{
                                    props: {
                                        type: 'ghost',
                                        icon: 'arrow-down-a'  
                                    },                                    
                                    on: {
                                        click : () => {
                                            //console.log("下移操作");
                                            //下移 sortby  +1
                                            Util.ajax.post('/api/admin/category/sortby', {
                                                sortby: 1,                    
                                                id: params.row.id               
                                            }).then((res) => {                           
                                                this.categories_all = res.data.body;  
                                                this.loadData();  
                                                alert('排序成功！');                                                 
                                            }).catch((res) => {                                                 
                                                 alert('处于此级的最低级，无法下移！');
                                            });
                                        }
                                    }
                                },'下移')
                            ])
                        }
                    },                    
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
                                            this.modal = true;     
                                            this.add_status = false;                                       
                                            this.getcate_name(params.row.id);//得到该分类的信息                                            
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
                                                Util.ajax.post('/api/admin/category/remove',{
                                                    id: params.row.id,
                                                }).then((res) => {
                                                    this.loadData(); // 树形分类加载？？？？？？  两次..................................................
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
                
            }
        },
        methods: {
            loadData() {
                Util.ajax.post('/api/category/tree',{                   
                }).then((res) => {   
                        if(res.data.code == 0){                
                        this.spinShow = false;
                        this.body = res.data.body;   
                    }           
                })
            },
            loadCategory_all() {
                Util.ajax.post('/api/category',{                   
                }).then((res) => {  
                    if(res.data.code == 0){                 
                        this.spinShow = false;
                        this.categories_all = res.data.body;
                    }                  
                })
            },
            loadAttribute_tall() {
                Util.ajax.post('/api/attribute',{                   
                }).then((res) => {  
                    if(res.data.code == 0){                 
                        this.attributes_all = res.data.body;
                    }                  
                })
            },
            getcate_name (id) {
                Util.ajax.post('/api/admin/category/get',{     
                    id: id              
                }).then((res) => {  
                    if(res.data.code == 0){                 
                        this.spinShow = false;
                        this.category_item = res.data.body;
                        // 属性成功拿到之后
                        //console.log(this.category_item);
                        if(this.category_item.attributeid == 0) {
                            this.attribute_item.id = 0;
                            //console.log(this.attributeid.id);
                        }
                        else if(this.category_item.attributeid != 0) { //去除无属性的分类
                            Util.ajax.post('/api/admin/attribute/get',{     
                                id: this.category_item.attributeid,             
                            }).then((res) => {  
                                if(res.data.code == 0){                 
                                    this.spinShow = false;
                                    this.attribute_item = res.data.body;
                                }                  
                            })
                        }
                        
                    }                  
                })
            },
            changePageIndex() {

            },
            changePageSize() {

            },
            getcateid(e) {
                if(this.category_item.parentid != 0) { //取该分类下的所属属性名 和 属性id                    
                    for(var i in this.categories_all) {
                        if(this.categories_all[i].id == parseInt(this.category_item.parentid)) {
                            this.category_item.attributeid = this.categories_all[i].attributeid;
                            for(var j in this.attributes_all) {
                                if(this.attributes_all[j].id == this.categories_all[i].attributeid) {
                                    this.attribute_item = this.attributes_all[j];
                                }
                            }
                        }
                    }                    
                    
                }
                console.log(this.category_item.parentid);
            },
            ok () {
                this.$Message.info('Clicked ok');
            },
            cancel () {
                this.$Message.info('点击了取消按钮');
            },
            handleSave () {
                //分类保存
                Util.ajax.post('/api/admin/category/save',{     
                    id: this.category_item.id ,
                    parentid: parseInt(this.category_item.parentid),
                    attributeid: this.category_item.attributeid,
                    name: this.category_item.name,
                    alias: this.category_item.alias,
                    images: this.category_item.images,    
                    pagesize: this.category_item.pagesize, 
                }).then((res) => {                    
                    this.loadData();                           
                }) 
            },
            handleCancel () {

            },
            handleAdd () {   
                this.modal = true;             
                this.add_status = true;     
            },           
        },
       // beforeRouteLeave(to, from, next) {
            // 设置下一个路由的 meta
            // to.meta.keepAlive = false; // 让 A 缓存，即不刷新
            // next();
        //},
        created: function() {
            this.loadData();
            this.loadCategory_all();
            this.loadAttribute_tall();
        },       
    }
</script>