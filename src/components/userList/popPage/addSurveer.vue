<!--添加公测员-->
<template>
    <div id="addServeer">
       <el-dialog title="添加公测员" :visible.sync = 'isVisible'>
        <el-form :label-position="labelPosition" label-width="100px" :model="form">
            <el-form-item label="公测员名称：">
                <el-input v-model="form.surveerName"></el-input>
            </el-form-item>
            <el-form-item label="推荐人名称：">
                <el-input v-model="form.surveerReferral"></el-input>
            </el-form-item>
            <el-form-item label="手机号：">
                <el-input v-model="form.phoneNum"></el-input>
            </el-form-item>
            <el-form-item label="赠送余额：">
                <el-input v-model="form.vacancies"></el-input>
            </el-form-item>
            <el-form-item label="到期时间：">
                <el-input v-model="form.dueTime"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary">提交</el-button>
                <el-button @click="close">取消</el-button>
            </el-form-item>
        </el-form>
       </el-dialog>
    </div>
</template>
<script>
    export default{
       props: {
           isVisible: {
               type: Boolean,
               default: false
           }
       },
    data() {
           return {
               labelPosition: 'left',
             form: {
                 surveerName: '',
                 surveerReferral: '',
                 phoneNum: '',
                 vacancies: '',
                 dueTime: ''
             }
           };
        },
        methods: {
           close() {
               this.$emit('update:isVisible', false);
           }
        }
    };
</script>
