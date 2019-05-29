<template>
    <Card>
        <p slot="title" style="padding-left: 5px;">
            {{ $route.meta.title }}
        </p>

         <Row>
            <Col span="16">                
                <label for="">请输入商品名称</label>
                <Input v-model="keyword" :value="keyword" @on-keyup.enter="loadData" placeholder="" style="width: 180px"></Input>
                <Button type="ghost" icon="android-cancel"  :disabled="keyword==''" @click="keyword='';loadData();">取消查询</Button>
                <Button type="primary" icon="ios-search" @click="loadData">查询</Button>
                <Button type="info" icon="refresh" @click="keyword='';loadData();">刷新</Button>
            </Col>
            <Col span="8" style="text-align: right;">
                <Button type="success" icon="arrow-return-left" @click="handleBack">返回</Button>
            </Col>
       </Row>  

       <Table border :columns="columns" :data="body.items"></Table>

       <Page :page-size="body.size" :total="body.total" show-sizer show-elevator show-total  @on-change="changePageIndex" @on-page-size-change="changePageSize"></Page>
        <Modal
           v-model="modal"
           :title="'回复'+ replyer"
           @on-ok="handleReply"
           @on-cancel="handleCancel">
           <Form  :label-width="80">
                <FormItem label="回复内容">
                    <Input v-model="reply" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="输入内容..."></Input>
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

import Util from '../../libs/util'

export default {
    data () {
        return {
            body: {},
            replyid: 0,
            reply: '',//回复内容
            replyer: '',//回复者
            goodscontent: {},
            keyword: '',
            spinShow: true,
            modal: false,
            columns: [
                { title: '序号', type: 'index',width: 80,align: 'center' }, 
                { title: '买家昵称', key: 'usernickname'},
                { title: '商品名称', key: 'goodsname' },                  
                { title: '咨询内容', key: 'content' }, 
                { title: '咨询时间', key: 'createtime' }, 
                { title: '回复状态', key: 'replytime' , render: (h,params) => { return h('div',params.row.replytime == null ? '等待回复' : '已回复' )}}, 
                { title: '回复内容', key: 'replay' , render: (h,params) => { return h('div',params.row.reply == null ? '无内容' :  params.row.reply )}}, 
                {
                    title: '操作',
                    key: 'inquiry',
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
                                        this.modal = true;
                                        this.replyid = params.row.id;
                                        this.replyer = params.row.usernickname;
                                        this.reply = '';                                                                             
                                    }
                                }
                            },'回复'),
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
                                            Util.ajax.post('/api/admin/goodsinquiry/remove',{
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
            Util.ajax.post('/api/admin/goodsinquiry/query',{
                keyword: this.keyword,
                page: this.body.page,
                size: this.body.size,
            }).then((res) => {
                this.body = res.data.body;
                this.spinShow = false;
            })
        },
        handleBack () {
            window.history.back();
        },
        handleReply () {

            Util.ajax.post('/api/admin/goodsinquiry/reply',{
                id: this.replyid,
                reply: this.reply,
            }).then((res) => {
                this.loadData();
            })  
        },
        handleCancel () {

        },
        changePageIndex (event) {
            this.body.page = event;
        },
        changePageSize (event) {
            this.body.size = event;
        },

    },
    // beforeRouteLeave(to, from, next) {
    //         // 设置下一个路由的 meta
    //     to.meta.keepAlive = false; // 让 A 缓存，即不刷新
    //     next();
    // },
    created() {
        this.loadData();
    }
}

</script>