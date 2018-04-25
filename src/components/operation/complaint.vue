<template>
    <div id="complaint">
        <div class="top">
            <span style="border-left:2px solid #324157;padding-left:10px;">投诉建议管理 —— 投诉详情</span>
        </div>
        <div class="suggestion">
            <div class="complaintTop">
                <span><strong>用户</strong>：<small v-if="user.user">{{user.user.cell_phone}}</small></span>
                <span style="margin:0 20px;color:#eee">|</span>
                <span><strong>时间：</strong>&nbsp;<small>{{user.request_time}}</small></span>
                <el-button @click="login_web">进入用户界面</el-button>
            </div>
            <div>
                <el-form>
                    <el-form-item>
                        <b>内容:</b>
                    </el-form-item>
                    <el-form-item>
                        <el-row>
                            <el-col :span="12">
                                <el-input type="textarea" size="medium" autosize :readonly="isread"
                                          :value="content">
                                </el-input>
                            </el-col>
                            <!--<img src=""http://user-imgs.oss-cn-beijing.aliyuncs.com/1506758070722.png" alt="">-->
                            <el-col :span="12">
                                <el-row>
                                    <el-col :span="6" v-for="(item,index) in imgs" :key="item.key">
                                        <img :src="item" alt=""
                                             @click="showpicture(index)">
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item>
                        <b>回复:</b>
                    </el-form-item>
                    <el-form-item>
                        <el-input v-if="status===2" type="textarea" size="small" v-model="reply_content">
                        </el-input>
                        <el-input v-else type="textarea" size="small" v-model="replay">
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" :disabled="status===2" @click="replaySubmit()" style="margin-right:80px;">提交回复</el-button>
                        <el-button @click="back">返回</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <!--显示大图弹窗-->
        <el-dialog
            :visible.sync="picVisible"
            width="100%">
            <div>
                <img :src="imgs[poc]" alt="">
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import {feedbackdetail, feedbackreplay} from '../../api/operation';
    import {contains} from '../../assets/public';
    import {admin_web} from '../../api/user';
    import {mapActions} from 'vuex';
    export default {
        created() {
            this.feedbackDetail();
        },
        data() {
            return {
                rep: false,
                isread: true,
                detail: [],
                content: '',
                replay: '',
                user: '', // 用户信息
                imgs: [],
                poc: 0,
                picVisible: false,
                user_id: 0,
                status: this.$route.params.status,
                reply_content: this.$route.params.reply_content
            };
        },
        methods: {
//            投诉详情内容
            feedbackDetail() {
                feedbackdetail(this.$route.params.report_id).then(res => {
                    if (res.data.error === 0) {
                        this.user_id = res.data.data.user_id;
                        this.user = res.data.data;
                        let imgs = res.data.data.imgs === '' ? [] : JSON.parse(res.data.data.imgs);
                        this.imgs = imgs;
                        this.detail = res.data.data || [];
                        this.content = res.data.data.content;
                    } else {
                        this.$message({
                            message: res.data.data,
                            type: 'error',
                            showClose: true
                        });
                    }
                });
            },
            replaySubmit() {
                if (this.replay) {
                    this.rep = false;
                    feedbackreplay(this.$route.params.report_id, this.replay).then(res => {
                       if (res.data.error === 0) {
                           this.$message({
                               message: '操作成功',
                               type: 'success',
                               showClose: true
                           });
                           this.$router.go(-1);
                           this.waitToDo();
                       } else {
                           this.$message({
                               message: res.data.data,
                               type: 'error',
                               showClose: true
                           });
                       }
                    });
                } else {
                    this.rep = false;
                    this.$message({
                        message: '回复内容不能为空',
                        type: 'warning',
                        showClose: true
                    });
                }
            },
            showpicture(index) {
                this.picVisible = true;
                this.poc = index;
            },
            // 返回
            back() {
                this.$router.go(-1);
            },
            // 进入管理员模式该用户的用户界面
            login_web() {
                let w = window.open();
                admin_web(this.user_id).then(res => {
                    if (res.data.error === 0) {
                        setTimeout(function() {
                            w.location = 'http://zbb.fa123.com/#/login/admin/' + res.data.data;
                        }, 1000);
                    } else {
                        this.$message({
                        message: res.data.data,
                            type: 'error'
                        });
                    }
                });
                return false;
            },
         //  权限控制函数
            permissionControl() {
                this.detail = !contains('operation_feedback_detail') ? this.details : {}; // 是否有显示投诉建议详情的权限
            },
            ...mapActions([
                'waitToDo'
            ])
        }
    };
</script>
<style lang="scss" type="text/scss">
    #complaint {
        padding: 15px 20px;
        position: relative;
        .top {
            padding-bottom: 15px;
        }
        .suggestion {
            min-height: calc(100vh - 120px);
            background: #fff;
            padding: 0px 30px;
            .complaintTop {
                padding: 15px 0;
                font-size: 16px;
                border-bottom: 1px solid #eee;
            }
            .complaintTop {
                .el-button {
                    position: absolute;
                    right: 50px;
                    top: 58px;
                    font-size: 12px;

                }
            }

            .el-form-item {
                /*margin-bottom:0;*/
                .el-button {
                    text-align: center;
                    width: 100px;
                    padding: 10px 0;
                }
            }

            textarea {
                outline: none;
                border: 1px solid #bbb;
            }
            .el-form {
                padding-bottom: 50px;
                .el-row {
                    margin-left: 10px;
                    .el-col-6 {
                        margin: 0 10px;
                        max-height: 90px;
                        overflow: hidden;
                        img {
                            display: inline-block;
                            width: 100%;
                        }
                    }
                }
            }
        }
        .el-dialog__wrapper {
            .el-dialog--small {
                width: 100%;
                img {
                    display: inline-block;
                    width: 100%;
                }
            }
        }
    }
</style>
