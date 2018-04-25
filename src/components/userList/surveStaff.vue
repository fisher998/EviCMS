<template>
    <div class="survestaff">
        <div class="top">
            <span style="border-left:2px solid #324157;padding-left:15px;">公测员管理</span>
            <el-form :inline="true" :model="formInline" class="demo-form-inline">
                <el-form-item label="手机号或名称:">
                    <el-input v-model="formInline.user" size="small" @keyup.enter.native="_surveStaffList"></el-input>
                </el-form-item>
                <!--<el-form-item label="状态" label-width="100">-->
                    <!--<el-select v-model="formInline.region" size="small" style="width:100px;">-->
                        <!--<el-option label="已过期" value=1></el-option>-->
                        <!--<el-option label="未注册" value=2></el-option>-->
                        <!--<el-option label="已注册" value=3></el-option>-->
                    <!--</el-select>-->
                <!--</el-form-item>-->
                <el-form-item>
                    <el-button style="background:#999999;color:#fff" @click="_surveStaffList">搜索</el-button>
                    <span>|</span>
                    <el-button type="primary" @click="add()" v-bind:class="{hide:addButton}">添加</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="container">
            <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <thead>
                <tr>
                    <th>手机号</th>
                    <th>公测员名称</th>
                    <th>推荐人名称</th>
                    <th>到期时间</th>
                    <th>赠送余额</th>
                    <th>状态</th>
                    <th>操作</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item, index) in manageDate">
                    <td> <span>(+{{item.area_code}}) {{item.phone}}</span></td>
                    <td>{{item.user_name}}</td>
                    <td>{{item.recommend_user}}</td>
                    <td>{{item.expire_time}}</td>
                    <td><template v-if="item.gift_cash">{{item.gift_cash}}</template>
                        <template v-else>{{item.gift_amount}}</template>
                    </td>
                    <td><span>{{item.status_alias}}</span></td>
                    <td><span style="margin-right:20px;border:1px solid #437DFF;color:#437DFF;"
                              v-bind:class="{hide: editButton}"
                              @click="edit(index)">编辑</span>
                        <span style="border:1px solid;color: #ff4949;" @click="deletestaff(index)"
                              v-bind:class="{hide: deleButton}">删除</span>
                    </td>
                </tr>
                </tbody>
            </table>
            <!--分页-->
            <div class="pagination" v-if="total>15">
                <el-pagination
                    layout="prev, pager, next,total"
                    :total="total"
                    :page-size="size"
                    :current-page.sync="currentPage"
                    @current-change="handleCurrentChange()"
                >
                </el-pagination>
            </div>
        </div>
        <!--添加公测员弹窗-->
        <el-dialog :title="operation" :visible.sync='isVisible'>
            <el-form :label-position="labelPosition" :model="form" ref="form" :rules="rules" label-width="110px">
                <el-form-item label="公测员名称：" prop="surveerName">
                    <el-input v-model="form.surveerName"></el-input>
                </el-form-item>
                <el-form-item label="推荐人名称：" prop="surveerReferral">
                    <el-input v-model="form.surveerReferral"></el-input>
                </el-form-item>
                <!--<el-form-item label="密码：" prop="password">-->
                    <!--<el-input v-model="form.password"></el-input>-->
                <!--</el-form-item>-->
                <el-form-item label="手机号：" prop="phoneNum">
                    <el-col :span="6">
                        <el-select v-model="form.region">
                            <el-option label="(+86)" value="86"></el-option>
                            <!--<el-option label="(+85)" value="85"></el-option>-->
                        </el-select>
                    </el-col>
                    <!--<el-col :span="2"> </el-col>-->
                    <el-col :span="18">
                        <el-input v-model="form.phoneNum" :maxlength="11"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="赠送余额：" prop="vacancies">
                    <el-input v-model="form.vacancies"></el-input>
                </el-form-item>
                <el-form-item label="到期时间：" prop="duetime">
                    <!--<el-input v-model="form.duetime"></el-input>-->
                    <el-date-picker type="date" placeholder="选择日期" v-model="form.duetime"></el-date-picker>
                </el-form-item>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary"
                               size="small"
                               @click="Submit()">提交
                    </el-button>
                    <el-button @click="isVisible = false"
                               size="small">取消
                    </el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>
