<!--用户详情-->
<template>
    <div id="userDetail">
        <div class="userDetaiTop">
            <div class="top">
                <span> 用户列表---用户详情</span>
            </div>
        </div>
        <div class="container">
            <div class="userMessage">
                <span>
                    <strong>用户序号：</strong>
                    <small v-if="userdetails.user">{{userdetails.user.user_id}}</small>
                </span>
                <span>
                    <strong>注册时间：</strong>
                    <small v-if="userdetails.user">{{userdetails.user.reg_time}}</small>
                </span>
                <!-- <span>
                    <strong>充值余额（元）：</strong>
                    <small>{{userdetails.cash}}</small>
                </span>
                <span>
                    <strong>储存空间（KB）：</strong>
                <small style="margin-right:20px;">{{userdetails.totalStore}}</small>
                <small>剩余({{userdetails.restStore}})</small>
                    </span> -->
            </div>
            <div class="wrap">
                <div class="balanceLeft">
                    <div class="balance">
                        <div>
                            <strong><h3>账户余额（元）：¥{{form.total}}</h3></strong>
                        </div>
                        <div class="item">
                            <strong>其他充值（元）：</strong>
                            <small>¥{{form.cash}}</small>
                            <!-- <small class="a" @click="refund">退款</small> -->
                        </div>
                        <div class="item">
                            <strong>苹果充值（元）：</strong>
                            <small>¥{{form.apple_cash}}</small>
                        </div>
                        <div class="item">
                            <strong>赠送余额（元）：</strong>
                            <small>¥{{form.gift_cash}}</small>
                            <small class="a" @click="modify">修改</small>
                        </div>
                        <div>
                            <strong><h3>存储空间（KB）</h3></strong>
                        </div>
                        <div class="item">
                            <strong>已使用：</strong>
                            <small>{{userdetails.totalStore - userdetails.restStore}}</small>
                        </div>
                        <div class="item">
                            <strong>总量：</strong>
                            <small>{{userdetails.totalStore}}</small>
                        </div>
                    </div>
                    <div class="storage">
                        <!-- <div>
                            <strong><h3>存储空间（KB）</h3></strong>
                        </div>
                        <div class="item">
                            <strong>已使用：</strong>
                            <small>{{userdetails.totalStore - userdetails.restStore}}</small>
                        </div>
                        <div class="item">
                            <strong>总量：</strong>
                            <small>{{userdetails.totalStore}}</small>
                        </div> -->
                        
                    </div>
                </div>
                <div class="fromcon">
                    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
                        <el-form-item label="手机号：" @keyup.enter.native="handleLogin" :maxlength="11" prop="name">
                            <el-col :span="8">
                                <el-select v-model="form.phone" placeholder="(+86)" :disabled="isUsed">
                                    <el-option label="(+86)" value="(+86)" selected style="width:100%">(+86)</el-option>
                                    <!--<el-option label="(+85)" value="(+85)" style="width:100%">(+85)</el-option>-->
                                </el-select>
                            </el-col>
                            <el-col :span="16">
                                <el-input v-model="form.name" :disabled="isUsed"></el-input>
                            </el-col>
                        </el-form-item>
                        <el-form-item label="密码:">
                            <el-input v-model="form.region" type="password" :disabled="isUsed" placeholder="不修改则留空"></el-input>
                        </el-form-item>
                        <!-- <el-form-item label="赠送余额（元）:">
                            <el-input v-model="form.gift_cash" :disabled="isUsed"></el-input>
                        </el-form-item> -->
                        <el-form-item label="修改原因：" prop="reason">
                            <el-input v-model="form.reason" :disabled="isUsed"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="handle">{{operate}}</el-button>
                            <el-button @click="back">返回</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
            <!-- <div class="balance_left">
                <div class="balance">
                    <div>
                        <strong><h3>账户余额（元）：¥{{userdetails.cash}}</h3></strong>
                    </div>
                    <div>
                        <strong>其他充值（元）：</strong>
                        <small>¥{{userdetails.cash}}</small>
                        <a href="">退款</a>
                    </div>
                    <div>
                        <strong>苹果充值（元）：</strong>
                        <small>¥{{userdetails.apple_cash}}</small>
                    </div>
                    <div>
                        <strong>赠送余额（元）：</strong>
                        <small>¥{{userdetails.gift_cash}}</small>
                        <a href="">修改</a>
                    </div>
                </div>
                <div class="storage">
                    <div>
                        <strong><h3>存储空间（KB）</h3></strong>
                    </div>
                    <div>
                        <strong>已使用：</strong>
                        <small>{{userdetails.totalStore - userdetails.restStore}}</small>
                    </div>
                    <div>
                        <strong>总量：</strong>
                        <small>{{userdetails.totalStore}}</small>
                    </div>
                    
                </div>
            </div> -->
            <!-- <div class="fromcon">
                <el-form ref="form" :model="form" :rules="rules" label-width="120px">
                    <el-form-item label="手机号：" @keyup.enter.native="handleLogin" :maxlength="11" prop="name">
                        <el-col :span="8">
                            <el-select v-model="form.phone" placeholder="(+86)" :disabled="isUsed">
                                <el-option label="(+86)" value="(+86)" selected style="width:100%">(+86)</el-option>
                                <el-option label="(+85)" value="(+85)" style="width:100%">(+85)</el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="16">
                            <el-input v-model="form.name" :disabled="isUsed"></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="密码:">
                        <el-input v-model="form.region" type="password" :disabled="isUsed" placeholder="不修改则留空"></el-input>
                    </el-form-item>
                    <el-form-item label="赠送余额（元）:">
                        <el-input v-model="form.type" :disabled="isUsed"></el-input>
                    </el-form-item>
                    <el-form-item label="修改原因：" prop="reason">
                        <el-input v-model="form.reason" :disabled="isUsed"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="handle">{{operate}}</el-button>
                        <el-button @click="back">返回</el-button>
                    </el-form-item>
                </el-form>
            </div> -->
            <el-dialog :visible.sync="modifyStatus" size="tiny" title="修改赠送余额">
                <div class="dialog">
                    <el-form>
                    <el-form-item label="赠送余额（元）:">
                        <el-input v-model="form.gift_cash"></el-input>
                    </el-form-item>
                </el-form>
                <div class="button">
                    <el-button class="beginForensics" @click="noModify">取消</el-button>
                    <el-button class="searchFile" type="primary" @click="confirmModify">确定</el-button>
                </div>
                </div>
            </el-dialog>
        </div>
    </div>
