<template xmlns:v-bind="http://www.w3.org/1999/xhtml">
    <div id="TrialManage">
        <div class="TrialManagetop"><span>出庭管理</span></div>
        <div><span>快速筛选:</span>
            <div class="tab-wrapper">
                <el-tabs v-model="activeName" @tab-click="handleClick">
                    <el-tab-pane label="全部" name='-1'></el-tab-pane>
                    <el-tab-pane label="待处理" name='0'></el-tab-pane>
                    <el-tab-pane label="已确认" name='1'></el-tab-pane>
                    <el-tab-pane label="已出庭" name='2'></el-tab-pane>
                </el-tabs>
            </div>
            <el-form :inline="true" :model="timeFrom">
                <el-form-item>
                   
                        <el-date-picker
                                size="small"
                                v-model="timeFrom.time"
                                type="daterange"
                                align="right"
                                unlink-panels
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                @keyup.enter.native="searchList"
                                :picker-options="pickerOptions2">
                            </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button size="small"  @click.native.prevent="searchList">搜索</el-button>
                </el-form-item>
            </el-form>
            <!--<el-form :inline="true" :model="formInline" >-->
            <!--<el-form-item label="用户名称:">-->
            <!--<el-input v-model="formInline.userName"></el-input>-->
            <!--</el-form-item>-->
            <!--<el-form-item label="存证号：">-->
            <!--<el-input v-model="formInline.Memory"></el-input>-->
            <!--</el-form-item>-->
            <!--<el-form-item label="申请时间：">-->
            <!--<el-col :span="8">-->
            <!--<el-time-picker type="fixed-time" v-model="formInline.data1" style="width:100%"></el-time-picker>-->
            <!--</el-col>-->
            <!--<el-col :span="1">至</el-col>-->
            <!--<el-col :span="8">-->
            <!--<el-time-picker type="fixed-time" v-model="formInline.data2" style="width:100%"></el-time-picker>-->
            <!--</el-col>-->
            <!--<el-col :span="6">-->
            <!--<el-button>搜索</el-button>-->
            <!--</el-col>-->
            <!--</el-form-item>-->
            <!--</el-form>-->
        </div>
        <div>
            <table cellspacing="0" cellpadding="0" border="0">
                <thead>
                <tr>
                    <th>时间</th>
                    <th>用户</th>
                    <th>存证号</th>
                    <th>状态</th>
                    <th>操作</th>
                </tr>
                </thead>
                <tbody v-bind:class="{hide:trailList}">
                <tr v-for="(item,index) in TrialData">
                    <td>{{item.request_time}}</td>
                    <td><span  v-if="item.user">(+{{item.user.area_code}}) {{item.user.cell_phone}}</span></td>
                    <td><span  v-if="item.certapply">{{item.certapply.cert_no}}</span></td>
                    <td>
                        <!--{{item.status}}-->
                        <template v-if="item.status == 0">
                            <span>待审核</span>
                        </template>
                        <template v-else-if="item.status== 1">
                            <span>已联系确认</span>
                        </template>
                        <template v-else-if="item.status==2">
                            <span>已出庭</span>
                        </template>
                        <template v-else-if="item.status===3">
                            <span>交易完成</span>
                        </template>
                        <template v-else-if="item.status === -1">
                            <span>用户取消</span>
                        </template>
                    </td>
                    <td>
                        <template v-if="item.status !== -1">
                            <el-button @click="todetailCourt(index)" style="color: #409EFF; border: 1px solid;" size="small">查看审核</el-button>
                        </template>
                        <template v-else>
                            <el-button size="small" disabled>查看审核</el-button>
                        </template>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
        <div  class="pagination" :class="{hide: trailList}" v-if="total>15">
            <el-pagination
                layout="prev, pager, next,total"
                :total="total"
                :page-size="perPage"
                :current-page.sync="currentPage"
                @current-change="handleCurrentChange()"
            ></el-pagination>
        </div>
    </div>
</template>
<script>
    import {trailManage} from '../../api/operation';
    import {translateTime, contains} from '../../assets/public';
    export default {
        created() {
            this.showtrailList();
            this.controlPermission();
        },
        data () {
            return {
                pickerOptions2: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          },
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }
        ]
      },
                trailList: false, // 出庭管理列表是否显示
                trailDetail: false, // 出庭管理详情是否显示
                currentTabIndex: 0,
                total: 0,
                currentPage: 1,
                perPage: 15, // 每页显示的条数
                activeName: '-1',
                timeFrom: {
                    value1: '',
                    value2: '',
                    time: ['', '']
                },
                pickerOptions0: {
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    }
                },
                TrialData: []
//                formInline: {
//                    userName: '',
//                    Memory: ''
//                }
            };
        },
        methods: {
            handleClick: function () {
                this.showtrailList();
            },
            showtrailList() {
                if (this.activeName === '-1') {
                    trailManage(translateTime(this.timeFrom.time[0]), translateTime(this.timeFrom.time[1]), undefined, this.perPage, this.currentPage).then(res => {
                        this.TrialData = res.data.data.data;
                        this.total = res.data.data.total;
                    });
                } else {
                    trailManage(translateTime(this.timeFrom.time[0]), translateTime(this.timeFrom.time[1]), parseInt(this.activeName), this.perPage, this.currentPage).then(res => {
                       if (res.data.error === 0) {
                           this.TrialData = res.data.data.data;
                           this.total = res.data.data.total;
                       }
                    });
                }
            },
            searchList() {
                this.showtrailList();
            },
            todetailCourt(index) {
                if (this.TrialData[index].status !== -1) {
                    this.$router.push({name: 'detailCourt', params: {courtId: this.TrialData[index].apply_id}});
                }
            },
            // 权限控制函数
            controlPermission() {
                this.trailList = !contains('operation_court_list');  // 是否有出庭列表权限
                this.trailDetail = !contains('operation_certify_detail'); // 是否有出庭详情权限
            },
            handleCurrentChange() {
                this.showtrailList();
            }
        }
    };
</script>
<style lang="scss">
    @import '../../style/common.scss';
    @import '../../scss/mixin.scss';
    #TrialManage {
        padding: 0 15px;
    .pagination{
        text-align: center;
    }
    .TrialManagetop {
        padding: 15px 0;
        padding-bottom:0;
    span {
      @include span;
    }

    }
    table{
        table-layout: fixed;
    }
    .tab-wrapper {
        display: inline-block;
        vertical-align: -28px;
        width: 320px;
        margin-left: 20px;

    }
    .el-col-3{
        text-align:right;
       .el-button{
           background:#eee;
           border:0;
           color:#333;
           padding-right:10px;
       }
    }

    .el-tabs__header {
        border-bottom: 0;
    }
.el-tabs__item{
    padding:0 10px;
}
.el-form{
    display:inline-block;
    float:right;
    width:500px;
}
    /*form {*/
        /*float:right；*/

    /*div {*/
        /*display: inline-block;*/
    /*}*/

    /*input[type=button]{*/
        /*color:#fff;*/
        /*padding:4px 7px;*/
        /*display:inline-block;*/
        /*background: #999999;*/

    /*}*/
    /*input {*/
        /*border: 1px solid #eee;*/
        /*padding: 3px;*/
    /*}*/

    /*}*/
    }
</style>