<script>
    //    import {addetaUser} from '../../api/User';
    import {addetaUser, betaDetail, getBetaList, betaDelete, betaUpdate} from '../../api/User';
    import {contains, translateTime} from '../../assets/public';
    import {isValidMobile} from '../../common/js/validate';

    export default {
        created() {
            this._surveStaffList();
        },
        data() {
            const checkphone = (rule, value, callback) => {
                if (!value) {
                    callback(new Error('手机号不能为空'));
                } else if (!isValidMobile(value)) {
                    callback(new Error('手机号格式不正确'));
                } else {
                    callback();
                }
            };
            return {
                total: 0,
                operation: '添加用户',
                currentPage: 1,
                iseditVisible: false,
                labelPosition: 'left',
                isVisible: false,
                size: 15, // 页面显示大小
                editButton: false, // 显示隐藏编辑按钮
                deleButton: false, // 显示隐藏删除按钮
                addButton: false, // 显示隐藏添加按钮
                List: false, // 显示隐藏列表
                rules: {
                    surveerName: [
                        {required: true, message: '请添加公测员名称', trigger: 'blur'}
                    ],
                    surveerReferral: [
                        {required: true, message: '添加推荐人名称', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '填写密码', trigger: 'blur'}
                    ],
                    phoneNum: [
                        {validator: checkphone, trigger: 'blur'}
                    ],
                    vacancies: [
                        {required: true, message: '填写赠送余额', trigger: 'blur'}
                    ],
                    duetime: [
                        {required: true, message: '请填写到期时间', trigger: 'blur'}
                    ]
                },
                formInline: {
                    user: undefined,
                    region: undefined
                },
                form: {
                    id: '',
                    surveerName: '',
                    surveerReferral: '',
                    phoneNum: '',
                    region: '86',
                    vacancies: '',
                    duetime: ''
//                    password: ''
                },
                currentIndex: 0,
                manageDate: []
            };
        },
        methods: {
//            添加公测员点开按钮
            add() {
                this.isVisible = true;
                this.operation = '添加公测员';
                this.form.surveerName = '';
                this.form.surveerReferral = '';
                this.form.phoneNum = '';
                this.form.vacancies = '';
                this.form.duetime = '';
                this.form.password = '';
            },
//            删除公测员
            deletestaff(index) {
                this.$confirm('确定删除吗，删除后不可恢复！', '', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消'
                }).then(() => {
                    betaDelete(this.manageDate[index].id).then(res => {
                        if (res.data.error === 0) {
                            this.$message({
                                type: 'success',
                                message: '删除成功！'
                            });
                            this._surveStaffList();
                        } else {
                            this.$message({
                                message: res.data.data,
                                type: 'error'
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
//            公测用户列表
            _surveStaffList() {
                getBetaList(this.formInline.user, this.size, this.currentPage).then(res => {
                    this.manageDate = res.data.data.data || [];
                    console.log(this.manageDate);
                    for (let item of this.manageDate) {
                        item.gift_cash = item.gift_cash ? (parseFloat(item.gift_cash) / 100).toFixed(2) : undefined;
                        item.gift_amount = (parseFloat(item.gift_amount) / 100).toFixed(2);
                    }
                    this.total = res.data.data.total;
                });
            },
//            表单提交
            Submit() {
                this.form.duetime = this.form.duetime.toString();
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        if (this.operation === '添加公测员') {
                            this.addSubmit();
                        }
                        if (this.operation === '编辑公测员') {
                            this.updateSubmit();
                        }
                    } else {
                        return false;
                    }
                });
            },
//            公测用户添加
            addSubmit() {
                let phone_code = parseInt(this.form.region);
                let money = this.form.vacancies ? parseFloat(this.form.vacancies).toFixed(2) : 0.00;
                addetaUser(this.form.surveerName, this.form.surveerReferral, this.form.phoneNum, money, translateTime(this.form.duetime), phone_code).then(res => {
                    console.log(res);
                    if (res.data.error === 0) {
                        this.isVisible = false;
                        this._surveStaffList();
                        this.$message({
                            message: '操作成功',
                            type: 'success',
                            showClose: true
                        });
                    } else {
                        this.$message({
                            message: res.data.data,
                            type: 'error',
                            showClose: true
                        });
                    }
                });
            },
            edit(index) {
                this.operation = '编辑公测员';
                this.isVisible = true;
                betaDetail(this.manageDate[index].id).then(res => {
                    if (res.data.error === 0) {
                        console.log(res.data.data);
                        let data = res.data.data;
                        console.log(data);
                        this.form.id = data.id;
                        this.form.surveerName = data.user_name;
                        this.form.surveerReferral = data.recommend_user;
                        this.form.phoneNum = data.phone;
                        this.form.vacancies = ((parseFloat(data.gift_cash) / 100).toFixed(2)).toString();
                        this.form.duetime = data.expire_time;
                    } else {
                        this.$message({
                            message: res.data.error,
                            type: 'error',
                            showClose: true
                        });
                    }
                });
            },
//            公测员编辑
            updateSubmit() {
                let phone_code = parseInt(this.form.region);
              // let timestamp2 = translateTime(Date.parse(new Date(time)));
                betaUpdate(this.form.id, this.form.surveerName, this.form.surveerReferral, phone_code, this.form.phoneNum, this.form.vacancies, translateTime(this.form.duetime)).then(res => {
                    console.log(res);
                    if (res.data.error === 0) {
                        this.$message({
                            type: 'success',
                            message: '成功啦',
                            showClose: true,
                            duration: 3000
                        });
                        this._surveStaffList();
                        this.isVisible = false;
                    }
                });
            },
//            分页功能
            handleCurrentChange() {
                this._surveStaffList();
            },
            // 权限控制
            controlPermission() {
                this.edit = !contains('user_beta_update'); // 是否有编辑权限
                this.dele = !contains('user_beta_delete'); // 是否有删除权限
                this.add = !contains('user_beta_add'); // 是否有添加权限
                this.List = !contains('user_beta_list');  // 是否显示公测员列表
            }
        }
    };
</script>
<style lang="scss" type="text/scss">
    .survestaff {
        padding: 0 15px;
        .hide {
            display: none;
        }
        .top {
            margin: 0;
            padding: 15px 0;
            margin-bottom:20px;
            .el-form {
                margin: 0;
                float: right;
                .el-form-item {
                    margin-bottom: 0px;
                    .el-button {
                        padding: 6px 15px;
                    }
                }
                input {
                    outline: none;
                }
            }
        }

        .container {
            width: 100%;
            th {
                background: #556386;
                color: #fff;
            }
            th, td {
                text-align: center;
                height: 40px;
                line-height: 40px;
                font-size: 14px;
                border-bottom: 1px solid #eee;
                span {
                    cursor: pointer;
                    padding: 3px 6px;
                }
            }
        }
        .pagination {
            text-align: center;
            margin: 15px 0;
            .el-pagination {
                display: inline-block;
            }
        }
        .el-dialog {
            width: 500px;
            .el-dialog__title {
                color: #fff;
            }
            .el-dialog__header {
                text-align: center;
                background: #556386;
                padding: 10px 20px;
            }
        }
    }
</style>
