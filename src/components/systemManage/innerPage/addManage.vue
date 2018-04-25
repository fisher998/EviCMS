<!--添加管理员-->
<template>
    <div class="addadmin-wrapper">
        <div>
            <div class="top">
                <span>管理员管理--{{title}}</span>
            </div>
        </div>
        <div class="container">
            <el-form ref="form" :label-position="labelPosition" :model="form" label-width="120px">
                <el-form-item label="管理员账号：">
                    <el-input v-model="form.account"></el-input>
                </el-form-item>
                <el-form-item label="管理员姓名:">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="登录密码:">
                    <el-input v-model="form.password" :placeholder="pass" type="password"></el-input>
                </el-form-item>
                <el-form-item label="手机号:"
                              :maxlength="11">
                    <el-input v-model="form.phone"></el-input>
                </el-form-item>
                <el-form-item label="管理员角色:">
                    <el-col :span="12">
                        <el-select v-model="id" placeholder="请选择">
                            <el-option
                                v-for="item in form.options"
                                :key="item.id"
                                :label="item.name"
                                autocomplete="off"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="6">&nbsp;</el-col>
                    <el-col :span="4">
                        <el-button type="warning" style="margin-left:-20px;" @click="AdminSubmit">提交</el-button>
                    </el-col>
                </el-form-item>
                <el-col :span="4">
                        <el-button type="primary" style="margin-left:-20px;" @click="goBack">返回</el-button>
                </el-col>
            </el-form>
        </div>
    </div>
</template>
<script>
    import {addAdmin, getRole, adminDetail, editAdmin} from '../../../api/setuser';

    export default {
        created() {
            this._getOptions();
            this.adminDetail();
        },
        data() {
            return {
                labelPosition: 'left',
                title: '添加管理员',
                pass: '',
                id: '',
                form: {
                    account: '',
                    name: '',
                    password: '',
                    phone: '',
                    options: []
                }
            };
        },
        computed: {
            cert_id() {
                return parseInt(this.$route.params.userId);
            }
        },
        methods: {
//            添加管理员
            addAdminSubmit() {
                let form = this.form;
                addAdmin(form.account, form.name, form.password, form.phone, this.id).then(res => {
                    if (res.data.error === 0) {
                        this.$message({
                            type: 'warning',
                            message: '添加管理员成功',
                            showClose: true,
                            duration: 2000
                        });
                        this.clear();
                        this.$router.go(-1);
                    } else {
                        this.$message({
                            type: 'warning',
                            message: res.data.data,
                            showClose: true,
                            duration: 2000
                        });
                    }
                });
            },
//            成功提示
            clear() {
                this.form.account = '';
                this.form.name = '';
                this.form.password = '';
                this.form.phone = '';
            },
          // 获取角色信息*
            _getOptions() {
                getRole().then(res => {
                    res = res.data;
                    this.form.options = res.data;
                });
            },
            //        管理员详情
            adminDetail() {
                if (this.cert_id !== 0) {
                    this.title = '编辑管理员';
                    this.pass = '密码不修改不填';
                    adminDetail(this.cert_id).then(res => {
                       if (res.data.error === 0) {
                           res = res.data.data;
                           this.form.account = res.username;
                           this.form.name = res.name;
                           this.form.phone = res.phone;
                           this.id = res.role_id;
                       } else {
                           this.$message({
                               message: res.data.data,
                               type: 'error',
                               showClose: true
                           });
                       }
                    });
                } else {
                   this.title = '添加管理员';
                    this.pass = '';
                   this.clear();
                }
            },

            // 编辑管理员
            editAdminSubmit() {
                editAdmin(this.cert_id, this.form.account, this.form.name, this.form.password, this.form.phone, this.id).then(res => {
                    if (res.data.error === 0) {
                        this.$message({
                            type: 'success',
                            message: '编辑管理员成功',
                            showClose: true,
                            duration: 2000
                        });
                        this.clear();
                        this.$router.go(-1);
                    } else {
                        this.$message({
                            message: res.data.data,
                            type: 'error',
                            showClose: true
                        });
                    }
                });
            },
            AdminSubmit() {
                if (this.cert_id === 0) {
                    this.addAdminSubmit();
                } else {
                    this.editAdminSubmit();
                }
            },
            goBack() {
                this.$router.go(-1);
            }
        }
    };
</script>
<style lang="scss" scoped>
    @import '../../../scss/mixin.scss';

    .addadmin-wrapper {
        padding: 0 15px;

    .el-form-item {
        position: relative;
    }

    .el-form-item__label {
        text-align: left
    }

    .top {
        padding: 15px 0;

    span {
    @include span;
    }

    }
    .el-form-item:nth-child(1)::before {
    @include dotted(#437DFF);
    }

    .el-form-item:nth-child(2)::before {
    @include dotted(#5ED27C);
    }

    .el-form-item:nth-child(3)::before {
    @include dotted(#F5CF68);
    }

    .el-form-item:nth-child(4)::before {
    @include dotted(#EB5F43);
    }

    .el-form-item:nth-child(5)::before {
    @include dotted(#6243FF);
    }

    .el-button {
        border-radius: 0;
        padding: 10px 30px;
    }

    .el-input__inner {
        border-radius: 0;
    }

    .addUser-wrapper {
        position: fixed;
        top: 40px;
        left: 230px;
        right: 25px;
        bottom: 25px;
        background: #fff;
    }

    .el-form {
        width: 400px;
    }

    .container {
        background: #fff;
        min-height: calc(100vh - 120px);
        overflow: hidden;

    }

    .container .el-form {
        margin: 0 auto;
        margin-top: 100px;
    }

    }

</style>
