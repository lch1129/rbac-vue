<template>
<el-form :model="ruleForm" label-width="100px" class="demo-ruleForm">
    <el-form-item label="角色名：" prop="roleName">
        <el-input v-model="ruleForm.roleName" :disabled="true"></el-input>
    </el-form-item>
    <el-form-item label="设置权限：" prop="menus">
        <el-tree :check-strictly="true" :data="data" ref="tree" show-checkbox node-key="id" :props="defaultProps" :default-checked-keys="checkdMenusId" :default-expanded-keys="checkdMenusId">
        </el-tree>
    </el-form-item>
    <el-form-item>
        <el-button type="primary" @click="submitForm">提交</el-button>
    </el-form-item>
</el-form>
</template>

<script>
export default {
    name: "SetMenu",
    props: ["setRoleId"],
    data() {
        return {
            ruleForm: {
                id: "",
                roleName: "",
                description: "",
                menus: []
            },
            data: [],
            defaultProps: {
                children: 'children',
                label: 'menuName'
            },
            checkdMenusId: []
        }
    },
    methods: {
        submitForm() {
            var that = this;
            var selectMenusId = that.$refs.tree.getCheckedKeys().concat(this.$refs.tree.getHalfCheckedKeys());
            that.axios
                .post("http://localhost:8088/rbac/role/setmenu" + "?roleId=" + that.ruleForm.id, selectMenusId)
                .then(function (resp) {
                    if (resp.data.success) {
                        that.$message({
                            message: '设置成功！',
                            type: 'success'
                        });
                    } else {
                        that.$message.error(resp.data.errMsg);
                    }
                    that.roleMenuSetterList = [];
                });
        }
    },
    created() {
        var that = this;
        that.axios
            .get("http://localhost:8088/rbac/role/getrole", {
                params: {
                    id: that.setRoleId
                }
            })
            .then(function (resp) {
                if (resp.data.success) {
                    that.ruleForm = resp.data.role;
                    for (let i = 0; i < resp.data.role.menus.length; i++) {
                        that.checkdMenusId.push(resp.data.role.menus[i].id);
                    }
                } else {
                    that.$message.error(resp.data.errMsg);
                }
            });
        that.axios
            .get("http://localhost:8088/rbac/menu/initsetmenu")
            .then(function (resp) {
                that.data = resp.data.data;
            });
    }
}
</script>

<style lang="less" scoped>
</style>