</template>
<script>
    import {editUser, userDetail} from '../../../api/User';
    import {isValidMobile} from '../../../common/js/validate';
    const checkphone = (rule, value, callback) => {
        if (!value) {
            callback(new Error('手机号不能为空'));
        } else if (!isValidMobile(value)) {
            callback(new Error('手机号格式错误'));
        } else {
            callback();
        }
    };
    const checkreason = (rule, value, callback) => {
        if (value === '') {
            callback(new Error('原因必填'));
        } else {
            callback();
        }
    };
    export default {
        created() {
            this._userMessage();
        },
        data() {
            return {
                modifyStatus: false,
                operate: '修改',
                labelPosition: 'right',
                isUsed: true,
                rules: {
                    name: [{validator: checkphone, trigger: 'blur'}],
                    reason: [{validator: checkreason, trigger: 'blur'}]
                },
                form: {
                    name: '',
                    region: '',
                    gift_cash: '',
                    phone: '+86',
                    reason: '',
                    apple_cash: '',
                    cash: '',
                    total: ''
                },
                userdetails: {}
            };
        },
        methods: {
            editSubmit() {
                if (this.isUsed) {
                    this.isUsed = false;
                    this.operate = '保存';
                } else {
                    this.save();
                }
            },
            save() {
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        let num = parseFloat(this.form.gift_cash);
                        let phone = parseInt(this.form.phone);
                        editUser(this.$route.params.detailId, this.form.name, this.form.region || 0, phone, num.toFixed(2), this.form.reason).then(res => {
                            if (res.data.error === 0) {
                               this.$message({
                                   message: '保存成功',
                                   type: 'success',
                                   showClose: true
                               });
                               this.$router.go(-1);
                                // this.form.name = '';
                                // this.form.region = '';
                                // this.form.type = '';
                                // this.form.phone = '';
                                // this.form.reason = '';
                            } else {
                                this.$message({
                                    message: res.data.data,
                                    type: 'error',
                                    showClose: true
                                });
                            }
                        });
                    } else {
                       // console.log('error submit!!');
                        return false;
                    }
                });
            },
            _userMessage() {
                userDetail(this.$route.params.detailId).then(res => {
                    let detail = res.data.data;
                    console.log(detail);
                    this.userdetails = detail || [];
                    this.isUsed = false;
                    this.form.name = detail.user.cell_phone;
                    this.form.gift_cash = (detail.gift_cash / 100).toFixed(2);
                    this.form.apple_cash = (detail.apple_cash / 100).toFixed(2);
                    this.form.cash = (detail.cash / 100).toFixed(2);
                    this.isUsed = true;
                    this.form.total = ((detail.gift_cash / 100) + (detail.apple_cash / 100) + (detail.cash / 100)).toFixed(2);
                });
            },
            handle() {
                if (this.operate === '修改') {
                    this.editSubmit();
                } else {
//                    console.log(this.form.name);
                    this.save();
                }
            },
            back() {
                this.$router.go(-1);
            },
            refund() {
                this.$confirm('确定要为该用户退款么？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'info'
            }).then(() => {
                this.$message({
                    type: 'info',
                    message: '退款成功'
                });
            }).catch(() => {
                this.$message({
                    type: 'warning',
                    message: '取消退款'
                });
             });
            },
            modify() {
                this.modifyStatus = true;
                // console.log('修改');
                // if (this.isUsed) {
                //     this.isUsed = false;
                //     this.operate = '保存';
                // } else {
                //     this.save();
                // }
            },
            noModify() {
                this.$message({
                    type: 'warning',
                    message: '取消修改赠送余额'
                });
                this.modifyStatus = false;
            },
            confirmModify() {
                let num = parseFloat(this.form.gift_cash);
                let phone = parseInt(this.form.phone);
                editUser(this.$route.params.detailId, this.form.name, this.form.region || 0, phone, num.toFixed(2), this.form.reason).then(res => {
                            if (res.data.error === 0) {
                               this.$message({
                                   message: '保存成功',
                                   type: 'success',
                                   showClose: true
                               });
                               this.$router.go(-1);
                            } else {
                                this.$message({
                                    message: res.data.data,
                                    type: 'error',
                                    showClose: true
                                });
                            }
                        });
            }
        }
    };
