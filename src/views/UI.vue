<template>
<div id="app">
    <el-container style="height: 730px; border: 1px solid #eee">
        <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
            <el-menu router :default-openeds="defaultOpens">
                <template v-for="(item,index) in menuList">
                    <el-submenu :key="index" :index="''+index" v-if="(menuIdArr.includes(item.id))&&item.status==1?true:false">
                        <template slot="title">
                            <i class="el-icon-menu"></i>{{item.menuName}}
                        </template>
                        <template v-for="(item1,index1) in item.children">
                            <el-menu-item :key="index1" :index="item1.menuAddress==null? '*':item1.menuAddress" v-if="(menuIdArr.includes(item1.id))&&item1.status==1?true:false" :class="$route.path == item1.menuAddress ? 'is-active' : ''">{{item1.menuName}}
                            </el-menu-item>
                        </template>
                    </el-submenu>
                </template>
            </el-menu>
        </el-aside>
        <el-container>
            <el-header style="text-align: right; font-size: 12px">
                <span style="margin-right: 425px;font: 40px Extra large">用户权限管理系统</span>
                <el-dropdown>
                    <i class="el-icon-setting" style="margin-right: 15px"></i>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item divided @click.native="logout">注销登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <span>{{username}}</span>
            </el-header>
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</div>
</template>

<script>
import {
    mapState,
    mapMutations
} from "vuex";
export default {
    name: "UI",
    data() {
        return {
            menuList: [],
            defaultOpens: []
        }
    },
    computed: {
        ...mapState(['username','menuIdArr'])
    },
    methods: {
        ...mapMutations(['changeUsername']),
        initMenu() {
            var that = this;
            that.axios
                .get("http://localhost:8088/rbac/menu/initsetmenu")
                .then(function (resp) {
                    that.menuList = resp.data.data;
                    for (let i = 0; i < that.menuList.length; i++) {
                        that.defaultOpens.push(i + '');
                    }
                });
        },
        logout() {
            //退出登录，清空token
            sessionStorage.removeItem('Authorization');
            sessionStorage.removeItem('username');
            sessionStorage.removeItem('menuIdArr');
            sessionStorage.removeItem('menuAddressArr');
            this.$message({
                message: '注销登录成功！',
                type: 'success'
            });
            this.$router.push('/');
        }
    },
    created() {
        this.initMenu();
    }
}
</script>

<style lang="less" scoped>
.el-header {
    background-color: #b3c0d1;
    color: #333;
    line-height: 60px;
}

.el-aside {
    color: #333;
}
</style>
