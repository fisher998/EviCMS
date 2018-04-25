<template>
    <div id="HisManage">
        <div class="histop"><span>出证管理</span><span class="quickSelect">快速筛选:</span>
            <div class="tab-wrapper">
                <el-tabs v-model="activeName" @tab-click="handleClick">
                    <el-tab-pane label="全部" name="0"></el-tab-pane>
                    <el-tab-pane label="待处理" name="2"></el-tab-pane>
                    <el-tab-pane label="待打印" name="3"></el-tab-pane>
                    <el-tab-pane label="待发件" name="4"></el-tab-pane>
                    <el-tab-pane label="已发件" name="5"></el-tab-pane>
                    <el-tab-pane label="已完成" name="6"></el-tab-pane>
                </el-tabs>
            </div>
        </div>
        <div>
            <el-form :inline="true" :model="formIn">
                <el-form-item label="用户名称:">
                    <el-input v-model="formIn.username"  @keyup.enter.native="certList" size="small"></el-input>
                </el-form-item>
                <el-form-item label="存证号：">
                    <el-input v-model="formIn.cert_num"  @keyup.enter.native="certList" size="small"></el-input>
                </el-form-item>
                <el-form-item label="时间：">
                        <el-date-picker
                                size="small"
                                v-model="formIn.time"
                                type="daterange"
                                align="left"
                                unlink-panels
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                @keyup.enter.native="certList"
                                :picker-options="pickerOptions2">
                            </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button size="small"  @click.native.prevent="certList">搜索</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div>
            <table cellpadding="0" cellspacing="0" border="0">
                <thead>
                <tr>
                    <th>时间</th>
                    <th>用户</th>
                    <th>存证号</th>
                    <th>类型</th>
                    <th>状态</th>
                    <th>操作</th>
                </tr>
                </thead>
                <tbody v-bind:class="{hide: hisList}">
                <tr v-for="(item,index) in hisData">
                    <td>{{item.req_time}}</td>
                    <td>(+{{item.user.area_code}}) {{item.user.cell_phone}}</td>
                    <td>{{item.cert_no}}</td>
                    <td>{{item.with_paper}}</td>
                    <td>
                        <!--<template v-if="item.status === 1">-->
                            <!--处理中-->
                        <!--</template>-->
                        <!--<template v-else-if="item.status === 2">-->
                            <!--完成-->
                        <!--</template>-->
                        <!--<template v-else-if="item.status === 0">-->
                            <!--出证失败-->
                        <!--</template>-->
                       <!--<template v-else>-->
                           <!--出证成功-->
                       <!--</template>-->
                        {{item.status}}
                    </td>
                    <td>
                        <template v-if="item.with_paper === '纸质版'">
                            <el-button size="small" @click="toHisDetail(index)" style="color:#409EFF; border:1px solid;">出证详情</el-button>
                        </template>
                        <template v-else>
                            <el-button size="small" disabled>出证详情</el-button>
                        </template>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
        <div class="pagination" v-bind:class="{hide: hisList}" v-if="total>15">
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
    import {certifyList} from '../../api/operation';
    import {contains, translateTime} from '../../assets/public';
    export default {
        created() {
            this.certList();
            this.controlPermission();
        },
        data() {
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
                hisData: []
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
                    this.total = res.data.data.total;
                    console.log(this.hisData);
                });
            },
            handleCurrentChange() {
                this.certList();
            },
            toHisDetail(index) {
                this.$router.push({
                    name: 'paperDetail',
                    params: {
                        detailId: this.hisData[index].apply_id
                    }
                });
            },
            // 权限控制
            controlPermission() {
                this.hisList = !contains('operation_certify_list'); // 是否有显示出证列表权限
                this.hisDetail = !contains('operation_certify_detail'); // 是否有出证详情权限
            }
        }
    };
</script>
<style lang="scss" type="text/scss">
    @import '../../style/common.scss';
    @import '../../scss/mixin.scss';
    #HisManage {
        padding: 0 15px;
        th, td {
            width: 16%;
        }
        .histop {
            &:before{
                content:'';
                display:block;
                clear:both;
            }
            &>span{
                @include span;
            }
            .quickSelect{
                border:0;
                margin-left: 20px;
            }
        }

        .tab-wrapper {
            display: inline-block;
            vertical-align: -28px;
            width: 840px;
            /*margin-left: 20px;*/
            .el-tabs__item {
                padding: 0 5px;
                font-size:13px;
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
    }
</style>
