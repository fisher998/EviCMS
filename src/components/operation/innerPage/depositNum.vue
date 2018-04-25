<template>
    <div id="depositNum">
        <div class="depositeTop">
            <strong>存证编号：</strong>
            <small>{{details.cert_no}}</small>
            <strong style="float:right">
                出证次数：{{details.cert_num}}次
            </strong>
        </div>
        <div class="depositForm">
            <div>
                <el-form :label-position="labelPosition" label-width="100px" :model="formLabelAlign"
                         ref="formLabelAlign">
                    <el-form-item label="姓名：">
                        <el-input v-model="formLabelAlign.name"
                                  prop="name"
                                  placeholder="张三"
                                  :disabled="isused"
                                  auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="收件人手机：">
                        <el-input v-model="formLabelAlign.phone"
                                  prop="phone"
                                  :disabled="isused"
                                  :maxlength="11"
                                  auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="收件地址：" style="margin-bottom:0;">
                        <el-input v-model="formLabelAlign.address"
                                  prop="address"
                                  :disabled="isused"
                                  auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item style="text-align: right;">
                        <el-button type="text" :disabled="saveButton" @click="certupdateSubmit('formLabelAlign')">
                            {{updatemessage}}
                        </el-button>
                        <el-button type="text" @click="cancel('formLabelAlign')">取消</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button size="small" style="margin-left:-100px;" type="danger" @click="preview"
                                   :class="{hide: ishidePreview}">预览证书
                        </el-button>
                        <el-button size="small" type="warning" @click="print" :class="{hide: isHidePrint}">打印证书
                        </el-button>
                        <el-button size="small" type="success" :disabled="isHideStamp" @click="stamp" :class="{hide:isHideStamp}">已盖章
                        </el-button>
                        <!--<el-button size="small" type="info" :class="{hide:isTrail}" @click="printed">已打印</el-button>-->
                    </el-form-item>
                </el-form>
            </div>
            <div>
            </div>
        </div>
    </div>
</template>
<script>
    import {certifyUpdate} from '../../../api/operation';
    import {mapActions, mapGetters} from 'vuex';

    export default {
        created() {
            this.getMessage();
        },
        data() {
            return {
                isused: true,
                ishidePreview: false, // 是否显示预览证书按钮
                isHidePrint: false, // 是否显示打印证书按钮
                isHideStamp: false, // 是否显示已盖章按钮
                isTrail: false, // 是否显示已出证按钮
                saveButton: false, // 是否可用保存按钮
                labelPosition: 'left',
                updatemessage: '信息更改',
                pdf_url: '', // 预览证书链接
                pdf_raw_url: '', // 打印证书链接
                formLabelAlign: {
                    name: '',
                    phone: '',
                    address: ''
                }
            };
        },
        computed: {
            ...mapGetters([
                'details',
                'statu'
            ])
        },
        methods: {
            initMessage() {
                this.pdf_url = this.details.pdf_url; // 预览证书链接
                this.pdf_raw_url = this.details.pdf_raw_url; // 打印证书链接
                this.formLabelAlign.name = this.details.user_name;
                this.formLabelAlign.phone = this.details.phone;
                this.formLabelAlign.address = this.details.rec_addr;
            },
            // 判断状态
            getStatus() {
                if (this.statu === 2) {
                    this.ishidePreview = false; // 是否隐藏预览证书按钮
                    this.isHidePrint = false; // 是否隐藏打印证书按钮
                    this.isHideStamp = false; // 是否隐藏已盖章按钮
                    this.isTrail = true; // 是否隐藏已出证按钮
                } else if (this.statu === 3) {
                    this.ishidePreview = false; // 是否隐藏预览证书按钮
                    this.isHidePrint = false; // 是否隐藏打印证书按钮
                    this.isHideStamp = true; // 是否隐藏已盖章按钮
                    this.isTrail = false; // 是否隐藏已出证按钮
                } else if (this.statu === 4) {
                    this.isHidePrint = false; // 是否隐藏打印证书按钮
                    this.isTrail = true;
                    this.isHideStamp = true; // 是否隐藏已盖章按钮
                    this.saveButton = true;
                } else if (this.statu === 5) {
                    this.isHideStamp = true; // 是否隐藏已盖章按钮
                    this.isTrail = true; // 是否隐藏已出证按钮
                    this.saveButton = true;
                } else if (this.statu === 6) {
                    this.ishidePreview = false; // 是否隐藏预览证书按钮
                    this.isHidePrint = false; // 是否隐藏打印证书按钮
                    this.isHideStamp = true; // 是否隐藏已盖章按钮
                    this.isTrail = true; // 是否隐藏已出证按钮
                    this.saveButton = true;
                }
                this.isused = true;
            },
            // 预览证书
            preview() {
                window.open(this.pdf_url);
                return false;
            },
            // 打印证书
            print() {
                window.open(this.pdf_raw_url);
                return false;
            },
            // 盖章
            stamp() {
                this.toDo(1);
                this.getMessage();
            },
            certupdateSubmit(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (this.updatemessage === '信息更改') {
                            this.updatemessage = '保存';
                            this.isused = false;
                        } else {
                            this.toDo(5);
                        }
                    } else {
                        alert('error submit');
                        return false;
                    }
                });
            },
            // 操作
            toDo(num) {
                certifyUpdate(this.$route.params.detailId, num, this.formLabelAlign.phone, this.formLabelAlign.address, this.formLabelAlign.name).then(res => {
                    if (res.data.error === 0) {
                        this.$message({
                            message: '保存成功',
                            showClose: true,
                            type: 'success'
                        });
                        this.$emit('update');
                        this.cancel();
                        this.waitToDo();
                    } else {
                        this.$message({
                            message: res.data.data,
                            showClose: true,
                            type: 'success'
                        });
                    }
                    this.getMessage();
                });
            },
            getMessage() {
                this.$store.dispatch('getDetail', {detailId: this.$route.params.detailId}).then(res => {
                    if (res.data.error === 0) {
                        this.initMessage();
                        this.getStatus();
                    }
                });
            },
            cancel() {
                this.isused = true;
                this.updatemessage = '信息更改';
            },
            // 点击已打印按钮
            printed() {
                certifyUpdate(this.$route.params.detailId, 2).then(res => {
                    if (res.data.error === 0) {
                        this.$message({
                            message: '保存成功',
                            showClose: true,
                            type: 'success'
                        });
                        this.cancel();
                    } else {
                        this.$message({
                            message: res.data.data,
                            showClose: true,
                            type: 'success'
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
                this.getMessage();
            }
        }
    };
</script>
<style lang="scss">
    #depositNum {
        box-sizing: border-box;
        display: inline-block;
        padding: 20px;
        background: #fff;
        width: 49%;

    .hide {
        display: none;
    }

    .depositeTop {
        padding-bottom: 15px;
        border-bottom: 1px solid #eee;
    }

    .depositForm {
        min-height: calc(100vh - 430px);
    }

    .el-form {
        margin: 40px auto;
        width: 300px;
    }

    }
</style>
