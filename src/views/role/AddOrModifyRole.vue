<template>
<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
    <el-form-item label="角色名" prop="roleName">
        <el-input v-model="ruleForm.roleName"></el-input>
    </el-form-item>
    <el-form-item label="描述" prop="description">
        <el-input v-model="ruleForm.description"></el-input>
    </el-form-item>
    <el-form-item label="生效日期" prop="startDate">
        <el-date-picker v-model="ruleForm.startDate" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="选择日期">
        </el-date-picker>
    </el-form-item>
    <el-form-item label="失效日期" prop="endDate">
        <el-date-picker v-model="ruleForm.endDate" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="选择日期">
        </el-date-picker>
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
    name: "AddOrModifyRole",
    props: ["modifyRoleId"],
    data() {
        return {
            ruleForm: {
                id: "",
                roleName: "",
                description: "",
                startDate: "",
                endDate: "",
                status: ""
            },
            rules: {
                roleName: [{
                    required: true,
                    message: "请输入角色名",
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
                    if (that.modifyRoleId == "") {
                        that.axios
                            .post("http://localhost:8088/rbac/role/addrole", that.ruleForm)
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
                    } else {
                        that.axios
                            .post("http://localhost:8088/rbac/role/modifyrole", that.ruleForm)
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
        if (that.modifyRoleId != "") {
            that.axios
                .get("http://localhost:8088/rbac/role/getrole", {
                    params: {
                        id: that.modifyRoleId
                    }
                })
                .then(function (resp) {
                    if (resp.data.success) {
                        that.ruleForm = resp.data.role;
                    } else {
                        that.$message.error(resp.data.errMsg);
                    }
                });
        }
        /* */
    }
}
</script>

<style lang="less" scoped>
</style>
