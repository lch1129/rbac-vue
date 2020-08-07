<template>
<el-form :model="ruleForm" label-width="100px" class="demo-ruleForm">
    <el-form-item label="用户名：" prop="username">
        <el-input v-model="ruleForm.username" :disabled="true"></el-input>
    </el-form-item>
    <el-form-item label="当前角色：" prop="roles">
        <el-tag v-for="item in ruleForm.roles" :key="item.id">{{item.roleName}}</el-tag>
    </el-form-item>
    <el-form-item label="设置角色：">
        <el-table :data="tableData" height="250" ref="multipleTable" border style="width: 90%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column fixed prop="id" label="id" width="60">
            </el-table-column>
            <el-table-column prop="roleName" label="角色名称" width="125">
            </el-table-column>
            <el-table-column prop="description" label="角色描述" width="125">
            </el-table-column>
            <el-table-column prop="startDate" label="生效日期" width="100">
            </el-table-column>
            <el-table-column prop="endDate" label="失效日期" width="100">
            </el-table-column>
            <el-table-column prop="status" label="状态" width="80" fixed="right" :formatter="statusFormat">
            </el-table-column>
        </el-table>
    </el-form-item>
    <el-form-item>
        <el-button type="primary" @click="submit">提交</el-button>
    </el-form-item>
</el-form>
</template>

<script>
export default {
    name: "SetRole",
    props: ["setUserId"],
    data() {
        return {
            ruleForm: {
                id: "",
                username: "",
                roles: []
            },
            tableData: [],
            multipleSelection: []
        };
    },
    methods: {
        statusFormat(row) {
            if (row.status == "0") {
                return "无效";
            }
            if (row.status == "1") {
                return "有效";
            }
        },
        getUser() {
            var that = this;
            that.axios
                .get("http://localhost:8088/rbac/user/getuser", {
                    params: {
                        id: that.setUserId
                    }
                })
                .then(function (resp) {
                    if (resp.data.success) {
                        that.ruleForm = resp.data.user;
                        if (resp.data.user.roles.length > 0) {
                            var checkedSelection = [];
                            for (var i = 0; i < resp.data.user.roles.length; i++) {
                                for (var m = 0; m < that.tableData.length; m++) {
                                    if (resp.data.user.roles[i].id == that.tableData[m].id) {
                                        checkedSelection.push(that.tableData[m]);
                                    }
                                }
                            }
                            that.toggleSelection(checkedSelection);
                        } else {
                            that.toggleSelection([]);
                        }
                    } else {
                        that.$message.error(resp.data.errMsg);
                    }
                });
        },
        getRoles() {
            var that = this;
            that.axios
                .get("http://localhost:8088/rbac/role/getallroles")
                .then(function (resp) {
                    that.tableData = resp.data.roleList;
                });
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        toggleSelection(rows) {
            if (rows) {
                rows.forEach(row => {
                    this.$refs.multipleTable.toggleRowSelection(row);
                });
            } else {
                this.$refs.multipleTable.clearSelection();
            }
        },
        submit() {
            var that = this;
            var rolesIdArray = [];
            for (let i = 0; i < that.multipleSelection.length; i++) {
                rolesIdArray.push(that.multipleSelection[i].id);
            }
            that.axios
                .post("http://localhost:8088/rbac/user/setrole" + "?userId=" + that.ruleForm.id, rolesIdArray)
                .then(function (resp) {
                    if (resp.data.success) {
                        that.$message({
                            message: '设置成功！',
                            type: 'success'
                        });
                        that.getUser();
                    } else {
                        that.$message.error(resp.data.errMsg);
                    }
                    that.getUser();
                });
        }
    },
    created() {
        this.getRoles();
        this.getUser();
    }
}
</script>

<style lang="less" scoped>
</style>
