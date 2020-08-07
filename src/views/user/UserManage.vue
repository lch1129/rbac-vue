<template>
<div>
    <div>
        <span>用户名：
            <el-input v-model="username" style="width: 120px"></el-input>
        </span>&nbsp;
        <span>昵称：
            <el-input v-model="nickname" style="width: 120px"></el-input>
        </span>&nbsp;
        <span>状态：
            <el-select v-model="status" style="width: 100px">
                <el-option onselect label="请选择" value=""> </el-option>
                <el-option label="有效" value="1"> </el-option>
                <el-option label="无效" value="0"> </el-option>
            </el-select>
        </span>&nbsp;
        <span>创建时间由：
            <el-date-picker v-model="betweenTime" type="datetimerange" :picker-options="pickerOptions" clearable format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="right" @change="clearDateTime">
            </el-date-picker>
        </span>&nbsp;
        <span style="float: right">
            <el-button type="primary" @click="getUsers" v-if="menuIdArr.includes(8)">查询</el-button>
            <el-button type="success" @click="addOrModifyDialogVisible = true" v-if="menuIdArr.includes(5)">新增</el-button>
            <el-button type="danger" @click="deleteUser" v-if="menuIdArr.includes(6)">删除</el-button>
        </span>
    </div>
    <br>
    <el-dialog :title="modifyUserId==''?'新增用户':'修改用户'" v-if="addOrModifyDialogVisible" :visible.sync="addOrModifyDialogVisible" width="60%" :before-close="handleCloseDialog">
        <AddOrModifyUser :modifyUserId="modifyUserId"></AddOrModifyUser>
    </el-dialog>
    <el-dialog title="设置角色" v-if="setDialogVisible" :visible.sync="setDialogVisible" width="60%" :before-close="handleCloseDialog">
        <SetRole :setUserId="setUserId"></SetRole>
    </el-dialog>
    <el-table :data="tableData" border style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column fixed prop="id" label="用户id" width="80"> </el-table-column>
        <el-table-column prop="username" label="用户名" width="100"></el-table-column>
        <el-table-column prop="nickname" label="昵称" width="100"></el-table-column>
        <el-table-column prop="phone" label="电话" width="120"> </el-table-column>
        <el-table-column prop="gender" label="性别" width="60" :formatter="genderFormat">
        </el-table-column>
        <el-table-column prop="email" label="邮箱" width="180"> </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="160"></el-table-column>
        <el-table-column prop="lastEditTime" label="最后修改时间" width="160"></el-table-column>
        <el-table-column prop="status" label="状态" width="60" :formatter="statusFormat">
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
            <template slot-scope="scope">
                <el-button @click="handleModifyClick(scope.row)" type="text" size="small" v-if="menuIdArr.includes(7)">编辑</el-button>
                <el-button type="text" size="small" v-if="menuIdArr.includes(12)" @click="modifyState(scope.row)">
                    <span v-if="scope.row.status == 0">设为有效</span>
                    <span v-if="scope.row.status == 1">设为无效</span>
                </el-button>
                <el-button type="text" @click="handleSetClick(scope.row)" v-if="menuIdArr.includes(13)" size="small">设置角色</el-button>
            </template>
        </el-table-column>
    </el-table>
    <br>
    <el-pagination background layout="prev, pager, next" :current-page.sync="initPage" :page-size="$store.state.pageSize" :total="total" @current-change="page">
    </el-pagination>
</div>
</template>

<script>
import AddOrModifyUser from "./AddOrModifyUser";
import SetRole from "./SetRole";
import {
    mapState
} from "vuex";
export default {
    name: "UserManager",
    components: {
        AddOrModifyUser,
        SetRole
    },
    computed: {
        ...mapState(['menuIdArr'])
    },
    data() {
        return {
            addOrModifyDialogVisible: false,
            setDialogVisible: false,
            modifyUserId: "",
            setUserId: "",
            tableData: [],
            multipleSelection: [],
            total: 0,
            username: "",
            nickname: "",
            status: "",
            rowIndex: 1,
            initPage: 1,
            betweenTime: "",
            pickerOptions: {
                shortcuts: [{
                        text: "最近一周",
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit("pick", [start, end]);
                        }
                    },
                    {
                        text: "最近一个月",
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit("pick", [start, end]);
                        }
                    },
                    {
                        text: "最近三个月",
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit("pick", [start, end]);
                        }
                    }
                ]
            }
        };
    },
    methods: {
        genderFormat(row) {
            if (row.gender == "0") {
                return "男";
            }
            if (row.gender == "1") {
                return "女";
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
                    this.modifyUserId = "";
                    this.setUserId = "";
                    this.getUsers();
                    done();
                })
                // eslint-disable-next-line no-unused-vars
                .catch(_ => {});
        },
        handleModifyClick(row) {
            this.addOrModifyDialogVisible = true;
            this.modifyUserId = row.id;
        },
        handleSetClick(row) {
            this.setDialogVisible = true;
            this.setUserId = row.id;
        },
        modifyState(row) {
            var that = this;
            that.axios
                .get("http://localhost:8088/rbac/user/modifystatus", {
                    params: {
                        id: row.id
                    }
                })
                .then(function (resp) {
                    if (resp.data.success) {
                        row.status = resp.data.user.status;
                        row.lastEditTime = resp.data.user.lastEditTime;
                    } else {
                        that.$message.error(resp.data.errMsg);
                    }
                });
        },
        page(currentPage) {
            this.rowIndex = currentPage;
            var that = this;
            that.axios
                .get("http://localhost:8088/rbac/user/getusers", {
                    params: {
                        username: that.username,
                        nickname: that.nickname,
                        status: that.status,
                        betweenTime: that.betweenTime == null ? "" : that.betweenTime.toString(),
                        rowIndex: that.rowIndex,
                        pageSize: that.$store.state.pageSize
                    }
                })
                .then(function (resp) {
                    if (resp.data.success) {
                        that.total = resp.data.count;
                        that.tableData = resp.data.userList;
                    } else {
                        that.$message.error(resp.data.errMsg);
                    }
                });
        },
        getUsers() {
            var that = this;
            that.axios
                .get("http://localhost:8088/rbac/user/getusers", {
                    params: {
                        username: that.username,
                        nickname: that.nickname,
                        status: that.status,
                        betweenTime: that.betweenTime == null ? "" : that.betweenTime.toString(),
                        rowIndex: 1,
                        pageSize: that.$store.state.pageSize
                    }
                })
                .then(function (resp) {
                    if (resp.data.success) {
                        that.total = resp.data.count;
                        that.tableData = resp.data.userList;
                        that.initPage = 1;
                    } else {
                        that.$message.error(resp.data.errMsg);
                    }
                });
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        deleteUser() {
            if (this.multipleSelection.length == 0) {
                this.$message({
                    message: '没有选中条目。。。',
                    type: 'warning'
                });
            } else {
                var that = this;
                var deleteUserIdArray = [];
                for (let i = 0; i < this.multipleSelection.length; i++) {
                    deleteUserIdArray.push(this.multipleSelection[i].id);
                }
                that.axios.post("http://localhost:8088/rbac/user/deleteusers", deleteUserIdArray)
                    .then(function (resp) {
                        if (resp.data.success) {
                            that.$message({
                                message: '删除成功！',
                                type: 'success'
                            });
                        } else {
                            that.$message.error(resp.data.errMsg);
                        }
                        that.getUsers();
                    });
            }
        },
        clearDateTime() {
            if (this.betweenTime == null) {
                this.betweenTime = "";
            }
        }
    },
    created() {
        this.getUsers();
    }
}
</script>

<style lang="less" scoped>
</style>
