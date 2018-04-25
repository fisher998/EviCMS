<template>
    <div id="topbar">
        <div class="leftMessage">
            <div>待处理：</div>
            <div>
                <!-- <span>投诉建议({{taskSum.report}})</span> -->
                <router-link to="/compManage">投诉建议({{task.report}})</router-link>
                <span class="line">|</span>
                <!-- <span>退款({{taskSum.refund}})</span> -->
                <router-link to="/refund">退款({{task.refund}})</router-link>
                <span class="line">|</span>
                <!-- <span>出证({{taskSum.cert}})</span> -->
                <router-link to="/HisManage">出证({{task.cert}})</router-link>
                <span class="line">|</span>
                <!-- <span>出庭({{taskSum.court}})</span> -->
                <router-link to="/TrialManage">出庭({{task.court}})</router-link>
                <span class="line">|</span>
                <!-- <span>出庭({{taskSum.court}})</span> -->
                <router-link to="/virtualMachinesManage">虚拟主机</router-link>
                
            </div>
        </div>
        <div class="rightMessage">
            <span style="margin-right:15px; cursor:pointer;" @click="logout">退出登录</span>
            <span class="line">|</span>
            <span>管理员：{{name}}</span>
        </div>
    </div>
</template>
<script>
    //    import {task} from '../../api/taskSum';
    import {mapGetters, mapActions} from 'vuex';

    export default {
        created() {
            this.getName();
            this.waitToDo();
        },
        data() {
            return {
                name: '',
                taskSum: {
                    report: '',
                    refund: '',
                    cert: '',
                    court: ''
                }
            };
        },
        computed: {
            ...mapGetters([
                'task'
            ])
        },
        methods: {
            getName() {
                this.name = window.localStorage.getItem('name');
            },
            logout() {
//                console.log('d');
                this.$store.dispatch('adminLogout')
                    .then((res) => {
                        if (res.data.error === 0) {
                            // 退出登录
                            location.reload();
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
        }
    };
</script>
<style lang="scss">
    #topbar {
        position: fixed;
        top: 0;
        z-index: 100;
        padding-left: 20px;
        height: 35px;
        background: #fff;
        line-height: 35px;
        width: calc(100vw - 240px);
    span {
        display: inline-block;
        color: #333;
        height: 35px;
        line-height: 35px;
        text-align: center;
    }

    .rightMessage {
        position: absolute;
        right: 0;

    span {
        float: right;
    }

    }

    .leftMessage div {
        display: inline-block;
        float: left;
    }

    a {
        display: inline-block;
        color: #333;
        width: inherit;
        vertical-align: middle;
        text-align: center;
    }

    .line {
        height: 10px;
        width: 50px;
    }

    }
</style>

