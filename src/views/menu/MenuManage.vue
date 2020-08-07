<template>
<div>
    <div>
        <span>菜单名称
            <el-input v-model="menuName" style="width: 120px"></el-input>
        </span>&nbsp;
        <span>状态：
            <el-select v-model="status" style="width: 100px">
                <el-option onselect label="请选择" value=""> </el-option>
                <el-option label="有效" value="1"> </el-option>
                <el-option label="无效" value="0"> </el-option>
            </el-select>
        </span>&nbsp;
        <span>菜单类型：
            <el-select v-model="menuType" style="width: 100px">
                <el-option onselect label="请选择" value=""> </el-option>
                <el-option label="目录" value="1"> </el-option>
                <el-option label="菜单" value="2"> </el-option>
                <el-option label="功能" value="3"> </el-option>
            </el-select>
        </span>&nbsp;
        <span style="float: right">
            <el-button type="primary" @click="getMenus">查询</el-button>
            <el-button type="success" @click="addOrModifyDialogVisible = true">新增</el-button>
            <el-button type="danger" @click="deleteMenus">删除</el-button>
        </span>
    </div>
    <br>
    <el-dialog :title="modifyMenuId==''?'新增菜单':'修改菜单'" v-if="addOrModifyDialogVisible" :visible.sync="addOrModifyDialogVisible" width="60%" :before-close="handleCloseDialog">
        <AddOrModifyMenu :modifyMenuId="modifyMenuId"></AddOrModifyMenu>
    </el-dialog>
    <el-table :data="tableData" border style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column fixed prop="id" label="菜单id" width="80"> </el-table-column>
        <el-table-column prop="menuName" label="菜单名称" width="120"></el-table-column>
        <el-table-column prop="parentMenu.menuName" label="上级菜单" width="120"></el-table-column>
        <el-table-column prop="description" label="菜单描述" width="140"> </el-table-column>
        <el-table-column prop="menuType" label="菜单类型" width="120" :formatter="menuTypeFormat">
        </el-table-column>
        <el-table-column prop="menuAddress" label="菜单地址" width="180"> </el-table-column>
        <el-table-column prop="status" label="状态" width="60" :formatter="statusFormat">
        </el-table-column>
        <el-table-column label="操作" width="380" fixed="right">
            <template slot-scope="scope">
                <el-button @click="handleModifyClick(scope.row)" type="text" size="small">编辑</el-button>
                <el-button type="text" size="small" @click="deleteMenu(scope.row)">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
    <br>
    <el-pagination background layout="prev, pager, next" :current-page.sync="initPage" :page-size="$store.state.pageSize" :total="total" @current-change="page">
    </el-pagination>
</div>
</template>

<script>
import AddOrModifyMenu from "./AddOrModifyMenu";
export default {
    name: "MenuManage",
    components: {
        AddOrModifyMenu
    },
    data() {
        return {
            addOrModifyDialogVisible: false,
            modifyMenuId: "",
            tableData: [],
            multipleSelection: [],
            total: 0,
            menuName: "",
            menuType: "",
            status: "",
            rowIndex: 1,
            initPage: 1
        };
    },
    methods: {
        menuTypeFormat(row) {
            if (row.menuType == "1") {
                return "目录";
            }
            if (row.menuType == "2") {
                return "菜单";
            }
            if (row.menuType == "3") {
                return "功能";
            }
        },
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
                    this.modifyMenuId = "";
                    this.getMenus();
                    parent.location.reload();
                    done();
                })
                // eslint-disable-next-line no-unused-vars
                .catch(_ => {});
        },
        handleModifyClick(row) {
            this.addOrModifyDialogVisible = true;
            this.modifyMenuId = row.id;
        },
        page(currentPage) {
            this.rowIndex = currentPage;
            var that = this;
            that.axios
                .get("http://localhost:8088/rbac/menu/getmenus", {
                    params: {
                        menuName: that.menuName,
                        menuType: that.menuType,
                        status: that.status,
                        rowIndex: that.rowIndex,
                        pageSize: that.$store.state.pageSize
                    }
                })
                .then(function (resp) {
                    if (resp.data.success) {
                        that.total = resp.data.count;
                        that.tableData = resp.data.menuList;
                    } else {
                        that.$message.error(resp.data.errMsg);
                    }
                });
        },
        getMenus() {
            var that = this;
            that.axios
                .get("http://localhost:8088/rbac/menu/getmenus", {
                    params: {
                        menuName: that.menuName,
                        menuType: that.menuType,
                        status: that.status,
                        rowIndex: 1,
                        pageSize: that.$store.state.pageSize
                    }
                })
                .then(function (resp) {
                    if (resp.data.success) {
                        that.total = resp.data.count;
                        that.tableData = resp.data.menuList;
                        that.initPage = 1;
                    } else {
                        that.$message.error(resp.data.errMsg);
                    }
                });
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        deleteMenus() {
            if (this.multipleSelection.length == 0) {
                this.$message({
                    message: '没有选中条目。。。',
                    type: 'warning'
                });
            } else {
                var deleteMenuIdArray = [];
                for (let i = 0; i < this.multipleSelection.length; i++) {
                    deleteMenuIdArray.push(this.multipleSelection[i].id);
                }
                var that = this;
                that.axios.post("http://localhost:8088/rbac/menu/deletemenus", deleteMenuIdArray)
                    .then(function (resp) {
                        if (resp.data.success) {
                            that.$message({
                                message: '删除成功！',
                                type: 'success'
                            });
                        } else {
                            that.$message.error(resp.data.errMsg);
                        }
                        that.getMenus();
                        parent.location.reload();
                    });
            }
        },
        deleteMenu(row) {
            var that = this;
            that.axios
                .get("http://localhost:8088/rbac/menu/deletemenu", {
                    params: {
                        menuId: row.id
                    }
                })
                .then(function (resp) {
                    if (resp.data.success) {
                        that.$message({
                            message: '删除成功！',
                            type: 'success'
                        });
                    } else {
                        that.$message.error(resp.data.errMsg);
                    }
                    that.getMenus();
                    parent.location.reload();
                });

        }
    },
    created() {
        this.getMenus();
    }
}
</script>

<style lang="less" scoped>
</style>
