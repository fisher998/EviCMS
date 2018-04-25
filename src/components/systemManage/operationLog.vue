<template>
    <div id="operationLog">
        <div class="operationLogTop">
            <span>操作日志</span>
        </div>
        <div class="filter">
            <el-form :inline="true" :model="formInline">
                <el-form-item label="管理员">
                    <el-input v-model="formInline.user" @keyup.enter.native="_adminList"></el-input>
                </el-form-item>
                <el-form-item label="类别">
                    <el-select v-model="formInline.type" placeholder="请选择">
                        <el-option
                            v-for="item in formInline.option"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                    <!--<el-input v-model="formInline.type" ></el-input>-->
                </el-form-item>
                <el-form-item label="统计时间:">
                            <el-date-picker
                                size="small"
                                v-model="formInline.time"
                                type="daterange"
                                align="right"
                                unlink-panels
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                @keyup.enter.native="_adminList"
                                :picker-options="pickerOptions2">
                            </el-date-picker>
                        </el-form-item>
                <el-form-item>
                    <el-button style="background:#999999;color:#fff" @click="_adminList" size="small">搜索</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="">
            <table cellspacing="0" cellpadding="0" border="0">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>管理员</th>
                    <th>时间</th>
                    <th>操作类别</th>
                    <th>内容</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item,index) in operationData" :key="item.id">
                    <td>{{item.id}}</td>
                    <td><span v-if="item.admin"> {{item.admin.name}} </span></td>
                    <td>{{item.add_time}}</td>
                    <td>{{item.log_type}}</td>
                    <td>{{item.log_content}}</td>
                </tr>
                </tbody>
            </table>
        </div>
        <!--分页功能-->
        <div class="pagination" v-if="total>15">
            <el-pagination
                layout="prev, pager, next,total"
                :total="total"
                :page-size="perpage"
                :current-page.sync="currentPage"
                @current-change="handleCurrentChange()"
            >
            </el-pagination>
        </div>
    </div>
</template>
<script>
    import {getAdminLog} from '../../api/setuser';
    import {formatDate, contains} from '../../assets/public';

    export default {
        created() {
            this._adminList();
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
                total: 0, // 总条数
                currentPage: 1, // 当前页码
                perpage: 15, // 每页多少条
                pickerOptions0: {
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    }
                },
                formInline: {
                    user: '',
                    type: '',
                    region: '',
                    time_begin: '',
                    time_end: '',
                    time: ['', ''],
                    option: [
                        {
                            value: 1,
                            label: '修改用户信息'
                        },
                        {
                            value: 2,
                            label: '添加用户'
                        },
                        {
                            value: 3,
                            label: '投诉建议回复'
                        },
                        {
                            value: 4,
                            label: '退款处理'
                        },
                        {
                            value: 5,
                            label: '存证盖章'
                        },
                        {
                            value: 6,
                            label: '存证发件'
                        },
                        {
                            value: 7,
                            label: '确认收件'
                        },
                        {
                            value: 8,
                            label: '编辑收件人信息'
                        },
                        {
                            value: 9,
                            label: '确认出庭交易'
                        },
                        {
                            value: 10,
                            label: '确认出庭'
                        }
                    ]
                },
                operationData: []
            };
        },
        methods: {
            _adminList() {
                getAdminLog(this.formInline.user, this.formInline.type, formatDate(this.formInline.time[0]), formatDate(this.formInline.time[1]), this.perpage, this.currentPage).then(res => {
                    if (res.data.error === 0) {
                        this.operationData = res.data.data.data;
                        this.total = res.data.data.total;
                    }
                });
            },
            // 分页
            handleCurrentChange() {
                this._adminList();
            },
            // 权限控制
            permissionControl() {
                this.operationData = !contains('admin_logs_list') ? this.operationData : [];
            }
        }
    };
</script>
<style lang="scss" type="text/scss">
    @import '../../style/common.scss';
    @import '../../scss/mixin.scss';

    #operationLog {
        padding: 0 15px;
        &:before{
            display:block;
            clear:both;
            content:''
        }
        .el-form {
            margin: 0;
            float: right;
            .el-form-item {
                margin-bottom: 0px;
                .el-col-4 {
                    text-align: center;
                }
            }
            .el-input__inner {
                display: inline-block;
                width: 250px;
                height: 30px;
            }
            .el-date-editor.el-input {
                width: 150px;
            }
        }
        .operationLogTop {

            display: inline-block;
            padding: 15px 0;
            span {
                @include span;
            }
        }
        .filter {
            margin-bottom: 10px;
            float: right;
            margin-top: 10px;
        }
        .pagination {
            text-align: center;
        }
table{
    table-layout: auto;
}
    }
</style>
