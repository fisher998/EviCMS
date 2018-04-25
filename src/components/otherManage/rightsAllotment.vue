<template>
    <div id="rightsAllotment">
        <div class="rightsAllotmenttop">
        <span>
            权限列表
        </span>
        </div>
        <div class="add">
            <el-button size="small" @click="addAdmin" v-bind:class="{hide:compAdd}">
                添加权限
            </el-button>
        </div>
        <div>
            <table cellpadding="0" cellspacing="0">
                <thead>
                <tr>
                    <th>编号</th>
                    <th>权限名称</th>
                    <th>权限值</th>
                    <th>描述</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item,index) in list">
                    <td>{{item.id}}</td>
                    <td>{{item.name}}</td>
                    <td>{{item.permission_key}}</td>
                    <td>
                        <template>
                            <el-button size="small" @click="editAdmin(index)" v-bind:class="{hide:compEdit}"
                                       type="primary">编辑
                            </el-button>
                        </template>
                        <template>
                            <el-button size="small" v-bind:class="{hide:compDel}" @click="deleteAdmin(index)">删除</el-button>
                        </template>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
        <!--分页-->
        <div style="text-align: inherit">
            <div class="pagination" :class="{hide:compList}" v-if="total>15">
                <el-pagination
                    layout="prev, pager, next,total"
                    :total="total"
                    :page-size="perpage"
                    :current-page.sync="currentPage"
                    @current-change="handleCurrentChange()"
                >
                </el-pagination>
            </div>
        </div>
        <!--是否删除弹窗-->
        <!--添加权限弹窗-->
        <el-dialog
            :title="operation"
            :visible.sync="centerDialogVisible"
            width="30%"
            center>
            <el-form :model="addForm" ref="addForm" label-width="100px">
                <el-form-item label="权限名称:"
                              prop="username"
                              :rules="[{required:true,message: '权限不能为空', trigger: 'blur'}]">
                    <el-input v-model="addForm.username"></el-input>
                </el-form-item>
                <el-form-item label="权限值:"
                              :rules="[{required:true,message: '权限值不能为空', trigger: 'blur'}]"
                              prop="value">
                    <el-input v-model="addForm.value"></el-input>
                </el-form-item>
                <el-form-item label="权限描述:"
                              :rules="[{required:true,message: '权限不能为空', trigger: 'blur'}]"
                              prop="description">
                    <el-input v-model="addForm.description"></el-input>
                </el-form-item>
                <el-form-item label="上级栏目:" prop="column">
                    <el-select v-model="addForm.column" placeholder="请选择">
                        <el-option
                            v-for="item in menuList"
                            :key="item.menu_id"
                            :label="item.name"
                            :value="item.menu_id"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button @click="centerDialogVisible = false">取 消</el-button>
                    <el-button @click="submit()" type="primary">确 定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>
