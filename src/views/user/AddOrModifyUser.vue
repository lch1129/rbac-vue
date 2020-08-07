<template>
<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
    <el-form-item label="用户名" prop="username">
        <el-input v-model="ruleForm.username"></el-input>
    </el-form-item>
    <el-form-item label="密码" prop="password">
        <el-input v-model="ruleForm.password"></el-input>
    </el-form-item>
    <el-form-item label="昵称" prop="nickname">
        <el-input v-model="ruleForm.nickname"></el-input>
    </el-form-item>
    <el-form-item label="号码" prop="phone">
        <el-input v-model="ruleForm.phone"></el-input>
    </el-form-item>
    <el-form-item label="性别" prop="gender">
        <el-select v-model="ruleForm.gender" placeholder="请选择性别">
            <el-option label="男" :value="0"></el-option>
            <el-option label="女" :value="1"></el-option>
        </el-select>
    </el-form-item>
    <el-form-item label="邮箱" prop="email">
        <el-input v-model="ruleForm.email"></el-input>
    </el-form-item>
    <el-form-item label="是否有效" prop="status">
        <el-radio-group v-model="ruleForm.status">
            <el-radio :label="1">有效</el-radio>
            <el-radio :label="0">无效</el-radio>
        </el-radio-group>
    </el-form-item>
    <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
    </el-form-item>
</el-form>
</template>

<script>
export default {
    name: "AddOrModifyUser",
    props: ["modifyUserId"],
    data() {
        return {
            ruleForm: {
                id: "",
                username: "",
                password: "",
                nickname: "",
                phone: "",
                gender: "",
                email: "",
                status: ""
            },
            rules: {
                username: [{
                    required: true,
                    message: "请输入用户名",
                    trigger: "blur"
                }],
                password: [{
                    required: true,
                    message: "请输入密码",
                    trigger: "blur"
                }],
                nickname: [{
                    required: true,
                    message: "请输入昵称",
                    trigger: "blur"
                }],
                phone: [{
                    required: true,
                    message: "请输入号码",
                    trigger: "blur"
                }],
                gender: [{
                    required: true,
                    message: "请选择性别",
                    trigger: "change"
                }],
                email: [{
                    required: true,
                    message: "请输入邮箱",
                    trigger: "blur"
                }],
                status: [{
                    required: true,
                    message: "请选择是否有效",
                    trigger: "change"
                }]
            }
        }
    },
    methods: {
        submitForm(formName) {
            var that = this;
            this.$refs[formName].validate(valid => {
                if (valid) {
                    if (that.modifyUserId != "") {
                        that.axios
                            .post("http://localhost:8088/rbac/user/modifyuser", that.ruleForm)
                            .then(function (resp) {
                                if (resp.data.success) {
                                    that.$message({
                                        message: '修改成功！',
                                        type: 'success'
                                    });
                                    that.resetForm(formName);
                                } else {
                                    that.$message.error(resp.data.errMsg);
                                    that.resetForm(formName);
                                }
                            });
                    } else {
                        that.axios
                            .post("http://localhost:8088/rbac/user/adduser", that.ruleForm)
                            .then(function (resp) {
                                if (resp.data.success) {
                                    that.$message({
                                        message: '添加成功！',
                                        type: 'success'
                                    });
                                    that.resetForm(formName);
                                } else {
                                    that.$message.error(resp.data.errMsg);
                                    that.resetForm(formName);
                                }
                            });
                    }
                } else {
                    return false;
                }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        }
    },
    created() {
        var that = this;
        if (that.modifyUserId != "") {
            that.axios
                .get("http://localhost:8088/rbac/user/getuser", {
                    params: {
                        id: that.modifyUserId
                    }
                })
                .then(function (resp) {
                    if (resp.data.success) {
                        that.ruleForm = resp.data.user;
                    } else {
                        that.$message.error(resp.data.errMsg);
                    }
                });
        }
    }
}
</script>

<style lang="less" scoped>
</style>
