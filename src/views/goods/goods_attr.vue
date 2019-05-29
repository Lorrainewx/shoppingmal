<template>
    <Card>
        <p slot="title" style="padding-left: 5px;">
            {{ $route.meta.title }}
        </p>
       <Row>
            <Col span="12">
                <Button type="info" icon="plus" @click="handleAdd">增加属性</Button>
            </Col>
            <Col span="12" style="text-align: right;">
                <Button type="info" icon="refresh" @click="loadTreeData();">刷新</Button>
                <Button type="success" icon="arrow-return-left" @click="handleBack">返回</Button>
            </Col>
       </Row> 

        <Table border :columns="columns" :data="attributes_tree"></Table>

       <!--  <DragableTable 
            v-model="attributes_all" 
            :columns-list="columns" 
            @on-start="handleOnstart" 
            @on-end="handleOnend" 
        ></DragableTable> -->

        <!-- 编辑 MODAL -->
        <Modal
            v-model="modal"
            :title="attribute_item.name"
            @on-ok="handleSave"
            @on-cancel="handleCancel">
            <Form :model="attribute_item" :label-width="120" style="width: 100%;margin: 20px auto 0;background-color: #eee;border-radius: 5px;padding: 20px; min-height: 320px;">
                <FormItem label="属性名称">
                    <Input v-model="attribute_item.name" placeholder="属性名称"></Input>                
                </FormItem>     

                <FormItem label="所属父级" v-if="add_status">
                    <Select v-model="attribute_item.parentid" @on-change="getcateid">
                        <Option :key="0" :value="0">顶级属性</Option>                                     
                        <template v-for="attribute in attributes_tree">
                            <Option :key="attribute.id" :value="attribute.id">
                                {{ attribute.name }}
                                
                            </Option>
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
    // import DragableTable from './component/canDragableTable.vue';

    export default {
        // components: {
        //     DragableTable
        // },
        data () {
            return {            
                modal: false,
                kind : 'all',
                spinShow: true, 
                attributes_all: [],// 总属性
                attributes_tree: [],
                attribute_item: {parentid: 0},//单个分类
                attributeid: '',//选中值
                add_status: false,//所属上级开关
                formDrag: {//拖拽属性
                    hasDragged: false,
                    isDragging: false,
                    oldIndex: 0,
                    newIndex: 0,
                    draggingRecord: []
                },  
                columns: [
                    { title: '序号', type: 'index',width: 80,align: 'center' }, 
                    { 
                        title: '属性名称', 
                        key: 'name' ,
                        render: (h,params) => {
                            return h('div',params.row.name.split('├')[0] == '' ? [
                                h('strong',params.row.name)
                            ] : params.row.name.split('└')[0] == '' ? [
                                h('strong', params.row.name)
                            ]:  [h('span', params.row.name)])
                        }
                       
                    },  
                    {
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
                                            Util.ajax.post('/api/admin/attribute/sortby', {
                                                sortby: -1,                    
                                                id: params.row.id              
                                            }).then((res) => {                           
                                                this.attributes_all = res.data.body;      
                                                this.loadTreeData();  
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
                                            Util.ajax.post('/api/admin/attribute/sortby', {
                                                sortby: 1,                    
                                                id: params.row.id               
                                            }).then((res) => {                           
                                                this.attributes_all = res.data.body;  
                                                this.loadTreeData();  
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
                                            this.add_status = false;//非增加状态                                    
                                            this.getcate_name(params.row.id);
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
                                                Util.ajax.post('/api/admin/attribute/remove',{
                                                    id: params.row.id,
                                                }).then((res) => {
                                                    this.loadTreeData();
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
                Util.ajax.post('/api/attribute',{                   
                }).then((res) => {   
                    if(res.data.code == 0){             
                        this.attributes_all = res.data.body;   
                    }           
                })
            },
            loadTreeData() {
                Util.ajax.post('/api/attribute/tree',{                   
                }).then((res) => {   
                    if(res.data.code == 0){                
                        this.spinShow = false;
                        this.attributes_tree = res.data.body;   
                    }           
                })                
            },
            getcate_name (id) {
                Util.ajax.post('/api/admin/attribute/get',{     
                    id: id              
                }).then((res) => {  
                    if(res.data.code == 0){                 
                        this.spinShow = false;
                        this.attribute_item = res.data.body;
                    }                  
                })
            },
            changePageIndex() {

            },
            changePageSize() {

            },
            getcateid(e) {
                //console.log(this.attribute_item.parentid);
            },
            ok () {
                this.$Message.info('Clicked ok');
            },
            cancel () {
                this.$Message.info('点击了取消按钮');
            },
            handleSave () {
                Util.ajax.post('/api/admin/attribute/save',{     
                    id: this.attribute_item.id ,
                    parentid: parseInt(this.attribute_item.parentid),
                    name: this.attribute_item.name,           
                }).then((res) => {                    
                    this.loadTreeData();    
                    this.loadData();                           
                }) 
            },
            handleCancel () {

            },
            handleAdd () {   
                this.modal = true;             
                this.add_status = true;
                this.attribute_item = {};    
                this.attribute_item.parentid = 0;            
            },
            handleBack() {
                window.history.back();
            },
            //拖拽排序
            // handleOnstart (from) {
            //     this.formDrag.oldIndex = from;
            //     this.formDrag.hasDragged = true;
            //     this.formDrag.isDragging = true;              
            // },
            // handleOnend (e) {
            //     this.formDrag.isDragging = false;
            //     this.formDrag.draggingRecord.unshift({
            //         from: e.from + 1,
            //         to: e.to + 1
            //     });      

               
            //     Util.ajax.post('/api/admin/attribute/sortby', {
            //         sortby: this.categories_all[e.to].sortby,                    
            //         id: this.categories_all[e.to].id                
            //     }).then((res) => {                           
            //         this.categories_all = res.data.body;      
            //     }); 
            // },    

        },
        created: function() {
            this.loadData();
            this.loadTreeData();
        },       
    }
</script>