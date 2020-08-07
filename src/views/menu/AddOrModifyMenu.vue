<template>
<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
    <el-form-item label="菜单类型" prop="menuType">
        <el-select v-model="ruleForm.menuType" :disabled="this.modifyMenuId!=''?true:false" @change="changeMenuType">
            <el-option label="目录" :value="1"></el-option>
            <el-option label="菜单" :value="2"></el-option>
            <el-option label="功能" :value="3"></el-option>
        </el-select>
    </el-form-item>
    <el-form-item v-if="ruleForm.menuType!=1" label="上级菜单" prop="parentMenu.id">
        <el-select v-model="ruleForm.parentMenu.id">
            <el-option v-for="item in options" :key="item.id" :label="item.menuName" :value="item.id">
            </el-option>
        </el-select>
    </el-form-item>
    <el-form-item label="菜单名称" prop="menuName">
        <el-input v-model="ruleForm.menuName"></el-input>
    </el-form-item>
    <el-form-item label="菜单描述" prop="description">
        <el-input v-model="ruleForm.description"></el-input>
    </el-form-item>
    <el-form-item label="菜单地址" prop="menuAddress">
        <el-input v-model="ruleForm.menuAddress"></el-input>
    </el-form-item>
    <el-form-item label="是否有效" prop="status">
        <el-radio-group v-model="ruleForm.status">
            <el-radio :label="1">有效</el-radio>
            <el-radio :label="0">无效</el-radio>
        </el-radio-group>
    </el-form-item>
    <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
        <!-- <el-button @click="resetForm('ruleForm')">重置</el-button> -->
    </el-form-item>
</el-form>
</template>

<script>
/* import router from "./router"; */
export default {
    name: "AddOrModifyMenu",
    props: ["modifyMenuId"],
    data() {
        return {
            ruleForm: {
                id: "",
                menuName: "",
                description: "",
                menuType: "",
                menuAddress: "",
                status: "",
                parentMenu: {
                    id: '',
                }
            },
            rules: {
                menuName: [{
                    required: true,
                    message: "请输入菜单名称",
                    trigger: "blur"
                }],
                menuType: [{
                    required: true,
                    message: "请选择菜单类型",
                    trigger: "change"
                }],
                "parentMenu.id": [{
                    required: true,
                    message: "请选择上级菜单",
                    trigger: "change"
                }],
                status: [{
                    required: true,
                    message: "请选择是否有效",
                    trigger: "change"
                }]
            },
            options: []
        }
    },
    methods: {
        changeMenuType() {
            var that = this;
            this.ruleForm.parentMenu.id = '';
            if (that.ruleForm.menuType != 1) {
                that.axios
                    .get("http://localhost:8088/rbac/menu/getmenus", {
                        params: {
                            menuName: "",
                            menuType: that.ruleForm.menuType - 1,
                            status: "",
                            rowIndex: 1,
                            pageSize: 100
                        }
                    })
                    .then(function (resp) {
                        if (resp.data.success) {
                            that.options = resp.data.menuList;
                        }
                    });
            }
        },
        submitForm(formName) {
            var that = this;
            this.$refs[formName].validate(valid => {
                if (valid) {
                    if (that.modifyMenuId != "") {
                        that.axios
                            .post("http://localhost:8088/rbac/menu/modifymenu", that.ruleForm)
                            .then(function (resp) {
                                if (resp.data.success) {
                                    that.$message({
                                        message: '修改成功！',
                                        type: 'success'
                                    });
                                    /* that.resetForm(formName); */
                                } else {
                                    that.$message.error(resp.data.errMsg);
                                    /* that.resetForm(formName); */
                                }
                            });
                    } else {
                        that.axios
                            .post("http://localhost:8088/rbac/menu/addmenu", that.ruleForm)
                            .then(function (resp) {
                                if (resp.data.success) {
                                    that.$message({
                                        message: '添加成功！',
                                        type: 'success'
                                    });
                                    /* that.resetForm(formName); */
                                } else {
                                    that.$message.error(resp.data.errMsg);
                                    /* that.resetForm(formName); */
                                }
                            });
                    }
                } else {
                    return false;
                }
            });
        }
        /* ,
            resetForm(formName) {
              this.$refs[formName].resetFields();
            } */
    },
    created() {
        var that = this;
        /* that.resetForm(that.ruleForm); */
        if (that.modifyMenuId != "") {
            that.axios
                .get("http://localhost:8088/rbac/menu/getmenu", {
                    params: {
                        id: that.modifyMenuId
                    }
                })
                .then(function (resp) {
                    if (resp.data.success) {
                        that.ruleForm = resp.data.menu;
                        if (resp.data.menu.menuType != 1) {
                            that.axios
                                .get("http://localhost:8088/rbac/menu/getmenus", {
                                    params: {
                                        menuName: "",
                                        menuType: resp.data.menu.menuType - 1,
                                        status: "",
                                        rowIndex: 1,
                                        pageSize: 10000
                                    }
                                })
                                .then(function (resp1) {
                                    if (resp1.data.success) {
                                        that.options = resp1.data.menuList;
                                    } else {
                                        that.$message.error(resp.data.errMsg);
                                    }
                                });
                        }
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
