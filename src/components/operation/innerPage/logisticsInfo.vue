<template>
    <div id="logisticInfo">
        <div class="logisticInfo">
            <strong>物流信息</strong>
        </div>
        <div class="logisticInfoForm">
            <div class="datos">
                <el-form :label-position="labelPosition" :rules="rules" ref="formLabelAlign" label-width="90px"
                         :model="formLabelAlign">
                    <el-form-item label="投递时间:" prop="time">
                        <el-date-picker
                            :disabled="isused"
                            v-model="formLabelAlign.time"
                            type="datetime"
                            placeholder="选择日期时间">
                        </el-date-picker>
                        <!--<el-input v-model="formLabelAlign.time"></el-input>-->
                    </el-form-item>
                    <el-form-item label="快递公司:" prop="company">
                        <el-select v-model="formLabelAlign.company" :disabled="isused" placeholder="请选择">
                            <el-option
                                v-for="item in formLabelAlign.options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                        <!--<el-input v-model="formLabelAlign.company"></el-input>-->
                    </el-form-item>
                    <el-form-item label="快递单号:" prop="number" style="margin-bottom:58px;">
                        <el-input v-model="formLabelAlign.number" :disabled="isused"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="info" size="small" :class="{hide: hassaved}"
                                   @click="saveSubmit('formLabelAlign')" :disabled="caniuse">
                            {{opera}}
                        </el-button>
                        <el-button type="success" size="small" @click="accept" :class="{hide: iaccept}">已签收</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="Article-steps">
                <el-steps :space="100" direction="vertical" :active="1">
                    <el-step v-for="item in exp_records" :title="item.time" :description="item.context"></el-step>
                </el-steps>
            </div>
        </div>
    </div>
</template>
<script>
    import {certifyUpdate, certifyExpresslist} from '../../../api/operation';
    import {formatDate} from '../../../assets/public';
    import {mapActions, mapGetters} from 'vuex';

    export default {
        created() {
            this.getSomeMessage();
            this.getMessage();
        },
        data() {
            return {
                isused: false, // 右边的信息是否可编辑
                labelPosition: 'left',
                opera: '编辑', // 控制是编辑还是保存操作
                caniuse: false, // 是否可以编辑快递信息
                iaccept: true, // 是否显示签收按钮
                hassaved: false, // 是否显示保存按钮
                exp_records: '',
                formLabelAlign: {
                    time: '',
                    company: '',
                    number: '',
                    options: []
//                isdisabled: true
                },
                rules: {
                    time: [
                        {required: true, type: 'date', message: '请选择投递时间', trigger: 'change'}
                    ],
                    company: [
                        {required: true, type: 'number', message: '请选择快递公司', trigger: 'change'}
                    ],
                    number: [
                        {required: true, message: '请输入快递单号', trigger: 'blur'}
                    ]
                }
            };
        },
        computed: {
            ...mapGetters([
                'statu',
                'details'
            ])
        },
        methods: {
            getStatus() {
                this.isused = false;
                if (this.statu === 2) {
                    this.caniuse = true; // 是否隐藏预览证书按钮
                } else if (this.statu === 3) {
                    this.caniuse = true;
                } else if (this.statu === 4) {
                    this.caniuse = false;
                } else if (this.statu === 5) {
                    this.iaccept = false;
                    this.hassaved = true;
                } else if (this.statu === 6) {
                    this.iaccept = true;
                    this.hassaved = true;
                }
                this.isused = true;
            },
            saveSubmit(formName) {
                if (this.opera === '编辑') {
                    this.opera = '保存';
                    this.isused = false;
                } else {
                    this.$refs[formName].validate((valid) => {
                        if (valid) {
                            this.formLabelAlign.number = parseInt(this.formLabelAlign.number);
                            this.formLabelAlign.company = parseInt(this.formLabelAlign.company);
                            this.formLabelAlign.time = formatDate(this.formLabelAlign.time.toString());
                            certifyUpdate(this.$route.params.detailId, 3, undefined, undefined, this.formLabelAlign.time, this.formLabelAlign.company, undefined, this.formLabelAlign.number).then(res => {
                                if (res.data.error === 0) {
                                    this.$message({
                                        message: '保存成功',
                                        type: 'success',
                                        showClose: true
                                    });
                                    this.getSomeMessage();
                                    this.hassaved = true;
                                } else {
                                    this.$message({
                                        message: res.data.data,
                                        type: 'error',
                                        showClose: true
                                    });
                                }
                                this.getSomeMessage();
                            });
                        } else {
                            console.log('error submit!!');
                            return false;
                        }
                    });
                }
            },

            // 获取快递公司信息
            getMessage() {
                certifyExpresslist().then(res => {
                    if (res.data.error === 0) {
                        for (let item of res.data.data) {
                            this.formLabelAlign.options.push({'value': item.code_id, 'label': item.name});
                        }
                    }
                });
            },
            getSomeMessage() {
                this.$store.dispatch('getDetail', {detailId: this.$route.params.detailId}).then(res => {
                    if (res.data.error === 0) {
                        this.rules = {};
                        this.exp_records = this.details.exp_records;
                        this.formLabelAlign.time = this.details.exp_time;
                        this.formLabelAlign.company = this.details.exp_company_name;
                        this.formLabelAlign.number = this.details.exp_order_no;
                        this.getStatus();
                    }
                });
            },
            // 已签收
            accept() {
                certifyUpdate(this.$route.params.detailId, 4).then(res => {
                    if (res.data.error === 0) {
                        this.$message({
                            message: '签收成功',
                            type: 'success',
                            showClose: true
                        });
                        this.getSomeMessage();
                        this.waitToDo();
                    } else {
                        this.$message({
                            message: res.data.data,
                            type: 'error',
                            showClose: true
                        });
                    }
                });
            },
            ...mapActions([
                'waitToDo'
            ])
        },
        watch: {
            statu() {
                this.getSomeMessage();
            }
        }
    };
</script>
<style lang="scss">
    #logisticInfo {
        float: right;
        padding: 20px;
        box-sizing: border-box;
        display: inline-block;
        margin-left: 15px;
        width: 49%;
        background: #fff;

    .hide {
        display: none;
    }

    .logisticInfo {
        padding-bottom: 15px;
        border-bottom: 1px solid #eee;
    }

    .logisticInfoForm {
        min-height: calc(100vh - 450px);
    }

    .el-form {
        margin: 40px auto;
    }

    .el-date-editor.el-input {
        width: 170px;
    }

    .datos {
        display: inline-block;
        width: 260px;
        border-right: 1px solid #eee;
        padding: 0 20px 0 0;
    }

    .Article-steps {
        display: inline-block;
        width: 200px;

    .el-step__description {
        margin-left: 10px;
    }

    .el-step__title {
        margin-left: 10px;
    }

    }
    }
</style>
