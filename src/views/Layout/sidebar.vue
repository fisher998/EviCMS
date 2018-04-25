<template>
    <div class="sidebar-container">
        <h3>证宝宝管理系统</h3>
        <el-menu default-active="2"
                 class="el-menu-vertical-demo"
                 active-text-color="#ffd04b"
                 background-color="#324157"
                 :unique-opened = 'open'
        >
            <el-submenu v-for="(item,key,index) in this.options" :key="item.id" :index="key+''">
                <template slot="title">
                    <span style="color:white">{{item.name}}</span>
                </template>
                <el-menu-item-group>
                    <el-menu-item index="index" v-for="(list,index) in item.children" :key="list.id" >
                        <router-link :to='list.link'>{{list.name}}</router-link>
                    </el-menu-item>
                    <!-- <el-menu-item>
                    <router-link to="/virtualMachinesManage">虚拟主机管理</router-link>
                    </el-menu-item> -->
                </el-menu-item-group>
            </el-submenu>
            <!--<el-submenu index="2">-->
            <!--<template slot="title">-->
            <!--运营管理-->
            <!--</template>-->
            <!--<el-menu-item-group>-->
            <!--<el-menu-item index="2-1">-->
            <!--<router-link to="/compManage">投诉建议管理</router-link>-->
            <!--</el-menu-item>-->
            <!--<el-menu-item index="2-2">-->
            <!--<router-link to="/refund">退款处理</router-link>-->
            <!--</el-menu-item>-->
            <!--<el-menu-item index="2-3">-->
            <!--<router-link to="/HisManage">出证管理</router-link>-->
            <!--</el-menu-item>-->
            <!--<el-menu-item index="2-4">-->
            <!--<router-link to="/TrialManage">出庭管理</router-link>-->
            <!--</el-menu-item>-->
            <!--</el-menu-item-group>-->
            <!--</el-submenu>-->
            <!--<el-submenu index="3">-->
            <!--<template slot="title">-->
            <!--数据分析-->
            <!--</template>-->
            <!--<el-menu-item-group>-->
            <!--<el-menu-item index="3-1">-->
            <!--<router-link to="/userData">用户数据</router-link>-->
            <!--</el-menu-item>-->
            <!--<el-menu-item index="3-2">-->
            <!--<router-link to="/behaviourData">行为数据</router-link>-->
            <!--</el-menu-item>-->
            <!--<el-menu-item index="3-3">-->
            <!--<router-link to="/tradeData">交易统计</router-link>-->
            <!--</el-menu-item>-->
            <!--</el-menu-item-group>-->
            <!--</el-submenu>-->
            <!--<el-submenu index="4">-->
            <!--<template slot="title">-->
            <!--系统管理-->
            <!--</template>-->
            <!--<el-menu-item-group>-->
            <!--<el-menu-item index="4-1">-->
            <!--<router-link to="/adminManage">管理员设置</router-link>-->
            <!--</el-menu-item>-->
            <!--<el-menu-item index="4-2">-->
            <!--<router-link to="/operationLog">操作日志</router-link>-->
            <!--</el-menu-item>-->
            <!--<el-menu-item index="4-3">-->
            <!--<router-link to="/keyManage">密钥管理</router-link>-->
            <!--</el-menu-item>-->
            <!--</el-menu-item-group>-->
            <!--</el-submenu>-->
            <!--<el-submenu index="5">-->
            <!--<template slot="title">-->
            <!--其他管理-->
            <!--</template>-->
            <!--<el-menu-item index="5-1">-->
            <!--<router-link to="/rightAllotment">权限分配</router-link>-->
            <!--</el-menu-item>-->
            <!--<el-menu-item index="5-2">-->
            <!--<router-link to="/menulist">菜单管理</router-link>-->
            <!--</el-menu-item>-->
            <!--</el-submenu>-->
        </el-menu>
    </div>
</template>

<script>
    export default {
        created() {
            this.open = !!this.open;
            this.getOptions();
        },
        data() {
            return {
                index: 0,
                options: [],
                open: true
            };
        },
        methods: {
            getOptions() {
                let storage = window.localStorage ? localStorage.getItem('menus') : [];
                storage = storage ? JSON.parse(storage) : [];
                this.options = storage;
            }
        }
    };
</script>

<style lang="scss">
    .sidebar-container {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        width: 200px;
        background: #324157;

    .el-submenu .el-menu-item {
        padding-right: 0;
    }

    a {
        display: block;
        text-decoration: none;
        text-align: left;
        color: #fff;
    }

    .el-menu--dark .el-menu-item, .el-menu--dark .el-submenu__title {
        color: #ffd04b;
    }

    h3 {
        color: #fff;
        text-indent: 20px;
        margin: 0;
        margin-top: 20px;
        height: 50px;
        line-height: 50px;
    }

    .el-menu-item-group__title {
        padding-top: 0;
    }

    }


</style>