<script>
    import {
        addPermission,
        permissionList,
        menulist,
        detailPermission,
        updatePermission,
        deletePermission
    } from '../../api/other';
    import {contains} from '../../assets/public';

    export default {
        created() {
            this.__list();
            menulist(2, this.perpage, this.currentPage).then(res => {
                if (res.data.error === 0) {
                    this.menuList = res.data.data;
                }
            });
        },
        data() {
            return {
                compList: false, // 是否有显示列表权限
                compDel: false, // 是否有删除列表权限
                compEdit: false, // 是否有编辑列表权限
                compAdd: false, // 是否有添加列表权限
                perpage: 15, // m每页显示条数
                currentPage: 1, // 当前页
                operation: '',  // 当前操作
                list: [], // 列表项
                menuList: [], // 下拉列表的项
                total: 0,  // 总条数
            //  visible2: false, // 是否删除弹窗
                currentId: '',
                currentIndex: '',
                centerDialogVisible: false,
                addForm: {
                    username: '',
                    value: '',
                    description: '',
                    column: ''
                }
            };
        },
        methods: {
//            获取权限列表
            handleCurrentChange() {
                this.__list();
            },
            // 权限控制函数
            permissionControl() {
                this.compList = !contains('admin_permission_list');
                this.compAdd = !contains('admin_permission_add');
                this.compEdit = !contains('admin_permission_update');
                this.compDel = !contains('admin_permission_delete');
            },
            __list() {
                permissionList('', this.perpage, this.currentPage).then(res => {
                    if (res.data.error === 0) {
                        this.list = res.data.data.data;
                        this.total = res.data.data.total;
                    } else {
                        this.$message({
                            message: res.data.data,
                            type: 'error',
                            showClose: true
                        });
                    }
                }).catch(err => {
                    console.log(err);
                });
            },
            addAdmin() {
                this.centerDialogVisible = true;
                this.operation = '添加权限';
            },
//            点击编辑权限，显示出具体信息
            editAdmin(index) {
                this.centerDialogVisible = true;
                this.operation = '编辑权限';
                this.currentIndex = index;
                detailPermission(this.list[index].id).then(res => {
                    if (res.data.error === 0) {
                        this.addForm.username = res.data.data.name;
                        this.addForm.description = res.data.data.description;
                        this.addForm.value = res.data.data.permission_key;
                        this.addForm.column = res.data.data.name;
                    } else {
                        this.$message({
                            message: res.data.data,
                            type: 'error',
                            showClose: true
                        });
                    }
                });
            },
            submit() {
                if (this.operation === '添加权限') {
                    this.submitAdd();
                    this.__list();
                } else {
                    this.submitEdit();
                }
                setTimeout(this.__list, 2000);
            },
//            提交添加权限
            submitAdd() {
                this.$refs['addForm'].validate((valid) => {
                    if (valid) {
                        this.centerDialogVisible = false;
                        addPermission(this.addForm.username, this.addForm.value, this.addForm.description, this.addForm.column).then(res => {
                            if (res.data.error === 0) {
                                this.$message({
                                    message: '提交成功',
                                    type: 'success',
                                    showClose: true
                                });
                                this.resetForm();
                            } else {
                                this.$message({
                                    message: res.data.data,
                                    type: 'error',
                                    showClose: true
                                });
                            }
                        });
                    } else {
                        return false;
                    }
                });
            },
//            提交编辑权限
            submitEdit() {
                this.$refs['addForm'].validate((valid) => {
                    if (valid) {
                        this.centerDialogVisible = false;
                        return new Promise((resolve, reject) => {
                            updatePermission(this.list[this.currentIndex].id, this.addForm.username, this.addForm.value, this.addForm.description, this.addForm.column).then(res => {
                                if (res.data.error === 0) {
                                    this.$message({
                                        message: '提交成功',
                                        type: 'success',
                                        showClose: true
                                    });
                                    this.__list();
                                    this.resetForm();
                                } else {
                                    this.message({
                                        message: res.data.data,
                                        type: 'error',
                                        sowClose: true
                                    });
                                }
                                resolve();
                            }).catch(error => {
                                console.log(reject(error));
                            });
                        });
                    } else {
                        return false;
                    }
                });
                this.resetForm();
            },
//            删除权限
            deleteAdmin(index) {
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deletePermission(this.list[index].id).then(res => {
                        if (res.data.error === 0) {
//                            this.visible2 = false;
                            this.$message({
                                type: 'success',
                                message: '删除成功'
                            });
                            this.__list();
                        } else {
                            this.$message({
                                messaeg: res.data.data,
                                type: 'error',
                                showClose: true
                            });
                        }
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
//        重置表单
            resetForm() {
                this.$refs['addForm'].resetFields();
            }
        }
    };
</script>
<style lang="scss">
    @import '../../style/common.scss';
    @import '../../scss/mixin.scss';

    #rightsAllotment {
        padding: 0 15px;

    .hide {
        display: none;
    }
    .pagination{
        text-align: center;
        .el-pagination{
            display:inline-block;
        }
    }
    .rightsAllotmenttop {
        padding: 15px 0;

    span {
    @include span;
    }

    }
    table {
        table-layout: fixed;
    }

    .el-dialog__header {
        text-align: center;
        background: #556386;
        padding: 10px;

    span {
        color: #fff;
    }

    }
    .add {
        margin-bottom: 15px;
    }

    }
</style>
