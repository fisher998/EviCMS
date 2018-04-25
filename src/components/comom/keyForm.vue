<template>
    <div class="from-wrapper">
        <el-form :label-position="labelPosition" label-width="100px" :model="formLabelAlign">
            <el-form-item label="APP Key:">
                <el-input v-model="formLabelAlign.name"></el-input>
            </el-form-item>
            <el-form-item label="APP Secret:">
                <el-input v-model="formLabelAlign.region"></el-input>
                {{type}}
            </el-form-item>
            <el-form-item>
                <el-button type="info">修改</el-button>
                <el-button type="warning">提交</el-button>
                <el-button>取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
    import {getsecretDetail} from '../../api/secretManagement.js';
    export default {
        created() {
            this._secretDetail(this.type);
        },
        data () {
            return {
                labelPosition: 'left',
                formLabelAlign: {
                    name: '',
                    region: '',
                    type: ''
                }
                // secretDetail: {}
            };
        },
        props: ['type'],
        mounted() {
            this.formLabelAlign.type = this.type;
            this.secretModify();
        },
        methods: {
            _secretDetail(type) {
                getsecretDetail(type).then(res => {
                   if (res.data.error === 0) {
                      let secretDetail = res.data.data;
                     console.log(secretDetail, '秘钥管理');
                   }
                });
            },
            messageSecret() {
                console.log('messageSecret1');
            },
            wechatSecret() {
                console.log('wechatSecret2');
            },
            alipaySecret() {
                console.log('alipaySecret3');
            },
            secretModify() {
                console.log(this.type);
                if (this.type === 1) {
                    this.messageSecret();
                };
                if (this.type === 2) {
                    this.wechatSecret();
                };
                if (this.type === 3) {
                    this.alipaySecret();
                };
            }
        }

    };
</script>
<style>

</style>
