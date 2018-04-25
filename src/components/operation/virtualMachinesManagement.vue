<template>
    <div id="virtualMana">
        <div class="virtualTitle">
            <div class="left">
                <span>机器人虚拟主机管理</span>
            </div>
            <div class="right">
                <el-form :inline="true" :model="formIn">
                    <el-form-item label="虚拟主机IP:">
                        <el-input v-model="vncIp"  @keyup.enter.native="searchVnc" size="small"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button size="small" type="primary"  @click="searchVnc">搜索</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button size="small" type="primary" plain @click="addMachine=true">添加主机</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <div>
            <table cellpadding="0" cellspacing="0" border="0" fit='true' empty-text>
                <thead>
                    <tr>
                        <th>主机编号</th>
                        <th>IP</th>
                        <th>端口</th>
                        <th>参与分配</th>
                        <th>当前状态</th>
                        <th>连接用户</th>
                        <th>连接开始时间</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody v-bind:class="{hide: vncLists.length === 0}">
                <tr v-for="(item) in vncLists">
                    <td>{{item.id}}</td>
                    <td>{{item.ip}}</td>
                    <td>{{item.user_port}}</td>
                    <td>{{item.is_allocation}}</td>
                    <td v-bind:class="{warning: item.status === '使用中'}" v-if="item.status === '使用中'">{{item.status}}</td>
                    <td v-bind:class="{success: item.status === '空闲'}" v-if="item.status === '空闲'">{{item.status}}</td>
                    <td v-bind:class="{danger: item.status === '关机'}" v-if="item.status === '关机'">{{item.status}}</td>
                    <td v-bind:class="{danger: item.status === '故障中'}" v-if="item.status === '故障中'">{{item.status}}</td>
                    <td v-if="item.user">(+{{item.user.area_code}}) {{item.user.cell_phone}}</td>
                    <td v-else>-</td>
                    <td v-if="item.user">{{item.last_start_time}}</td>
                    <td v-else>*</td>
                    <td>
                        <template>
                            <el-button v-if="item.status === '关机'" size="mini"  type="primary" plain disabled="">重启</el-button>
                            <el-button v-else size="mini"  type="primary" plain @click="restartVnc(item.id)">重启</el-button>
                            <el-button v-if="item.user"  size="mini"  type="danger" plain @click="cancelVnc(item.id)">取消录制</el-button>
                            <el-button v-else size="mini"  type="danger" plain disabled>取消录制</el-button>
                            <el-button v-if="item.status === '故障中'" size="mini"  type="danger" plain @click="resetVnc(item.id)">重置录制</el-button>
                            <el-button v-else size="mini"  type="danger" plain disabled="">重置录制</el-button>
                            <el-button size="mini"  type="success" plain @click="tovncDetail(item.id)">详情</el-button>
                        </template>
                        <!-- <template>
                            <el-button size="mini"  type="text" plain @click="restartVnc(item.id)">重启</el-button>
                            <el-button size="mini"  type="text" plain @click="cancelVnc(item.id)">取消录制</el-button>
                            <el-button size="mini"  type="text" plain @click="tovncDetail(item.id)">详情</el-button>
                        </template> -->
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
        <div class="pagination" v-if="total>15" >
            <el-pagination
                layout="prev, pager, next,total"
                :total="total"
                :page-size="perPage"
                :current-page.sync="currentPage"
                @current-change="handleCurrentChange()"
            ></el-pagination>
        </div>
        <!-- 添加主机弹出框 -->
        <div>
            <el-dialog :visible.sync="addMachine" title="添加新主机" width="500px" class="tc" size="tiny" :show-close="true">
                <div class="df ac tl">
                    <div class="flex_item1 f14"> <span class="">输入IP：</span></div>
                    <el-input class="flex_item2" v-model="addVncParam.ip"></el-input>
                </div>
                <div class="df ac mt tl">
                    <div class="flex_item1 f14"> <span class="ac">端口号：</span></div>
                    <el-input class="flex_item2" v-model="addVncParam.port"></el-input>
                </div>
                <div class="df ac mt tl">
                    <div class="flex_item1 f14"> <span class="ac">参与分配：</span></div>
                    <template class="flex_item2 el-select">
                        <el-select v-model="addVncParam.is_allocation" clearable placeholder="请选择">
                            <el-option
                            v-for="item in allocation"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </template>
                </div>
                <div class="df mt">
                    <div class="flex_item1 tr">
                        <el-button class="f16 btn" @click="addMachine=false">取消</el-button>
                    </div>
                    <div class="flex_item1 tl">
                        <el-button class="f16 btn" type="primary" @click="addVnc">确认</el-button>
                    </div>
                </div>
            </el-dialog>
        </div>
    </div>
