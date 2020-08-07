<template>
<body id="poster">
    <el-form class="login-container" label-position="left" label-width="0px">
        <h2 class="login_title">用户权限管理系统登录</h2>
        <el-form-item>
            <el-input type="text" v-model="loginForm.username" auto-complete="off" placeholder="账号">
            </el-input>
        </el-form-item>
        <el-form-item>
            <el-input type="password" v-model="loginForm.password" auto-complete="off" placeholder="密码">
            </el-input>
        </el-form-item>
        <el-form-item style="width: 100%">
            <el-button type="primary" style="width: 100%;border: none" v-on:click="login">登录
            </el-button>
        </el-form-item>
    </el-form>
</body>
</template>

<script>
import {
    mapMutations
} from "vuex";
 export default {
    name: "Login",
    data() {
        return {
            loginForm: {
                username: "",
                password: ""
            },
            userToken: ''
        };
    },
    methods: {
        ...mapMutations(['changeUsername', 'changeLogin','changeMenuIdArr','changemenuAddressArr']),
        checklogin(){

        },
        getUserMenu(){

        },
        getAllMenu(){

        },
        login() {
            var that = this;
            that.axios
                .get("http://localhost:8088/rbac/login", {
                    params: {
                        username: that.loginForm.username,
                        password: that.loginForm.password
                    }
                })
                .then(function (resp) {
                    if (resp.data.success) {
                        that.userToken = resp.data.token;
                        // 将用户token保存到vuex中,并设置到sessionStorage
                        that.changeLogin(that.userToken);
                        that.changeUsername(that.loginForm.username);
                        that.changeMenuIdArr(resp.data.menuIdArr);
                        that.changemenuAddressArr(resp.data.menuAddressArr);
                        that.$router.push('/main');
                        that.$message({
                            message: '登陆成功！',
                            type: 'success'
                        });
                    } else {
                        that.$message.error(resp.data.errMsg);
                    }
                });
        }
    }
}
</script>

<style lang="less" scoped>
#poster {
    background: white;
    background-position: center;
    height: 100%;
    width: 100%;
    background-size: cover;
    position: fixed;
}

body {
    margin: 0px;
    padding: 0;
}

.login-container {
    border-radius: 15px;
    background-clip: padding-box;
    margin: 90px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
}

.login_title {
    margin: 0px auto 40px auto;
    text-align: center;
    color: black;
}
</style>
