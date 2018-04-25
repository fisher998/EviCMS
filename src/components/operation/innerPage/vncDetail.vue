<template>
    <div id="virtualMana">
        <div class="virtualTitle">
            <div class="left f14">
                <span>虚拟主机详情</span>
                <strong>
                    <router-link class="color-primary ml" to="/virtualMachinesManage"> <返回</router-link>
                </strong>
            </div>

            <!-- <div class="right">
                <el-form>
                    <el-form-item label="虚拟主机IP:">
                        <el-input v-model="formIn.username"  @keyup.enter.native="certList" size="small"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <router-link to="/virtualMachinesManage">返回</router-link>
                    </el-form-item>
                    <el-form-item>
                        <el-button size="small" type="primary" plain>添加主机</el-button>
                    </el-form-item>
                </el-form>
            </div> -->
        </div>
        <div>
            <div class="vncTitle df mt">
                <div class="fl1 f14 tl pl">
                    <span>创建时间：</span><span>{{vncDetails.create_time}}</span>
                </div>
                <div class="fl1 f14 tl bl pl">
                    <span>主机IP：</span><span>{{vncDetails.ip}}</span>
                </div>
                <div class="fl1 f14 tl bl pl">
                    <span>端口：</span><span>{{vncDetails.user_port}}</span>
                </div>
                <div class="fl1 f14 tl bl pl">
                    <span>分配状态：</span><span>{{vncDetails.allocation}}</span>
                </div>
                <div class="fl1 f14 tc">
                    <span class="color-primary vncUpdate" @click="vncUpdateStatus = true">设置</span>
                </div>
            </div>
            <table cellpadding="0" cellspacing="0" border="0" fit='true' empty-text class="">
                <thead>
                    <tr>
                        <th>记录编号</th>
                        <th>用户UID</th>
                        <th>用户手机</th>
                        <th>连接开始时间</th>
                        <th>连接结束时间</th>
                        <th>最后轮询时间</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody >
                <tr v-for="(item) in allocationLists">
                    <td>{{item.id}}</td>
                    <td>{{item.user_id}}</td>
                    <td>(+{{item.user.area_code}}) {{item.user.cell_phone}}</td>
                    <td>{{item.start_time}}</td>
                    <td>{{item.end_time}}</td>
                    <td v-if="item.polling">{{item.polling.polling_time}}</td>
                    <td v-else>-</td>
                    <td>
                        <template>
                            <el-button size="small"  type="primary" plain @click="getOprecord(item.id)">操作日志</el-button>
                        </template>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
        <div class="pagination" v-if="total>15">
            <el-pagination
                layout="prev, pager, next,total"
                :total="total"
                :page-size="perPage"
                :current-page.sync="currentPage"
                @current-change="handleCurrentChange()"
            ></el-pagination>
        </div>
        <!-- 更新主机弹出框 -->
        <div>
            <el-dialog :visible.sync="vncUpdateStatus" title="主机设置" width="500px" class="tc" size="tiny" :show-close="true">
                <div class="df ac tl">
                    <div class="flex_item1 f14"> <span class="">输入IP：</span></div>
                    <el-input class="flex_item2 el-select" v-model="vncDetailsUpdate.ip"></el-input>
                </div>
                <div class="df ac mt tl">
                    <div class="flex_item1 f14"> <span class="ac">端口号：</span></div>
                    <el-input class="flex_item2 el-select" v-model="vncDetailsUpdate.user_port"></el-input>
                </div>
                <div class="df ac mt tl">
                    <div class="flex_item1 f14"> <span class="ac">参与分配：</span></div>
                    <template class="flex_item2 el-select">
                        <el-select v-model="vncDetailsUpdate.is_allocation" clearable placeholder="请选择">
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
                        <el-button class="f16 btn" @click="vncUpdateStatus = false">取消</el-button>
                    </div>
                    <div class="flex_item1 tl">
                        <el-button class="f16 btn" type="primary" @click="vncUpdate">确认</el-button>
                    </div>
                </div>
            </el-dialog>
        </div>
        <!-- 操作日志 -->
        <div>
            <el-dialog :visible.sync="oprecordStatus" class="tc" title="操作日志" width="40%">
                <div>
                    <table cellpadding="0" cellspacing="0" border="0" fit='true' empty-text>
                        <thead>
                            <!-- <tr>
                                <th>编号</th>
                                <th>时间</th>
                                <th>类型</th>
                                <th>结果</th>
                            </tr> -->
                            <tr>
                                <td>编号</td>
                                <td>时间</td>
                                <td>类型</td>
                                <td>结果</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in oprecordList">
                                <td>{{item.id}}</td>
                                <td>{{item.operation_time}}</td>
                                <td>{{item.type}}</td>
                                <td>{{item.memo}}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </el-dialog>
        </div>
    </div>
