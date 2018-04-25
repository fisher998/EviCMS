<template>
    <div id="paperDetail">
        <div class="paperDetail">
            <span>出证管理 -- 纸质出证详情</span>
            <el-button size="small" type="info" @click="returnBack" style="float:right">返回</el-button>
        </div>
        <div class="userMessage">
            <div class="userNum">
                <strong>用户:
                    <small>(+86){{details.phone}}</small>
                </strong>
            </div>
            <div style="text-align: center">
                <el-steps :space="200" :active="status" align-center>
                    <el-step title="用户申请" :description="details.req_time"></el-step>
                    <el-step title="出证盖章" :description="details.confirm_time"></el-step>
                    <el-step title="快递发出" :description="details.exp_time"></el-step>
                    <el-step title="客户签收" :description="details.finish_time"></el-step>
                </el-steps>
            </div>
        </div>
        <div class="detailContent">
            <depositNum></depositNum>
            <logisticsInfo></logisticsInfo>
        </div>
    </div>
</template>
<script>
    import depositNum from './depositNum.vue';
    import logisticsInfo from './logisticsInfo.vue';
    //    import {getCertifyDetail} from '../../../api/operation';
    import {mapActions, mapGetters} from 'vuex';

    export default {
        created() {
            this.getMessage();
            this.getStatus();
        },
        data() {
            return {
                status: 1,
                req_time: '', // 用户申请时间
                exp_records: '', // 快递时间和地址
                confirm_time: '', // 出证盖章时间
                exp_time: '', // 快递发出时间
                finish_time: '', // 客户签收时间
                cert_num: '',
                phone: ''
            };
        },
        watch: {
            statu() {
               this.getMessage();
            }
        },
        computed: {
            ...mapGetters([
                'statu',
                'details'
            ])
        },
        methods: {
            getMessage() {
                this.$store.dispatch('getDetail', {detailId: this.$route.params.detailId}).then(res => {
                    this.getStatus();
                });
            },
            getStatus() {
                if (this.statu === 2) {
                    this.status = 1;
                } else if (this.statu === 3 || this.statu === 4) {
                    this.status = 2;
                } else if (this.statu === 5) {
                    this.status = 3;
                } else if (this.statu === 6) {
                    this.status = 4;
                }
            },
            returnBack() {
                this.$router.go(-1);
            },
            ...mapActions([
                'getDetail'
            ])
        },
        components: {
            depositNum,
            logisticsInfo
        }
    };
</script>
<style lang="scss" type="text/scss">
    @import '../../../scss/mixin';

    #paperDetail {
        padding: 0 15px;
        .paperDetail {
            padding: 15px 0;
            & > span {
                border-left: 2px solid #324157;
                padding-left: 5px;
            }
        }
        .userMessage {
            background: #fff;
            padding: 15px 25px;
            .userNum {
                margin-bottom: 10px;

            }
        }
        .detailContent {
            margin-top: 15px;
        }
    }
</style>
