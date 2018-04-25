<template>
    <div class="from-wrapper">
        <el-form :label-position="labelPosition" label-width="100px" :model="secretDetail">
            <el-form-item label="APP Key:">
                <el-input :disabled="isUsed" v-model="secretDetail.app_key"></el-input>
            </el-form-item>
            <el-form-item label="APP Secret:">
                <el-input :disabled="isUsed" v-model="secretDetail.app_secret"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="info" @click="modify">修改</el-button>
                <el-button type="warning" :disabled="isUsed" @click="_updataSecret">提交</el-button>
                <!-- <el-button>取消</el-button> -->
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
    import {getsecretDetail, updataSecret} from '../../../../api/secretManagement.js';
    export default {
        created() {
            this._secretDetail(2);
            this.isUsed = true;
        },
        data () {
            return {
                labelPosition: 'left',
                secretDetail: {
                    app_key: '',
                    app_secret: '',
                    type: ''
                },
                isUsed: true
            };
        },
        props: ['type'],
        mounted() {
        },
        methods: {
            _secretDetail(type) {
                getsecretDetail(type).then(res => {
                   if (res.data.error === 0) {
                      let secretDetail = res.data.data;
                      this.secretDetail.type = res.data.data.type;
                      this.secretDetail.app_key = res.data.data.app_key;
                      this.secretDetail.app_secret = res.data.data.app_secret;
                     console.log(secretDetail, '秘钥管理');
                   }
                });
            },
            _updataSecret() {
                updataSecret(this.secretDetail).then(res => {
                    if (res.data.error === 0) {
                        this.isUsed = true;
                      let secretDetail = res.data.data;
                     console.log(secretDetail, '更新过的短信秘钥管理');
                      this.$message({
                        message: '修改成功',
                        type: 'success',
                        showClose: true
                    });
                   };
                });
            },
            modify() {
                if (this.isUsed) {
                    this.isUsed = false;
                } else {
                    this.isUsed = true;
                };
            }
        }

    };
</script>
<style>

</style>
