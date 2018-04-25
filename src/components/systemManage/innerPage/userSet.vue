<template>
    <div id="userSet">
        <div class="userSetTop">
            <span>管理员设置--角色设置</span>
        </div>
        <div class="userSettable">
            <div class="usertable">
                <table cellspacing="0" cellpadding="0" border="0">
                    <thead>
                    <tr>
                        <th>角色</th>
                        <th>操作</th>
                    </tr>
                    </thead>
                    <tbody v-bind:class="{hide:roleList}">
                    <tr v-for="(item,index) in userMessage">
                        <td style="border-right:0">{{item.name}}</td>
                        <td style="border-left:0">
                            <el-button size="mini" v-bind:class="{hide: roleSet}" type="primary" @click="toNextPage(index)">
                                权限设置
                            </el-button>
                            <el-button size="mini" type="warning" @click="editUser(index)" v-bind:class="{hide:roleEdit}">编辑</el-button>
                            <el-button size="mini" @click="duerdel(index)" v-bind:class="{hide:roleDele}">删除</el-button>
                        </td>
                    </tr>
                    </tbody>
                </table>
                <el-button type="primary" @click="addUser" v-bind:class="{hide:roleAdd}"style="float:left">添加角色</el-button>
                <el-button type="primary" @click="goBack" style="float:right">返回</el-button>
            </div>
        </div>
        <!--添加角色-->
        <div>
            <el-dialog :visible.sync="adduserVisible" :title="operation" class="adduserForm">
                <el-form :model="adduserForm">
                    <el-form-item label="角色名称：" label-width="100px" :error="submitError.username">
                        <el-input v-model="adduserForm.username"></el-input>
                    </el-form-item>
                    <el-form-item label="角色描述：" label-width="100px" :error="submitError.description">
                        <el-input v-model="adduserForm.description"></el-input>
                    </el-form-item>
                    <el-form-item style="display:flex;justify-content: space-around">
                        <el-button type="primary" @click.native="Submit">确定</el-button>
                        <el-button @click="adduserVisible=false">取消</el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>
        </div>

    </div>
