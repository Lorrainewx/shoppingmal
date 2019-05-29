<template>
    <Row type="flex" justify="center">
        <Col span="8"><br><br><br><br><br><br><br>
            <div class="login" @keydown.enter="handleSubmit">
                <div class="login-con">
                    <Card :bordered="false">
                        <p slot="title">
                            <Icon type="log-in"></Icon>
                            欢迎登录
                        </p>
                        <div class="form-con">
                            <Form ref="loginForm" :model="form" :rules="rules">
                                <FormItem label="请输入用户名">
                                    <Input v-model="form.username" placeholder="请输入用户名"></Input>
                                </FormItem>
                                <FormItem label="请输入密码">
                                    <Input type="password" v-model="form.password" placeholder="请输入密码"></Input>
                                </FormItem>                              

                                <FormItem>
                                    <Button @click="handleSubmit" type="primary" long>登录</Button>
                                </FormItem>
                            </Form>

                            <Alert type="success" show-icon v-if="successShow">登陆成功</Alert>

                            <Alert type="error" show-icon v-if="errorShow"> {{ errorInfo }} </Alert>
                        </div>
                    </Card>
                </div>
            </div>
        </Col>
    </Row>
</template>

<script>
import Cookies from 'js-cookie';
import Util from '../libs/util';
import env from '../config/env';

export default {
    data () {
        return {
            form: {
                username: '',
                password: '',
                issuper: false,
            },
            rules: {
                username: [
                    { required: true, message: '用户名不能为空', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '密码不能为空', trigger: 'blur' }
                ]
            },
            errorShow: false,
            successShow: false,
            errorInfo: '',
            smsTimeIndex: 60
        };
    },
    methods: {
        handleSubmit () {
            //验证用户名
     /*       console.log(this.$refs.loginForm.validate)*/
           /* this.$refs.loginForm.validate((valid) => {
                console.log(valid + 1);
                if(valid) {*/
                    Util.ajax.post('/api/admin/login',{
                        username: this.form.username,
                        password: this.form.password
                    }).then((response) => {
                        if(response.data.code == 0) {  //登陆成功      
                            Cookies.set('user_name',this.form.username);    //用户名
                            Cookies.set('user_type',this.form.username == 'admin' ? 'admin' : 'answer'); //管理员 or回答者
                            this.successShow = true;
                            this.errorShow = false;                           
                            location.href = env === 'development' ? '/' : '/hzradmin';
                        }else {
                            console.log(response.data.message);
                            this.errorShow = true;
                            this.successShow = false;
                            this.errorInfo = response.data.message;
                        }
                    });   
                /*}*/
            /*})*/
        },
        getVal () {
            console.log(this.form.username);
        },
        handleSms () {
            var _vm = this;

            Util.ajax.post('/ajax/sms',{
                username: this.form.username
            }).then((response) => {
                if(response.data.code == 0) {
                    _vm.smsTimer(60);
                } else {
                    this.errorShow = true;
                    this.successShow = false;
                    this.errorInfo = response.data.message;
                }
            });
        },
        smsTimer (index) {
            var _vm = this;

            if(index <= 0) {
                this.smsButton = '重发验证码';
            } else {
                this.smsTimeIndex = index;
                this.smsButton = index + ' 秒后重发验证码';
                setTimeout(function () { _vm.smsTimer(index-1) }, 1000);
            }
        }
    }
};
</script>