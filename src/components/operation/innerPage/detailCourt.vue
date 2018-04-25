<template>
    <div id="detailCourt">
        <div class="detailCourtTop">
            <span>出庭管理--出庭详情</span>
        </div>
        <div class="message">
            <div class="order-number">
            <span>
                <i></i>
                <strong>用户：</strong>
                <small>{{user.cell_phone}}</small>
            </span>
                <span>
                     <i></i>
                <strong>用户序号：</strong>
                <small>{{user.user_id}}</small>
            </span>
                <span>
                     <i></i>
                <strong>存证编号：</strong>
                <small>{{certapply.cert_no}}</small>
            </span>
                <el-button type="success" @click="preview" style="float:right">预览</el-button>
            </div>
            <div class="gressBar">
                <el-steps :space="300" :active="status" align-center>
                    <el-step title="用户申请" :description="request_time"></el-step>
                    <el-step title="联系确认" :description="confirm_time"></el-step>
                    <el-step title="出庭作证完成" :description="finish_time"></el-step>
                </el-steps>
            </div>
        </div>
        <div class="communication">
            <div class="communicationTitle">
                <i></i>
                <span>沟通记录</span>
                <span style="float:right">
                    <button :class="{hide: isAdd}" @click="addcom">+</button>
                </span>
            </div>
            <div style="padding:20px 0;">
                <table cellpadding="0" cellspacing="0" border="0">
                    <thead>
                    <tr>
                        <th>沟通时间</th>
                        <th>沟通内容</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item,index) in communicationRecord">
                        <td>{{item.add_time}}</td>
                        <td @click="opendetailLog(index)"><a href="javascript:void(0);">{{item.content}}</a></td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="trailMessage">
            <div class="trailTitle">
                <i></i>
                <strong>出庭信息</strong>
            </div>
            <div class="trailForm">
                <el-form :inline="true" :label-position="labelPosition" :model="formInline" class="demo-form-inline"
                         label-width="100px">
                    <el-form-item label="姓名：">
                        <el-input v-model="formInline.username" :disabled="isdisabled"></el-input>
                    </el-form-item>
                    <el-form-item label="支付日期：">
                        <el-date-picker
                            v-model="formInline.datatime"
                            type="date"
                            :disabled="isdisabled"
                            placeholder="选择日期">
                        </el-date-picker>
                        <!--<el-input v-model="formInline.datatime" :disabled="isdisabled"></el-input>-->
                    </el-form-item>
                    <el-form-item label="地点：">
                        <el-input v-model="formInline.address" :disabled="isdisabled"></el-input>
                    </el-form-item>
                    <el-form-item label="支付金额：">
                        <el-input v-model="formInline.money" :disabled="isdisabled"></el-input>
                    </el-form-item>
                    <el-form-item label="出庭人员:">
                        <el-input v-model="formInline.trailPerson" :disabled="isdisabled"></el-input>
                    </el-form-item>
                    <el-form-item label="支付方式：">
                        <template>
                            <el-select v-model="formInline.method" :disabled="isdisabled" placeholder="请选择">
                                <el-option
                                    v-for="item in formInline.options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </template>
                        <!--<el-input v-model="formInline.method"  :disabled="isdisabled"></el-input>-->
                    </el-form-item>
                    <el-form-item label="交通方式：">
                        <template>
                            <el-select v-model="formInline.transportation" :disabled="isdisabled" placeholder="请选择">
                                <el-option
                                    v-for="item in formInline.options2"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </template>
                        <!--<el-input v-model="formInline.transportation" :disabled="isdisabled"></el-input>-->
                    </el-form-item>
                    <el-form-item label="交易备注:">
                        <el-input v-model="formInline.tradingNote" :disabled="isdisabled"></el-input>
                    </el-form-item>
                    <el-form-item label="住宿情况:">
                        <el-input v-model="formInline.commodity" :disabled="isdisabled"></el-input>
                    </el-form-item>
                </el-form>
                <div class="submit">
                    <el-button type="info" :class="{hidden: vision}" @click="onSubmit()">{{operation}}</el-button>
                    <el-button type="warning" :class="{hidden: vision}" @click="buttonSubmit(2)">交易确认</el-button>
                    <el-button type="success" :class="{hidden: hide}" @click="buttonSubmit(3)">出庭完成</el-button>
                </div>
            </div>
        </div>
        <!--沟通内容弹窗-->
        <el-dialog
            title="沟通内容"
            :visible.sync="addVisible"
            width="30%"
        >
            <el-input
                type="textarea"
                :maxlength="230"
                v-model="addcontent"
                auto-complete="off"
            ></el-input>
            <el-button type="primary" @click="communityContent">确 定</el-button>
            <el-button @click="addVisible = false">取 消</el-button>
            </span>
        </el-dialog>
        <!--沟通详情弹窗-->
        <el-dialog
            title="沟通详情"
            :visible.sync="detailVisible"
            width="30%"
        >
            <el-input
                type="textarea"
                v-model="detailcontent"
                auto-complete="off"
                readonly
                :rows=6
                resize="none"
            ></el-input>
            <el-button type="primary" @click="detailVisible = false">关闭</el-button>
        </el-dialog>
    </div>