</template>
<script>
    import {getRole, addRole, detailRoles, updateRoles, deleteRole} from '../../../api/setuser';
    import {contains} from '../../../assets/public';
    //    updateRoles, detailRoles, deleteRole
    export default {
        created() {
            this.updateList();
            this.permissionControl();
        },
        data() {
            return {
                roleSet: false, // 是否有设置权限
                roleEdit: false, // 是否有编辑权限
                roleDele: false, // 是否有删除权限
                roleList: false, // 是否显示权限列表
                roleAdd: false, // 是否有添加角色权限
                operation: '',
                adduserVisible: false,
                currentIndex: '',
                submitError: {
                    username: '',
                    description: ''
                },
                adduserForm: {
                    username: '',
                    description: ''
                },
                userMessage: []
            };
        },
        methods: {
            duerdel(index) {
                this.$confirm('确定删除吗?删除后该角色下的用户将失去所有权限', '', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消'
                }).then(() => {
                    deleteRole(this.userMessage[index].id).then(res => {
                        if (res.data.error === 0) {
                            this.$message({
                                type: 'success',
                                message: '删除成功！'
                            });
                            this.updateList();
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.data.data
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
            Submit() {
                if (this.operation === '添加角色') {
                    this.addUserSubmit();
                } else {
                    this.editUserSubmit(this.userMessage[this.currentIndex].id);
                }
            },
            //     更新列表
            updateList() {
                getRole().then((res) => {
                    res = res.data;
                    if (res.error === 0) {
                        this.userMessage = res.data || [];
                    }
                });
            },
//            到权限设置页
            toNextPage(index) {
                this.$router.push({name: 'adminPermission', params: {adminPer_id: this.userMessage[index].id}});
            },
//            打开添加角色弹窗
            addUser() {
                this.adduserVisible = true;
                this.operation = '添加角色';
            },
//            打开编辑角色弹窗
            editUser(index) {
                this.adduserVisible = true;
                this.operation = '编辑角色';
                this.currentIndex = index;
                this.showDetail(this.userMessage[this.currentIndex].id);
            },
//        添加角色
            addUserSubmit() {
                if (this.adduserForm.username === '') {
                    this.submitError.username = '权限名不能为空';
                    return false;
                } else if (this.adduserForm.description === '') {
                    this.submitError.description = '权限描述不能为空';
                    return false;
                } else {
                    addRole(this.adduserForm.username, this.adduserForm.description).then((res) => {
                        if (res.data.error === 0) {
                            this.$message({
                                message: '添加成功，请稍等',
                                type: 'warning',
                                showClose: true,
                                duration: 2000
                            });
                            this.updateList();
                            this.adduserVisible = false;
                        } else {
                            this.$message({
                                message: res.data.data,
                                type: 'error',
                                showClose: true
                            });
                            this.applyDialogVisible = false;
                        }
                    });
                }
            },
//            编辑角色提交
            editUserSubmit() {
                if (this.adduserForm.username === '') {
                    this.submitError.username = '权限名不能为空';
                    return false;
                } else if (this.adduserForm.description === '') {
                    this.submitError.description = '权限描述不能为空';
                    return false;
                } else {
                    updateRoles(this.userMessage[this.currentIndex].id, this.adduserForm.username, this.adduserForm.description).then((res) => {
                        if (res.data.error === 0) {
                            this.$message({
                                message: '编辑成功，请稍等',
                                type: 'warning',
                                showClose: true,
                                duration: 2000
                            });
                            this.updateList();
                            this.adduserVisible = false;
                        } else {
                            this.$message({
                                message: res.data.data,
                                type: 'error',
                                showClose: true
                            });
                            this.applyDialogVisible = false;
                        }
                    });
                }
            },
//            显示角色详情
            showDetail(index) {
                detailRoles(index).then(res => {
                    if (res.data.error === 0) {
                        this.adduserForm.username = res.data.data.name;
                        this.adduserForm.description = res.data.data.description;
                    } else {
                        this.$message({
                            message: res.data.data,
                            type: 'error',
                            showClose: true
                        });
                    }
                });
            },
            // 权限控制函数
            permissionControl() {
//                console.log(localStorage.getItem('permission'));
               this.roleSet = !contains('admin_roles_ownpermission'); // 是否有权限设置
                this.roleEdit = !contains('admin_roles_update'); // 是否有角色编辑
                this.roleDele = !contains('admin_roles_delete'); // 是否有角色删除
                this.roleList = !contains('admin_roles_list'); // 是否显示角色列表
                this.roleAdd = !contains('admin_roles_add'); // 是否有添加角色权限
            },
            goBack() {
                this.$router.go(-1);
            }
        }
    };
</script>
<style lang="scss">
    @import '../../../scss/mixin.scss';

    #userSet {
        .hide{
            display:none;
        }
        padding: 0 15px;

    .userSetTop {
        padding: 15px 0;

    span {
    @include span;
    }

    }
    .adduserForm {
        width: 800px;
        margin: 100px auto;

    .el-dialog__header {
        padding: 10px;
        text-align: center;
        background: #556386;

    span {
        color: #fff;
    }

    }

    }
    .userSettable {
        background: #fff;
        height: calc(100vh - 220px);
        padding-top: 100px;

    .usertable {
        width: 500px;
        margin: 0 auto;

    table {
        width: 100%;
        margin-bottom: 15px;

    th {
        background: #eee;
        color: #333;
    }

    th, td {
        padding: 5px 0;
        text-align: center;
    }

    /*td span {*/
    /*border: 1px solid;*/
    /*color: #99B4FF;*/
    /*margin: 0 10px;*/
    /*cursor: pointer;*/
    /*}*/

    td {
        border: 1px solid #eee;
    }

    }

    }
    }
    }
</style>
