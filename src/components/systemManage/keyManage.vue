<template>
<div id="keyManage">
    <div class="keyManageTop"><span> 密钥管理</span></div>
   <div class="tabselect">
       <el-tabs v-model="activeName" @tab-click="handleClick">
           <el-tab-pane label="短信密钥" name="first">
               <message :type="secretMana.message"></message>
           </el-tab-pane>
           <el-tab-pane  label="微信支付密钥" name="second"><wechat :type="secretMana.wechat"></wechat></el-tab-pane>
           <el-tab-pane  label="支付宝密钥" name="third"><alipay :type="secretMana.alipay"></alipay></el-tab-pane>
       </el-tabs>
   </div>
</div>
</template>
<script>
   import keyForm from '../comom/keyForm';
   import message from './innerPage/secrectMana/message.vue';
   import wechat from './innerPage/secrectMana/wechat.vue';
   import alipay from './innerPage/secrectMana/alipay.vue';
    export default{
        data() {
            return {
                activeName: 'first',
                type: 1,
                z: 3,
                secretMana: {
                    message: 1,
                    wechat: 2,
                    alipay: 3
                },
                show: {
                    message: true,
                    wechat: false,
                    alipay: false
                }
            };
        },
        methods: {
            handleClick(tab, event) {
                 console.log(tab, event);
            }
        },
        components: {
            keyForm,
            message,
            wechat,
            alipay
        }
    };
</script>
<style lang="scss" type="text/scss">
    @import '../../scss/mixin.scss';
#keyManage{
    padding:0 20px;
    .keyManageTop{
      padding:15px 0;
        span{
           @include span;
        }
    }
.tabselect{
    background: #fff;
    padding-left: 10px;
}
.from-wrapper{
    min-height: calc( 100vh - 200px );
position:relative;
    .el-form{
        width:400px;
        position:absolute;
        top:100px;
        bottom:0;
        left:0;
        right:0;
        margin:auto;
    }
}
}
</style>