</template>
<script>
    import {courtDetail, courtUpdate, courtCommunicate} from '../../../api/operation';
    import {translateTime} from '../../../assets/public';
    import {mapActions} from 'vuex';

    export default {
        created() {
            this._detailMessage();
        },
        data() {
            return {
                labelPosition: 'left',
                user: '',
                hide: true, // 判断最后一个按钮显示还是隐藏
                vision: false, // 判断前两个按钮显示还是隐藏
                isAdd: false,
                status: 1,
                operation: '编辑', // 操作，保存还是编辑
                isdisabled: true, // 表单是否可编辑
                certapply: '',
                addVisible: false,
                detailVisible: false,
                addcontent: '',
                request_time: '', // 申请时间
                confirm_time: '', // 联系确认时间
                finish_time: '', // 完成时间
                detailcontent: '',
                formInline: {
                    username: '',
                    datatime: '',
                    address: '',
                    money: '',
                    trailPerson: '',
                    method: '',
                    transportation: '',
                    tradingNote: '',
                    commodity: '',
                    url: '',
                    options: [{
                        value: 1,
                        label: '支付宝'
                    }, {
                        value: 2,
                        label: '微信'
                    }, {
                        value: 3,
                        label: '银行转账'
                    }, {
                        value: 4,
                        label: '现金结算'
                    }, {
                        value: 5,
                        label: '其他'
                    }],
                    options2: [{
                        value: 1,
                        label: '高铁'
                    }, {
                        value: 2,
                        label: '汽车'
                    }, {
                        value: 3,
                        label: '飞机'
                    }, {
                        value: 4,
                        label: '轮渡'
                    }, {
                        value: 5,
                        label: '其他'
                    }]
                },
                communicationRecord: []
            };
        },
        methods: {
            addcom() {
                this.addVisible = true;
                this.addcontent = '';
            },
            // 沟通内容
            communityContent() {
                if (this.addcontent.length <= 240) {
                    courtCommunicate(this.$route.params.courtId, this.addcontent).then(res => {
                        if (res.data.error === 0) {
                            this.$message({
                                message: '添加成功',
                                type: 'success',
                                showClose: true
                            });
                            this._detailMessage();
                        } else {
                            this.$message({
                                message: res.data.data,
                                type: 'error',
                                showClose: true
                            });
                        }
                        this.addVisible = false;
                    });
                } else {
                    this.$message({
                        message: '沟通内容不能超过240字',
                        type: 'warning',
                        showClose: true
                    });
                }
            },
            onSubmit() {
                if (this.isdisabled) {
                    this.operation = '保存';
                    this.isdisabled = false;
                } else {
                    this.buttonSubmit(1); // 保存信息
                }
            },
            // 三个提交按钮
            buttonSubmit(num) {
                let number = num;
                if (num !== 1) {
                    courtUpdate(this.$route.params.courtId, num)
                        .then(res => {
                            if (res.data.error === 0) {
                                this.$message({
                                    message: '保存成功',
                                    type: 'success',
                                    showClose: true
                                });
                                if (number === 2) {
                                    this.hide = false;
                                }
                                if (number === 3) {
                                    this.hide = true; // 判断最后一个按钮显示还是隐藏
                                    this.vision = true; // 判断前两个按钮显示还是隐藏
                                    this.isAdd = true; // 加号隐藏
                                } else {
                                    this.isdisabled = false;
                                    this.operation = '编辑';
                                    this.isdisabled = true;
                                }
                                this._detailMessage();
                            } else {
                                this.$message({
                                    message: res.data.data,
                                    type: 'error',
                                    showClose: true
                                });
                            }
                        });
                    this.waitToDo();
                } else {
                    let money = parseInt(this.formInline.money).toFixed(2) || 0.00;
                    courtUpdate(this.$route.params.courtId, num, this.formInline.username, translateTime(this.formInline.datatime), this.formInline.address, money, this.formInline.trailPerson, this.formInline.method, this.formInline.transportation, this.formInline.tradingNote, this.formInline.commodity)
                        .then(res => {
                            if (res.data.error === 0) {
                                this.$message({
                                    message: '保存成功',
                                    type: 'success',
                                    showClose: true
                                });
                                if (number === 2) {
                                    this.hide = false;
                                }
                                if (number === 3) {
                                    this.hide = true; // 判断最后一个按钮显示还是隐藏
                                    this.vision = true; // 判断前两个按钮显示还是隐藏
                                    this.isAdd = true; // 加号隐藏
                                } else {
                                    this.isdisabled = false;
                                    this.operation = '编辑';
                                    this.isdisabled = true;
                                }
                                this._detailMessage();
                            } else {
                                this.$message({
                                    message: res.data.data,
                                    type: 'error',
                                    showClose: true
                                });
                            }
                        });
                }
            },
            _detailMessage() {
                courtDetail(this.$route.params.courtId).then(res => {
                    if (res.data.error === 0) {
                        let result = res.data.data;
                        let court_trade = result.court_trade;
                        let file = result.certfile;
                        this.user = result.user;
                        this.certapply = result.certapply;
                        let status = parseInt(result.status);
                        this.request_time = result.request_time;
                        this.confirm_time = result.confirm_time;
                        this.finish_time = result.finish_time;
                        this.communicationRecord = result.court_communication;
                        if (court_trade) {
                            this.formInline.username = court_trade.username;
                            this.formInline.datatime = court_trade.trade_time;
                            this.formInline.address = court_trade.address;
                            this.formInline.money = (court_trade.trade_money / 100).toFixed(2);
                            this.formInline.trailPerson = court_trade.court_user;
                            this.formInline.method = court_trade.trade_type;
                            this.formInline.transportation = court_trade.transport;
                            this.formInline.tradingNote = court_trade.remark;
                            this.formInline.commodity = court_trade.lodging;
                        }
                        this.url = file.source_file_url;
                        if (status === 0 || status === 4) {
                            this.status = 1;
                        } else if (status === 1) {
                            this.status = 2;
                            this.hide = false;
                            this.vision = true;
                        } else if (status === 2) {
                            this.status = 3;
                            this.hide = true; // 判断最后一个按钮显示还是隐藏
                            this.vision = true; // 判断前两个按钮显示还是隐藏
                            this.isAdd = true; // 加号隐藏
                        }
                    }
                });
            },
            opendetailLog(index) {
                this.detailVisible = true;
                this.detailcontent = this.communicationRecord[index].content;
            },
            // 预览
            preview() {
                if (this.url) {
                    window.open(this.url);
                }
                return false;
            },
            ...mapActions([
                'waitToDo'
            ])
        }
    };
