<template>
<div>
    <div>
        <span>
            角色名：<el-input v-model="roleName" style="width: 120px"></el-input>
        </span>&nbsp;
        <span>
            状态：
            <el-select v-model="status" style="width: 120px">
                <el-option onselect label="请选择" value=""> </el-option>
                <el-option label="有效" value="1"> </el-option>
                <el-option label="无效" value="0"> </el-option>
            </el-select>
        </span>&nbsp;
        <span style="float: right">
            <el-button type="primary" @click="getRoles">查询</el-button>
            <el-button type="success" @click="addOrModifyDialogVisible = true">新增</el-button>
            <el-button type="danger" @click="deleteRole">删除</el-button>
        </span>
    </div>
    <br>
    <el-dialog :title="modifyRoleId==''?'新增角色':'修改角色'" v-if="addOrModifyDialogVisible" :visible.sync="addOrModifyDialogVisible" width="60%" :before-close="handleCloseDialog">
        <AddOrModifyRole :modifyRoleId="modifyRoleId"></AddOrModifyRole>
    </el-dialog>
    <el-dialog title="设置角色权限" v-if="setDialogVisible" :visible.sync="setDialogVisible" width="60%" :before-close="handleCloseDialog">
        <SetMenu :setRoleId="setRoleId"></SetMenu>
    </el-dialog>
    <el-table :data="tableData" border style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column fixed prop="id" label="角色id" width="80">
        </el-table-column>
        <el-table-column prop="roleName" label="角色名称" width="120">
        </el-table-column>
        <el-table-column prop="description" label="角色描述" width="160">
        </el-table-column>
        <el-table-column prop="startDate" label="生效日期" width="160">
        </el-table-column>
        <el-table-column prop="endDate" label="失效日期" width="160">
        </el-table-column>
        <el-table-column prop="status" label="状态" width="120" :formatter="statusFormat">
        </el-table-column>
        <el-table-column label="操作" width="400" fixed="right">
            <template slot-scope="scope">
                <el-button @click="handleModifyClick(scope.row)" type="text" size="small">编辑</el-button>
                <el-button @click="handleSetClick(scope.row)" type="text" size="small">设置角色权限</el-button>
            </template>
        </el-table-column>
    </el-table>
    <br>
    <el-pagination background layout="prev, pager, next" :current-page.sync="initPage" :page-size="$store.state.pageSize" :total="total" @current-change="page">
    </el-pagination>
</div>
</template>

<script>
import AddOrModifyRole from "./AddOrModifyRole";
import SetMenu from "./SetMenu";
export default {
    name: "RoleManage",
    components: {
        AddOrModifyRole,
        SetMenu
    },
    data() {
        return {
            addOrModifyDialogVisible: false,
            setDialogVisible: false,
            modifyRoleId: "",
            setRoleId: "",
            tableData: [],
            multipleSelection: [],
            total: 0,
            roleName: "",
            status: "",
            rowIndex: 1,
            initPage: 1
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
        handleCloseDialog(done) {
            this.$confirm("确认关闭？")
                // eslint-disable-next-line no-unused-vars
                .then(_ => {
                    this.modifyRoleId = "";
                    this.setRoleId = "";
                    this.getRoles();
                    done();
                })
                // eslint-disable-next-line no-unused-vars
                .catch(_ => {});
        },
        handleModifyClick(row) {
            this.addOrModifyDialogVisible = true;
            this.modifyRoleId = row.id;
        },
        handleSetClick(row) {
            this.setDialogVisible = true;
            this.setRoleId = row.id;
        },
        page(currentPage) {
            this.rowIndex = currentPage;
            var that = this;
            that.axios
                .get("http://localhost:8088/rbac/role/getroles", {
                    params: {
                        roleName: that.roleName,
                        status: that.status,
                        rowIndex: that.rowIndex,
                        pageSize: that.$store.state.pageSize
                    }
                })
                .then(function (resp) {
                    if (resp.data.success) {
                        that.total = resp.data.count;
                        that.tableData = resp.data.roleList;
                    } else {
                        that.$message.error(resp.data.errMsg);
                    }
                });
        },
        getRoles() {
            var that = this;
            that.axios
                .get("http://localhost:8088/rbac/role/getroles", {
                    params: {
                        roleName: that.roleName,
                        status: that.status,
                        rowIndex: 1,
                        pageSize: that.$store.state.pageSize
                    }
                })
                .then(function (resp) {
                    if (resp.data.success) {
                        that.total = resp.data.count;
                        that.tableData = resp.data.roleList;
                        that.initPage = 1;
                    } else {
                        that.$message.error(resp.data.errMsg);
                    }
                });
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        deleteRole() {
            var that = this;
            if (that.multipleSelection.length == 0) {
                that.$message({
                    message: '没有选中条目。。。',
                    type: 'warning'
                });
            } else {
                var deleteRoleIdArray = [];
                for (var i = 0; i < that.multipleSelection.length; i++) {
                    deleteRoleIdArray.push(that.multipleSelection[i].id);
                }
                that.axios.post("http://localhost:8088/rbac/role/deleteroles", deleteRoleIdArray)
                    .then(function (resp) {
                        if (resp.data.success) {
                            that.$message({
                                message: '删除成功！',
                                type: 'success'
                            });
                        } else {
                            that.$message.error(resp.data.errMsg);
                        }
                        that.getRoles();
                    });
            }
        }
    },
    created() {
        this.getRoles();
    }
}
</script>

<style lang="less" scoped>
</style>