</script>
<style lang="scss" type="text/scss">
    @import '../../../scss/mixin.scss';

    #userDetail {
        padding: 0 15px;
        .top {
            padding: 15px 0;
            span {
               @include span;
            }
        }
        .fromcon{
            display:flex;
            display:-webkit-flex;
            justify-content: center;
            -webkit-justify-content: center;
            align-items: center;
            -webkit-align-items: center;
            min-height: calc( 100vh - 190px);
            .el-form-item {
                position: relative;
            }
            .el-form-item:last-child{
                margin-bottom:0;
            }

            .el-form-item__label {
                text-align: left
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
                @include dotted(#eb5d41);
            }
            .el-button {
                border-radius: 0;
                padding: 10px 50px;
            }

            .el-input__inner {
                border-radius: 0;
            }
        }
        .userMessage {
            padding: 0 15px;
            border-bottom: 1px solid #eee;
            span {
                display: inline-block;
                margin: 20px 0;
                padding: 0 50px;
                border-right: 1px solid #eee;
                &:last-child {
                    border: 0;
                }
            }

        }
        .container {
            background: #fff;
            min-height: calc(100vh - 110px);
            position: relative;
            // display: flex;
            .el-form {
                width: 400px;
            }
            .wrap{
                display: flex;
                color: rgb(109, 108, 108);
                .item{
                    margin-top: 10px;
                }
                .balanceLeft{
                    display:flex;
                    align-items: center;
                    -webkit-align-items: center;
                    flex: 1;
                    margin-left: 100px;
                    .balance{
                        h3{
                            padding-bottom: 10px;
                        }
                        .a{
                            margin-left: 10px;
                            color: #437DFF;
                            text-decoration:underline;
                            cursor: pointer;
                        }
                    }
                    .storage{
                        // margin-top: 50px;
                    }
                }
                .fromcon{
                    flex: 2;
                }
                
            }
            .dialog{
                    padding-left: 20%;
                }
        }
    }

</style>