</script>
<style lang="scss" type="text/scss">
    @import '../../../style/common.scss';
    @import '../../../scss/mixin';

    #detailCourt {
        padding: 0 15px;
        .hidden {
            display: none;
        }
        .detailCourtTop {
            padding: 15px 0;

            span {
                @include span;
            }
        }
        .message {
            background: #fff;
            padding: 0 15px;
            .gressBar {
                padding: 15px 0;
            }
            .order-number {
                padding: 20px 0;
                border-bottom: 1px solid #eee;
            }

            th {
                background: #6392ff;
            }
            .el-steps {
                text-align: center;
            }

        }
        .order-number > span {
            display: inline-block;
            width: 240px;
            position: relative;
            padding-left: 30px;
            &:first-child i {
                @include dotted(#31C071);
                top: 6px;
                left: 0;
            }
            &:nth-child(2) i {
                @include dotted(#6392ff);
                top: 6px;
                left: 0;
            }
            &:nth-child(3) i {
                @include dotted(#FE5241);
                top: 6px;
                left: 0;
            }
        }
        table {
            table-layout: fixed;
            .el-input {
                display: inline-block;
                width: 200px;
            }
            td {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                &:last-child {
                    a {
                        color: #333;
                        padding: 2px 0;
                        &:hover {
                            text-decoration: underline;
                        }
                    }
                }
            }

            .el-input {
                width: 500px;
            }

        }
        .trailMessage {
            background: #fff;
            margin-top: 15px;
            padding: 15px;
            .trailTitle {
                padding-bottom: 15px;
                border-bottom: 1px solid #eee;
            }
        }
        .communication {
            background: #fff;
            margin-top: 15px;
            position: relative;
            padding: 0 15px;
            & i {
                @include dotted(#4780FF);
                top: 15px;
                left: 15px;
            }
            span {
                margin-left: 20px;
            }
            .communicationTitle {
                border-bottom: 1px solid #eee;
                padding: 15px 0;
                button {
                    background: #4780FF;
                    color: #fff;
                    border: 0;
                }
            }
        }
        .trailForm {
            padding: 15px 0;
        }
        .submit {
            display: flex;
            width: 700px;
            margin: 0 auto;
            justify-content: space-between;
        }
        .el-dialog .el-textarea {
            margin-bottom: 15px;
        }
        .el-select {
            width: 194px;
        }
    }
</style>
