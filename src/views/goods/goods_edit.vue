<style>
    .demo-upload-list{display: inline-block;width: 60px;height: 60px;text-align: center;line-height: 60px;border: 1px solid transparent;border-radius: 4px;overflow: hidden;background: #fff;position: relative;box-shadow: 0 1px 1px rgba(0,0,0,.2);margin-right: 4px;}
    .demo-upload-list img{width: 100%;height: 100%;}
    .demo-upload-list-cover{display: none;position: absolute;top: 0;bottom: 0;left: 0;right: 0;background: rgba(0,0,0,.6);}
    .demo-upload-list:hover .demo-upload-list-cover{display: block;}
    .demo-upload-list-cover i{color: #fff;font-size: 20px;cursor: pointer;margin: 0 2px; }
    .node-ele {margin-top: 10px;}
    .node-hidden {display: none;}
    .clearfix {clear: both;content: '';}
    .ivu-input-wrapper {width: 88%;}
</style>

<template>
    <Card>
        <p slot="title">
            {{ $route.meta.title }} <Icon type="ios-arrow-forward"></Icon> {{ body.name }}
        </p>
       <Row >
            <Col span="24" style="text-align: right;">                
                <Button type="info" icon="refresh" @click="refresh">刷新</Button>
               <!--  <Button type="success" icon="arrow-return-left" @click="handleBack">返回</Button> -->
            </Col>
            <Col span="24">
               <!--  <Tabs value="name1" :animated="false">
                    <TabPane label="通用信息" name="name1"> -->
                        <h1>通用信息</h1>
                        <Form :model="body" :label-width="120" style="width: 100%;margin: 20px auto 0;background-color: #eee;border-radius: 5px;padding: 20px; min-height: 320px;">
                            <h3>基本信息</h3>
                            <FormItem label="商品名称">
                              <Input v-model="body.name" placeholder="商品名称"></Input>                
                          </FormItem>                           
                          
                          <FormItem label="贩售价格">
                              <Input v-model="body.price" placeholder="贩售价格"></Input>                
                          </FormItem>
                          <FormItem label="折扣率">
                              <Input v-model="discount" placeholder="折扣率" @on-blur="discountevent"></Input>                
                          </FormItem>

                          <FormItem label="原价">
                              <Input v-model="body.original" placeholder="原价"></Input>                
                          </FormItem>

                          <FormItem label="产品重量">
                              <Input v-model="body.weight" placeholder="产品重量"></Input>                
                          </FormItem>

                          <FormItem label="产品概要">
                              <Input v-model="body.summary" type="textarea" :rows="4" placeholder="产品概要"></Input>                
                          </FormItem>

                          <FormItem label="单位">
                              <Input v-model="body.unit"  placeholder="单位"></Input>                
                          </FormItem> 

                             <h3>SEO优化</h3>     
                            <FormItem label="标题">
                                <Input v-model="body.title" placeholder="标题"></Input>                
                            </FormItem>
                            <FormItem label="关键词">
                                <Input v-model="body.keyword" placeholder="关键词"></Input>                
                            </FormItem>
                            <FormItem label="描述">
                                <Input v-model="body.description" type="textarea" :rows="4" placeholder="描述"></Input>                
                            </FormItem>       

                            <h3>图片</h3>
                            <!-- 上传图片 -->
                            <FormItem label="图片(最大限制2M)">
                                <div class="demo-upload-list" v-for="item in uploadList">
                                    <template v-if="item.status === 'finished'">
                                        <img :src="item.url">
                                        <div class="demo-upload-list-cover">
                                            <Icon type="ios-eye-outline" @click.native="handleView(item.name)"></Icon>
                                            <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                                        </div>
                                    </template>
                                    <template v-else>
                                        <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                                    </template>
                                </div>
                                <Upload
                                    ref="upload"
                                    :show-upload-list="false"
                                    :default-file-list="defaultList"
                                    :on-success="handleSuccess"
                                    :format="['jpg','jpeg','png']"
                                    :max-size="2048"
                                    :on-format-error="handleFormatError"
                                    :on-exceeded-size="handleMaxSize"
                                    :before-upload="handleBeforeUpload"
                                    multiple
                                    type="drag"
                                    :action="UploadSrc + '/api/admin/upload/'"
                                    style="display: inline-block;width:58px;">
                                    <div style="width: 58px;height:58px;line-height: 58px; ">
                                        <Icon type="camera" size="20"></Icon>
                                    </div>
                                </Upload>    
                                <Modal title="预览" v-model="visible">
                                    <img :src="Upload + imgUrl" v-if="visible" style="width: 100%">
                                </Modal>                        
                            </FormItem>

                            <h3>推荐&预售</h3>

                            <Checkbox v-model="body.isbest" style="margin: 20px 0;padding-left: 120px;">
                               <span :style="{fontSize: '16px',margin: '20px auto'}">推荐</span>                                                                 
                            </Checkbox>

                            <Checkbox v-model="body.ispreorder">
                               <span :style="{fontSize: '16px',margin: '20px auto'}">预售</span>                                                                 
                            </Checkbox>
                        </Form>
                   <!--  </TabPane>
                   <TabPane label="详细描述" name="name2"> -->
                    <h1 style="margin-top: 30px">详细描述</h1>
                        <Form :model="body" :label-width="120" style="width: 100%;margin: 20px auto 0;background-color: #eee;border-radius: 5px;padding: 20px; min-height: 450px;">  
                            <FormItem label="产品详细描述">
                                <div class="editor-content">
                                    <froala :tag="'textarea'" :config="config" v-model="body.bodycontent"></froala>                                    
                                </div>
                            </FormItem>                       
                        </Form>
                    <!-- </TabPane>
                    <TabPane label="商品属性" name="name3"> -->
                        <h1 style="margin-top: 30px">商品属性</h1>
                        <Form :model="body" :label-width="80" style="width: 100%;margin: 20px auto 0;background-color: #eee;border-radius: 5px;padding: 20px; min-height: 450px;"> 
                            <FormItem label="商品类型">
                                <Select v-model="body.categoryid" @on-change="getNewData">
                                    <template v-for="category in categories"><Option :value="category.id">{{category.name}}</Option></template>
                                </Select>
                            </FormItem>                        

                
                            <!-- ********* 商品属性存在 *********** --> 
                            <div>
                                <FormItem label="商品属性" id="pro_attr" v-if="goodsattribute_status">
                                    <Row>
                                        <Col span="1">
                                            <span style="float: left; margin-right: 10px;cursor: pointer;font-weight: 700; font-size: 20px;" @click="addAttr_group"> <Icon type="ios-plus-outline"></Icon> </span>
                                        </Col>
                                        <Col span="23">
                                            <template v-for="(attribute,index) in attributes">                                         
                                                <Col span="24" v-if="attribute.id == body.attributeid">
                                                    <template v-for="(attribute_c,index_c) in attributes">                                 
                                                            <div class="node"  v-if="attribute.id == attribute_c.parentid" :style="{width: '100%'}">
                                                                <Row>
                                                                    <!--一级属性-->
                                                                    <Col span="24">
                                                                        <div :style="{width:'100%'}">
                                                                            <label style="float: left;width: 80px;display: inline-block; text-align: right;padding-right: 12px;">{{ attribute_c.name }}</label>
                                                                            <Select style="width: 70%" class="level_F" :data-id="attribute_c.id"  :v-model="attribute.id"> 
                                                                                <template v-for="attribute_s in attributes">
                                                                                    <Option v-if="attribute_c.id == attribute_s.parentid" :data-id="attribute_s.id" :value="attribute_s.id">{{attribute_s.name}}</Option>                  
                                                                                </template>
                                                                            </Select>
                                                                        </div>
                                                                    </Col>                                                      
                                                                </Row>
                                                            </div>
                                                        <!-- </Col> -->
                                                    </template>
                                                </Col>                                      
                                            </template>                                   
                                                                              
                                            <Col span="9" style="margin-top: 10px;">
                                                <FormItem label="组合价格">
                                                   <Input v-model="goodsattribute.price" placeholder="该组合的价格" style="width:120px;"></Input>
                                               </FormItem>
                                            </Col>
                                            <Col span="9" style="margin-top: 10px;">
                                                <FormItem label="组合库存">
                                                   <Input v-model="goodsattribute.stock" placeholder="该组合的库存"  style="width:120px;"></Input> 
                                                </FormItem>
                                            </Col>                                        
                                            <Col span="9" style="margin-top: 10px;">
                                                <FormItem label="组合名称">
                                                   <Input v-model="goodsattribute.name" placeholder="组合名称"  style="width:120px;"></Input>               
                                                </FormItem>

                                            </Col>
                                            <Col span="9" style="margin-top: 10px;">
                                                <Select v-model="goodsattribute.status" style="width:200px" placeholder="组合状态">
                                                    <Option v-for="status in goodsattribute_st" :value="status.value" :key="status.value">{{ status.label }}</Option>
                                                </Select>                                                
                                            </Col>
                                            <Col span="9" style="margin-top: 10px;">
                                                <!-- <FormItem label="商品图片">
                                                    <Input v-model="goodsattribute.name" placeholder="商品图片"  style="width:120px;"></Input>               
                                                </FormItem> -->
                                               <Upload 
                                                :action="UploadSrc + '/api/admin/upload/'" 
                                                :on-success="handleSuccess_attribute">
                                                    <Button type="ghost" icon="ios-cloud-upload-outline">上传图片</Button>
                                                </Upload>
                                            </Col>
                                        </Col>
                                    </Row>
                                </FormItem>                          
                                <!-- 属性存在的话 -->
                                <div class="node-ele" style="padding: 20px;background-color: #fff;" v-if="goodsattribute_status">                     
                                    <!-- 该选择的价格和库存和库存 -->
                                    <template v-for="goodsattribute in this.body.goodsattributes">
                                        <Row v-if="JSON.stringify(goodsattribute.sku) != '{}'" :style="{borderBottom: '1px solid #ddd',padding: '20px 0'}">
                                            <Col span="12">
                                                
                                               <!--  <Poptip
                                                        confirm
                                                        title="确认删除?"
                                                        @on-ok="handelDel_attr"
                                                        @on-cancel="handelCancel"
                                                        :style="{position: 'absolute',top: '-4px',left: 0,display:'inline-block',cursor: 'pointer',padding:'5px'}" > -->
                                                       <Button :id="goodsattribute.id" :style="{position: 'absolute',left: '-5px',top: '2px',padding: '5px'}" type="text" @click="handelDel_attr"><Icon type="android-remove-circle"></Icon></Button>
                                                <!-- </Poptip> -->
                                                <FormItem label="商品组合:" :style="{display:'inline-block',marginLeft: '14px'}">  
                                                    <template v-for="(value,key) in goodsattribute.sku"> 
                                                        <Col span="24">
                                                            <span>
                                                                <template v-for="attribute in attributes">                                          
                                                                        <Col span="7">
                                                                            <label v-if="attribute.id == key">{{ attribute.name }}</label>
                                                                        </Col>
                                                                        <Col span="17">
                                                                            <Input v-if="attribute.id == value" v-model="attribute.name" placeholder="商品组合" disabled></Input>
                                                                        </Col>                                                                   
                                                                </template>
                                                            </span>
                                                        </Col> 
                                                    </template>                                                
                                                </FormItem> 
                                            </Col>
                                            <Col span="12">
                                                <Col span="12">
                                                    <FormItem label="组合价格">
                                                        <Input v-model="goodsattribute.price" placeholder="组合价格" style="width: 80px;"  :class="'input'+goodsattribute.id"></Input>
                                                    </FormItem>
                                                </Col>
                                                <Col span="12">
                                                    <FormItem label="组合库存" >
                                                        <Input v-model="goodsattribute.stock" placeholder="组合库存" style="width: 80px;"  :class="'input'+goodsattribute.id"></Input>
                                                    </FormItem> 
                                                </Col>   
                                                <Col span="12">
                                                    <FormItem label="组合名称">
                                                        <Input v-model="goodsattribute.name" placeholder="组合名称" style="width: 80px;"  :class="'input'+goodsattribute.id"></Input>
                                                    </FormItem>
                                                </Col> 
                                                <Col span="12">
                                                    <Select v-model="goodsattribute.status" style="width:200px" placeholder="组合状态">
                                                        <Option v-for="status in goodsattribute_st" :value="status.value" :key="status.value">{{ status.label }}</Option>
                                                    </Select>  
                                                </Col>      

                                                <Col span="12" :style="{paddingLeft: '20px'}">                                                    
                                                    <Upload 
                                                    :action="UploadSrc + '/api/admin/upload/'" 
                                                    :on-success="handleSuccess_tihuan">
                                                        <Button type="ghost" icon="ios-cloud-upload-outline"  :id="goodsattribute.id + 'imgbtn' " @click="btn_tihuan">替换或添加图片</Button>
                                                    </Upload>
                                                    <img v-if="goodsattribute.image!=''"  :src=" UploadSrc +goodsattribute.image" alt="" :style="{position: 'relative',top: '12px',width: '50px', height: '50px'}">
                                                    <Button v-if="goodsattribute.image!=''" type="error" :id="goodsattribute.id + 'imgremovebtn' " @click="btn_remove" >删除图片</Button>
                                                </Col>   
                                                <!-- <Col span="24" :style="{textAlign: 'left',paddingLeft: '20px'}"> 
                                                       <Button type="primary"  :id="goodsattribute.id" @click="handleEdit">编辑规格信息</Button>
                                                       <Button type="success"  :id="goodsattribute.id+'btn'" @click="editSave">保存</Button>
                                                    </Col>   -->                   
                                            </Col>
                                        </Row>
                                    </template>                                  
                                </div>
                           </div>
                            <!-- ******** 商品属性无 ******** -->
                            <div v-if="!goodsattribute_status">                                
                                <FormItem label="属性价格">
                                    <Input v-model="goodsattribute.price" placeholder="属性价格"></Input>                
                                </FormItem>
                           
                                <FormItem label="商品库存">
                                    <Input v-model="goodsattribute.stock" placeholder="商品库存"></Input>
                                </FormItem>                                    
                            </div>
                        </Form>
                    <!-- </TabPane>                   
                                    </Tabs> -->
                <Col span="24" style="text-align: center; margin-top: 30px;">
                    <Button type="info" @click="handleSave">确认修改</Button>
                    <Button type="ghost" @click="refresh">取消</Button>
                    <Alert type="success" show-icon closable v-if="code_status_success" :style="{textAlign: 'left',marginTop: '10px'}">修改成功！</Alert>
                    <Alert type="error" show-icon closable v-if="code_status_error" :style="{textAlign: 'left',marginTop: '10px'}">{{error_msg}},请重新提交修改！</Alert>
                </Col>
            </Col>
            
       </Row> 

        <Spin fix v-if="spinShow">
            <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
            <div>数据加载中...</div>
        </Spin>        
    </Card>  
</template>
<script>
    import Util from '../../libs/util';
    import Upload from '../../libs/upload';

    export default {
        data () {
            return {
                body: { goods: {} ,goodsattributes: [] },
                UploadSrc: Upload,
                discount: 1, //折扣率
                price: 0,
                categories : [], //树形分类
                categories_all : [], //商品分类总信息
                attributes : [],     //总属性
                attr_F_group: [],               
                group_price: 0,//组合价格                
                goodsattribute: {price:0, sales: 0, stock:0,name: '',status: ''},//单个商商品属性
                goodsattribute_images: [],//子类的图片列表
                goodsattribute_status: true,
                spinShow: true,
                code_status_success: false,//成功状态码
                code_status_error: false,//错误状态吗
                error_msg: '',//错误信息
                config: {
                    imageUploadURL: '/api/admin/upload/froala',
                    imageDefaultWidth: 0,
                    imageInsertButtons: ['imageBack', '|', 'imageUpload', 'imageByURL'],
                    language: 'zh_cn',
                    toolbarButtons: ['undo', 'redo', '|', 'insertImage', 'insertTable', '|', 'bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', '|', 'fontSize', 'color', '|', 'paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', '|', 'specialCharacters', 'selectAll', 'clearFormatting', '|', 'help', 'html'],
                },
                images: [],//大类的图片列表
                
                //图片上传
                defaultList: [],//图片默认列表 （已有图片）
                uploadList:[],//图片上传列表
                imgUrl: '',
                visible: false,   

                xiugaiid: 0,  
                goodsattribute_st: [
                    {
                        value: 'pre-order',
                        label: 'pre-order'
                    },
                    {
                        value: 'in-stock',
                        label: 'in-stock'
                    }                                       
                ]

            }
        },
        methods: {
            loadData() {
                Util.ajax.post('/api/goods/get',{
                    id:  this.$route.params.goods_id
                }).then((res) => {                  
                    this.spinShow = false; 
                    this.body = res.data.body;
                    var goodsattributes = this.body.goodsattributes;
                    var num = 0;//计量个数 无一商品属性 则不显示属性列表
                    for(var i in goodsattributes) {
                        if(JSON.stringify(goodsattributes[i].sku) == '{}' ) {
                            num += 1;                            
                        }           
                    }   
                    
                    //所有商品均无属性
                    if(num == goodsattributes.length) {
                        this.goodsattribute_status = false;
                        if(JSON.stringify(this.body.goodsattributes) != '[]') {
                            this.goodsattribute = this.body.goodsattributes[0];
                        }
                    }                                       

                    if(this.body.images != null) {
                        this.images = JSON.parse(this.body.images);
                        // 初始化  商品图片              
                        for(var i in this.images) {
                            this.uploadList.push({
                                'name' : this.images[i].name,
                                'url': this.UploadSrc + this.images[i].url,
                                'status': 'finished',
                            })
                        }
                    }                   
                })
            },
            FxF(f1, f2) {

                var f1Len, f2Len;

                if(parseInt(f1) == parseFloat(f1))  { //整数
                    f1Len = 0;
                    f2Len = f2.split('.')[1].length;
                }else {
                    f1Len = f1.split('.')[1].length,
                    f2Len = f2.split('.')[1].length;
                }

                if (f1Len != 0) {
                    f1 = f1.replace('.', '');
                    console.log(f1);
                }else {
                    f1 = f1;
                }
                if (f2Len) {
                    f2 = f2.replace('.', '');
                }

                return f1 * f2 / Math.pow(10, f1Len + f2Len);

            },
            discountevent() {       
                 if(this.discount == 1) { //无折扣
                    this.body.price = parseFloat(this.body.original);
                }else {
                    this.body.price = this.FxF(this.body.original, this.discount);                    
                }
            },
            refresh () {
                this.uploadList = [];
                this.loadData();
            },
            getNewData () {  //监听商品类型
                for(var i in this.categories_all) {
                    if(this.categories_all[i].id == this.body.categoryid) {
                        this.body.attributeid = this.categories_all[i].attributeid;
                    }
                }  
                //无属性
                if(this.body.attributeid == 0) {
                    this.goodsattribute_status = false;
                }
                //商品有下级属性
                for(var j in this.attributes) {
                    if((this.attributes[j].parentid == this.body.attributeid) && (this.body.attributeid!=0)) {
                        this.goodsattribute_status = true;//有下级属性值 状态码打开                        
                    }
                }   

                
            },
            handleSave () {//保存函数    
                this.uploadList = [];

                this.code_status_success = false;
                this.code_status_error = false;                
                
                // 总库存计算
                this.body.totalstock = 0;
                for(var i in this.body.goodsattributes) {
                    this.body.totalstock += parseInt(this.body.goodsattributes[i].stock);
                }

                Util.ajax.post('/api/admin/goods/save',{
                    id: this.body.id,
                    categoryid: this.body.categoryid,
                    attributeid: this.body.attributeid,
                    name: this.body.name,
                    title: this.body.title,
                    original: this.body.original,
                    price: this.body.price,
                    createtime: this.body.createtime,
                    deletetime: this.body.deletetime,
                    updatetime: this.body.updatetime,
                    totalstock: this.body.totalstock,
                    unit: this.body.unit,
                    description: this.body.description,
                    summary: this.body.summary,
                    bodycontent: this.body.bodycontent,
                    images: JSON.stringify(this.images),
                    goodsattributes: this.body.goodsattributes,
                    isbest: this.body.isbest,
                    ispreorder: this.body.ispreorder,
                    weight: this.body.weight,
               }).then((res) => {
                    if(res.data.code == 0) {
                        this.code_status_success = true;
                        this.code_status_error = false;
                        this.loadData();
                    }else {
                        this.code_status_success = false;
                        this.code_status_error = true;
                        this.error_msg = res.data.message;
                    }                   
               })               
            },
            loadAttribute() {   
                Util.ajax.post('/api/attribute',{                    
                }).then((res) => {  
                    this.attributes = res.data.body;//总属性
                })
            },
            loadCategory_tree() {
                Util.ajax.post('/api/category/tree',{
                }).then((res) => {
                    if(res.data.code == 0) {
                        this.categories = res.data.body;//树形分类
                    }                    
                })
            },
            loadCategory() {
                Util.ajax.post('/api/category',{                    
                }).then((res) => {
                    if(res.data.code == 0) {
                        this.categories_all = res.data.body;//总分类
                    }                                        
                })
            },
            addAttr_group () {     

                this.xiugaiid = 0;

                var skuattrbutes = {};
                //sku的值拼接字符串                
                var attr_Tag_F = $('.level_F .ivu-select-selected-value');
                this.attr_F_group = [];//每次都得清空
                for(var i=0;i<attr_Tag_F.length;i++) {
                    var html_attr = attr_Tag_F.eq(i).html();
                    var level_id = $('.level_F').eq(i).attr('data-id');
                    // console.log(html_attr);
                    for(var id in this.attributes) {                       
                        if(this.attributes[id].name == html_attr && level_id == this.attributes[id].parentid && html_attr != '') {
                            this.attr_F_group.push(this.attributes[id].id);   
                            var key = this.attributes[id].parentid;
                            skuattrbutes[key] = this.attributes[id].id                        
                        }
                    }
                }

                skuattrbutes = JSON.stringify(skuattrbutes);

                if(skuattrbutes !='{}') {                   
                    Util.ajax.post('/api/admin/goods/save',{
                        id: this.body.id,
                        categoryid: this.body.categoryid,
                        attributeid: this.body.attributeid,
                        name: this.body.name,
                        original: parseFloat(this.body.original),
                        price: parseFloat(this.body.price),
                        goodsattributes: [{
                            skuattrbutes: skuattrbutes, 
                            goodsid: parseInt(this.$route.params.goods_id),
                            price: this.goodsattribute.price,
                            stock: parseInt(this.goodsattribute.stock), 
                            name: this.goodsattribute.name,
                            images: this.goodsattribute.images,
                            status: this.goodsattribute.status
                        }]
                    }).then((res) => {
                        this.loadData();
                    })
                }
            },
            handleView (name) { //视图  
                for(var i in this.images) {
                    if(this.images[i].name == name) {
                        this.imgUrl = this.images[i].url;
                    }
                } 
                console.log(this.UploadSrc + this.imgUrl );
                this.visible = true;
            },
            /* ---------------------------------------- images upload start  ---------------------------------------- */
            handleRemove (file) { //移除图片

                const fileList = this.$refs.upload.fileList;
                this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
                for(var i in this.images) {
                    if(this.UploadSrc +this.images[i].url == file.url) {
                        this.images.splice(i,1) ;
                    }
                }

                //渲染删除
                this.uploadList = [];
                for(var i in this.images) {
                    this.uploadList.push({
                        'name' : this.images[i].name,
                        'url': this.UploadSrc + this.images[i].url,
                        'status': 'finished',
                    })
                }                
            },
            handleSuccess (res, file) {//上传成功
                this.images.push({"name" : file.name,"url": res.url});  
                file.url = this.UploadSrc + res.url;

                //渲染增加图片
                this.uploadList = [];
                for(var i in this.images) {
                    this.uploadList.push({
                        'name' : this.images[i].name,
                        'url': this.UploadSrc + this.images[i].url,
                        'status': 'finished',
                    })
                }
            },
            handleFormatError (file) { //格式错误提示
                this.$Notice.warning({
                    title: '文件格式不正确',
                    desc: '文件 ' + file.name + ' 是不正确的，请选择jpg或png的格式重新上传'
                });
            },
            handleMaxSize (file) { //图片大小限制提示
                this.$Notice.warning({
                    title: '超出文件大小',
                    desc: '文件  ' + file.name + ' 太大，最多不超过2M'
                });
            },
            handleBeforeUpload () { //上传数量的限制提示
                const check = this.uploadList.length < 10;
                if (!check) {
                    this.$Notice.warning({
                        title: '最多上传10张图片'
                    });
                }
                return check;               
            }, 
            /* ---------------------------------------- images upload end ---------------------------------------- */
            handleSuccess_attribute (file) {
                this.goodsattribute.images = JSON.stringify(file);
                this.goodsattribute_images = [];//保持只有一个键值对
                this.goodsattribute_images.push({
                  "name" : file.name,
                  "url": file.url
                })

                this.goodsattribute.images = JSON.stringify(this.goodsattribute_images);

            },
            handleSuccess_tihuan (file) {
              //替换
              this.goodsattribute_images = [];
              this.goodsattribute_images.push({
                "name" : file.name,
                "url" : file.url,
              })

              this.goodsattribute.images = JSON.stringify(this.goodsattribute_images);

              console.log(this.goodsattribute.images);

              if(this.xiugaiid != 0) {
                for(var i in this.body.goodsattributes) {
                    if(this.body.goodsattributes[i].id == this.xiugaiid) {
                        this.body.goodsattributes[i].images = JSON.stringify(this.goodsattribute_images);
                    }
                }
              }
            },
            btn_tihuan (e) {
                var id = 0;
                if($(e.target).attr('id')) {
                    id = parseInt($(e.target).attr('id'));
                } else {
                    id = parseInt($(e.target).parent().attr('id'));
                }
                this.xiugaiid = id;                
            },
            btn_remove (e) {
                var id = 0;
                if($(e.target).attr('id')) {
                    id = parseInt($(e.target).attr('id'));
                    $(e.target).siblings('img').hide();
                } else {
                    id = parseInt($(e.target).parent().attr('id'));
                    $(e.target).parent().siblings('img').hide();
                }

                for(var i in this.body.goodsattributes) {
                    if(this.body.goodsattributes[i].id == id) {
                        this.body.goodsattributes[i].images = null;
                    }
                }
            },
            handleBack () {                
                window.history.back();  
            },
            handelDel_attr (e) { //删除商品属性
                var id = 0;
                if($(e.target).attr('id')) {
                    id = parseInt($(e.target).attr('id'));
                } else {
                    id = parseInt($(e.target).parent().parent().attr('id'));
                }

                Util.ajax.post('/api/admin/goodsattribute/remove',{
                    id: id
                }).then((res)  => {
                    this.loadData();
                })
            },
            handleEdit (e) {
                var id = 0;
                if($(e.target).attr('id')) {
                    id = parseInt($(e.target).attr('id'));
                    
                } else {
                    id = parseInt($(e.target).parent().attr('id'));
                    

                }

               
               $('.input' + id).find('input').removeAttr('disabled');

               $('#imgbtn' + id).removeAttr('disabled');

            },
            editSave (e) {
                var id = 0;
                if($(e.target).attr('id')) {
                    id = parseInt($(e.target).attr('id'));
                } else {
                    id = parseInt($(e.target).parent().attr('id'));
                }

                var array_imgs = [];
                $('.input' + id).find('input').each(function() {                    
                    array_imgs.push($(this).val());
                })

                this.goodsattribute.price = parseFloat(array_imgs[0]);
                this.goodsattribute.stock = parseInt(array_imgs[1]);
                this.goodsattribute.name = array_imgs[2];
                this.goodsattribute.status = array_imgs[3];

                this.goodsattribute.id = id;


                //发送保存请求
               /*---------------------------------------------修改商品规格----------------------------------------------------*/

                $('.input' + id).find('input').css('disabled');

                $('#imgbtn' + id).css('disabled');

                
            },
        },
        // beforeRouteLeave(to, from, next) {
        //     // 设置下一个路由的 meta
        //     to.meta.keepAlive = true; // 让 A 缓存，即不刷新
        //     next();
        // },
        mounted () {
            this.uploadList = this.$refs.upload.fileList;
        },
        created: function() {
            this.loadData();
            this.loadCategory_tree();
            this.loadCategory();
            this.loadAttribute();
        },

    }
</script>