</template>
<script>
    import {certifyList} from '../../api/operation';
    import {vncList, addVnc, searchvncList, restartVnc, cancelVnc, resetVnc} from '../../api/robot';
    import {contains, translateTime} from '../../assets/public';
    export default {
        created() {
            this.certList();
            this.controlPermission();
            this.getvncList();
            this.recircle();
        },
        data() {
            return {
                currentTabIndex: 0,
                activeName: '0',
                currentPage: 1,
                total: 0,
                perPage: 15, // 每页显示多少条
                hisList: true, // 出证列表是否显示
                hisDetail: true, // 出证详情按钮是否显示
                formIn: {
                    username: '',
                    cert_num: '',
                    time_begin: '',
                    time_end: '',
                    time: ['', '']
                },
                hisData: [],
                addMachine: false, // 添加主机弹出框
                allocation: [{
                    value: '1',
                    label: '是'
                },
                {
                    value: '2',
                    label: '否'
                }],
                vncLists: [],
                addVncParam: {
                    ip: '',
                    port: '',
                    is_allocation: ''
                },
                vncIp: ''
            };
        },
        methods: {
            handleClick: function () {
                this.certList();
            },
            // 获取列表
            certList() {
                let status = this.activeName === '0' ? undefined : parseInt(this.activeName);
                certifyList(this.formIn.username, this.formIn.cert_num, translateTime(this.formIn.time[0]), translateTime(this.formIn.time[1]), status, this.perPage, this.currentPage).then(res => {
                    this.hisData = res.data.data.data;
                    // this.total = res.data.data.total;
                    // console.log(this.hisData);
                });
            },
            recircle() {
                let _this = this;
                setInterval(() => {
                    _this.getvncList();
                    // console.log('circle');
                }, 2000);
            },
            getvncList() {
                let status = this.activeName === '0' ? undefined : parseInt(this.activeName);
                vncList(status, this.perPage, this.currentPage).then(res => {
                    // console.log('vnclist', res.data.data);
                    this.vncLists = res.data.data.data;
                    this.total = res.data.data.total;
                });
            },
            searchVnc() {
                searchvncList(this.vncIp).then(res => {
                    // console.log('vnclist', res.data.data.data);
                    this.vncLists = res.data.data.data;
                    // this.total = res.data.data.total;
                });
            },
            handleCurrentChange() {
                this.getvncList();
            },
            // 权限控制
            controlPermission() {
                this.hisList = !contains('operation_certify_list'); // 是否有显示出证列表权限
                this.hisDetail = !contains('operation_certify_detail'); // 是否有出证详情权限
            },
            tovncDetail(id) {
                console.log(id);
                this.$router.push({
                    path: `/vncDetail/${id}`
                });
            },
            addVnc() {
                // console.log(this.addVncParam);
                let _this = this;
                addVnc(this.addVncParam).then(res => {
                    if (res.data.error === 0) {
                        console.log(res);
                        this.addMachine = false;
                        _this.getvncList();
                        this.$message({
                            type: 'success',
                            message: '添加虚拟机成功'
                        });
                    } else {
                        _this.$message({
                            type: 'error',
                            message: res.data.data
                        });
                    }
                });
            },
            restartVnc(id) {
                restartVnc(id).then(res => {
                    if (res.data.error === 0) {
                        this.$message({
                            type: 'success',
                            message: '重启成功'
                        });
                        console.log('重启', res.data);
                    } else {
                        this.$message({
                            type: 'error',
                            message: res.data.data
                        });
                    }
                });
            },
            resetVnc(id) {
                resetVnc(id).then(res => {
                    if (res.data.error === 0) {
                        this.$message({
                            type: 'success',
                            message: '重置录制成功'
                        });
                        console.log('重置录制成功', res.data);
                    } else {
                        this.$message({
                            type: 'error',
                            message: res.data.data
                        });
                        console.log('重置录制失败', res.data);
                    }
                });
            },
            cancelVnc(id) {
                cancelVnc(id).then(res => {
                    if (res.data.error === 0) {
                        console.log('取消录制', res.data);
                        this.$message({
                            type: 'success',
                            message: '取消录制成功'
                        });
                    } else {
                        this.$message({
                            type: 'error',
                            message: res.data.data
                        });
                    }
                });
            }
        }
    };
</script>
<style lang="scss" type="text/scss">
    @import '../../style/common.scss';
    @import '../../scss/mixin.scss';
    #virtualMana {
        padding: 0 15px;
        th, td {
            // width: 2%;
        }
        .virtualTitle {
            display: flex;
            &:before{
                content:'';
                display:block;
                clear:both;
            }
            
            .left{
                flex: 1;
                margin-top: 10px;
                span{
                    @include span;
                }
            }
            .right{
                flex: 1;
                text-align: right;
            }
        }
        .el-date-editor.el-input{width:inherit}
        .el-tabs__header {
            border-bottom: 0;
        }

       .el-form {
            display: inline-block;
           margin-bottom:10px;
           .el-input__inner{
               width:250px;
           }
           .el-date-editor--datetime{
               width:120px;
           }
           .el-form-item__label{
               padding-right:5px;
               font-size:13px;
           }
            .el-col-3{
                text-align:right;
                padding-right:3px;
            }
           .el-form-item{
               margin:0;
           }
        }
        .pagination {
            margin: 15px 0;
            text-align: center;
            .el-pagination {
                display: inline-block;
            }
        }
        .flex_item1 {
            flex: 1;
        }
        .flex_item2 {
            flex: 3;
        }
        .el-select{
            width: 345px;
        }
        .btn {
            width: 100px;
            margin: 0 20px;
        }
        table{
            table-layout: auto;
        }
        .width{
            width: 900px;
        }
    }
</style>