</template>
<script>
    import {vncDetail, allocationList, updateVnc, oprecordList} from '../../../api/robot';
    import {contains} from '../../../assets/public';
    export default {
        created() {
            this.getvncDetail();
            this.getallocationList();
            this.vncId = this.$route.params.id;
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
                vncUpdateStatus: false, // vnc更新弹出框
                oprecordStatus: false, // 操作日志弹出框
                formIn: {
                    username: '',
                    cert_num: '',
                    time_begin: '',
                    time_end: '',
                    time: ['', '']
                },
                hisData: [],
                addMachine: false,
                allocation: [{
                    value: '1',
                    label: '是'
                },
                {
                    value: '2',
                    label: '否'
                }],
                is_allocation: '',
                vncLists: [],
                vncDetails: '',
                vncDetailsUpdate: {
                    ip: '',
                    user_port: 86,
                    is_allocation: ''
                },
                allocationLists: [],
                vncId: '',
                oprecordList: []
            };
        },
        methods: {
            getvncDetail() {
                vncDetail(this.$route.params.id).then(res => {
                    this.vncDetails = res.data.data;
                    console.log(res.data.data);
                    this.vncDetailsUpdate.ip = res.data.data.ip;
                    this.vncDetailsUpdate.user_port = res.data.data.user_port;
                    this.vncDetailsUpdate.is_allocation = res.data.data.is_allocation;
                    // this.vncDetailsUpdate.is_allocation = '是';
                });
            },
            getallocationList() {
                let status = this.activeName === '0' ? undefined : parseInt(this.activeName);
                allocationList(this.$route.params.id, status, this.perPage, this.currentPage).then(res => {
                    this.allocationLists = res.data.data.data;
                    // console.log('allocationList', res.data.data);
                    this.total = res.data.data.total;
                });
            },
            handleCurrentChange(val) {
                this.getallocationList();
            },
            // 权限控制
            controlPermission() {
                this.hisList = !contains('operation_certify_list'); // 是否有显示出证列表权限
                this.hisDetail = !contains('operation_certify_detail'); // 是否有出证详情权限
            },
            vncUpdate() {
                let updateVncParams = {
                    id: this.vncId,
                    ip: this.vncDetailsUpdate.ip,
                    port: this.vncDetailsUpdate.user_port,
                    is_allocation: this.vncDetailsUpdate.is_allocation
                };
                console.log('updateVncParams', updateVncParams);
                updateVnc(updateVncParams).then(res => {
                    console.log(res);
                    if (res.data.error === 0) {
                        this.vncUpdateStatus = false;
                        console.log(res.data);
                        this.getvncDetail();
                        this.$message({
                            type: 'success',
                            message: '修改成功'
                        });
                    } else {
                        this.$message({
                            type: 'error',
                            message: res.data.data
                        });
                    }
                });
            },
            getOprecord(id) {
                oprecordList(id).then(res => {
                    if (res.data.error === 0) {
                        this.oprecordStatus = true;
                        this.oprecordList = res.data.data;
                        console.log(res.data);
                        this.getvncDetail();
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
    @import '../../../style/common.scss';
    @import '../../../scss/mixin.scss';
    #virtualMana {
        padding: 0 15px;
        th, td {
            // width: 16%;
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
                text-align: center;
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
        .vncUpdate{
            cursor: pointer;
        }
        .bl{
            border-left: 1px solid grey;
        }
        .vncTitle{
            background-color: white;
            padding: 10px 0;
        }
        .ml{
            margin-left: 50px;
        }
    }
</style>
