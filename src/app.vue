<style scoped>
.ivu-menu-dark.ivu-menu-vertical .ivu-menu-item, 
.ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu-title {
    color: hsla(0, 0%, 100%, 1);
}
</style>
<template>
   <div class="layout" v-else>
       <div v-if="$route.name == 'login'">
           <router-view></router-view>
       </div>
       <div v-else>
           <Header :style="{position: 'fixed', width: '100%', top: 0, background: '#fff', boxShadow: '0 2px 3px 2px rgba(0,0,0,.1)',fontSize:'26px',zIndex: 111}">
            <Row>
                <Col span="12">商城管理系统</Col>

               <Col span="12" :style="{ textAlign: 'right', fontSize: '14px'}">
                   <strong :style="{color: '#000'}">{{ username }}</strong> &nbsp;&nbsp;&nbsp;
                   <Button type="warning" @click="Logout">退出</Button>
               </Col>
           </Row>
           </Header>
           <Sider :style="{position: 'fixed', height: 'calc(100vh - 64px)', left: 0, margin: '64px 0 0', overflow: 'auto', }">
               <Menu @on-select="menuSelect" theme="dark" width="auto">
                   <template v-for="m in menu">
                       <MenuItem :name="m.path" v-if="m.children.length == 0 && m.show">
                           <Icon :type="m.icon" v-if="m.icon!=''"></Icon>
                           <template >{{ m.title }}</template>
                       </MenuItem>
                       <MenuGroup :title="m.title" v-else>
                           <template v-for="cm in m.children">
                               <MenuItem :name="cm.path" v-if="cm.show">
                                   <Icon :type="cm.icon" v-if="cm.icon!=''"></Icon>
                                   {{ cm.title }}
                               </MenuItem>
                           </template>
                       </MenuGroup>
                   </template>
               </Menu>
           </Sider>
           <Layout :style="{marginLeft: '200px'}">
               <Content :style="{padding: '88px 16px 0'}">
                   <!-- <Breadcrumb :style="{margin: '16px 0'}">
                       <BreadcrumbItem v-for="vo in breadcrumb">{{vo}}</BreadcrumbItem>
                   </Breadcrumb> -->
                   <!-- <router-view></router-view> -->
                   <keep-alive>
                       <router-view v-if="$route.meta.keepAlive">
                           <!-- 这里是会被缓存的视图组件，比如 Home！ -->
                       </router-view>
                   </keep-alive>

                   <router-view v-if="!$route.meta.keepAlive">
                       <!-- 这里是不被缓存的视图组件，比如 Edit！ -->
                   </router-view>

                   <!-- <keep-alive include="a">
                       <router-view>
                           只有路径匹配到的视图 a 组件会被缓存！
                       </router-view>
                   </keep-alive> -->
                   
               </Content>
           </Layout>
       </div>
   </div>
</template>
<script>
    import Menu from './menu';
    import Util from './libs/util';
    import env from './config/env';
    import Cookies from 'js-cookie';

    export default {
        name: 'app',
        components: {
         
        },
        data () {
            return {
                menu: Menu[0],
                username: '',
                loginpage: false,
            }
        },
        methods: {
            menuSelect: function(event){
                this.$router.push(event);
            },
            Logout: function(){  
                if(env === 'development'){
                    this.$router.push({
                        name: 'logout'
                    });
                } else {
                    location.href = (env === 'development' ? '/' : '/hzradmin/') + 'login';
                }
            },
            getusername () {
                if(Cookies.get('user_name') == undefined) {
                    this.$router.push({
                        name: 'login'
                    })
                }
                this.username = Cookies.get('user_name');
                
            },
        },
        created () {
            this.getusername();
        }
    }
</script>