<template>
    <div id="userData">
        <div class="userDataTop">
            <span>用户数据</span>
        </div>
        <div class="DataCount">
            <span>
                <i></i>
                <strong>总注册用户：</strong>
                <small>{{userData.allUserCount}}人</small>
            </span>
            <span>
                <i></i>
                <strong>充值用户数：</strong>
                <small>{{userData.userTopUpCount}}人</small>
            </span>
            <span>
                <i></i>
                <strong>上月新增：</strong>
                <small>{{userData.lastMonthCount}}人</small>
            </span>
            <span>
                <i></i>
                <strong>当月新增：</strong>
                <small>{{userData.currentMonthCount}}人</small>
            </span>
        </div>
        <div class="statistical">
            <el-form :inline="true" :model="searchForm" ref="searchForm">
                <el-form-item label="统计方式：">
                    <el-select v-model="searchForm.value" placeholder="请选择" size="small">
                        <el-option
                            v-for="item in searchForm.options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <template v-if="searchForm.value === '1'">
                    <el-form-item label="统计时间:">
                        <el-date-picker
                                size="small"
                                v-model="searchForm.time"
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
                </template>
                <template v-else-if="searchForm.value === '2'">
                    <el-form-item label="统计时间:">
                        <el-date-picker
                            v-model="searchForm.value1"
                            type="month"
                            @keyup.enter.native="searchList"
                            size="small"
                            placeholder="选择开始月份">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="至">
                        <el-date-picker
                            v-model="searchForm.value2"
                            type="month"
                            size="small"
                            @keyup.enter.native="searchList"
                            placeholder="选择结束月份">
                        </el-date-picker>
                    </el-form-item>
                </template>
                <template v-else-if="searchForm.value === '3'">
                    <el-form-item label="统计时间:">
                        <el-date-picker
                            v-model="searchForm.value1"
                            type="year"
                            size="small"
                            @keyup.enter.native="searchList"
                            placeholder="选择开始年份">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="至">
                        <el-date-picker
                            v-model="searchForm.value2"
                            type="year"
                            @keyup.enter.native="searchList"
                            size="small"
                            placeholder="选择结束年份">
                        </el-date-picker>
                    </el-form-item>
                </template>
                </el-form-item>
                <el-form-item>
                    <el-button @click="searchList" size="small">搜索</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div>
            <table cellpadding="0" cellspacing="0" border="0">
                <thead>
                <tr>
                    <th>时间</th>
                    <th>新增注册用户数</th>
                    <th>新增充值用户数</th>
                    <th>登录用户数</th>
                </tr>
                </thead>
                <tbody v-bind:class="{hide: showList}">
                <tr v-for="(item,indx) in statisticalData">
                    <td>{{item.date}}</td>
                    <td>{{item.userCount}}</td>
                    <td>{{item.userTopUpCount}}</td>
                    <td>{{item.userLoginCount}}</td>
                </tr>
                </tbody>
            </table>
        </div>
        <div class="chart">
            <ve-line :data="chartData" :setting="chartSettings"></ve-line>
        </div>

    </div>
</template>
<script>
    import {userTotal, userTime} from '../../api/statistic';
    import {translateTime, contains} from '../../assets/public';

    export default {
        created() {
            this._userTotalDate();
            this.searchList();
            this.chartData;
            this.chartSettings;
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
                showList: false, // 是否有显示列表权限
                chartData: {
                    columns: ['时间', '新增注册用户数', '新增充值用户数', '登录用户数'],
                    rows: []
                },
                chartSettings: {
                    metrics: ['新增注册用户数', '新增充值用户数', '登录用户数'],
                    dimension: ['']
                },
                searchForm: {
                    value: '1',
                    value1: '',
                    value2: '',
                    time: ['', ''],
                    options: [{
                        value: '1',
                        label: '按日统计'
                    }, {
                        value: '2',
                        label: '按月统计'
                    }, {
                        value: '3',
                        label: '按年统计'
                    }],
                    pickerOptions0: {
                        disabledDate(time) {
                            return time.getTime() > Date.now();
                        }
                    }
                },
                userData: {
                    totalUser: 9999,
                    rechargeUser: 9998,
                    pastnewData: 9999,
                    nownewData: 9999
                },
                statisticalData: []
            };
        },
        methods: {
            // 获取用户数据
            _userTotalDate() {
                userTotal().then(res => {
                    if (res.data.error === 0) {
                        this.userData = res.data.data;
                    }
                });
            },
            // 转换表格数组
            ArrayList(list, array) {
//                array = [];
                for (let i = 0; i < list.length; i++) {
                    array.push({
                        '新增注册用户数': list[i].userCount,
                        '时间': list[i].date,
                        '新增充值用户数': list[i].userLoginCount,
                        '登录用户数': list[i].userTopUpCount
                    });
                }
            },
            // 按时间查询数据
            searchList() {
                this.chartData.rows = [];
                if (this.searchForm.value === '1') {
                    userTime(translateTime(this.searchForm.time[0]), translateTime(this.searchForm.time[1]), parseInt(this.searchForm.value)).then(res => {
                    if (res.data.error === 0) {
                        this.statisticalData = res.data.data;
                        this.ArrayList(this.statisticalData, this.chartData.rows);
                    }
                    console.log('日');
                });
                } else {
                    console.log('月年');
                userTime(translateTime(this.searchForm.value1), translateTime(this.searchForm.value2), parseInt(this.searchForm.value)).then(res => {
                    if (res.data.error === 0) {
                        this.statisticalData = res.data.data;
                        this.ArrayList(this.statisticalData, this.chartData.rows);
                    }
                });
                }
            },
            // 权限控制函数
            permissionControl() {
                this.showList = !contains('statistic_users_time'); // 是否有显示列表权限
                this.userData = !contains('statistic_users_total') ? this.userData : ''; // 是否有显示总数权限
            }
        }
    };
</script>
<style lang="scss" type="text/scss">
    @import '../../scss/mixin';
    @import '../../style/common.scss';

    #userData {
        padding: 0 15px;
        .userDataTop {
            padding: 15px 0;
            span {
                @include span;
            }
        }
        .paginnation {
            text-align: center;
        }
        .DataCount {
            padding: 20px 0;
            background: #fff;
            margin-bottom: 20px;
            span {
                position: relative;
                display: inline-block;
                width: 23%;
                text-align: center;
                border-right: 1px solid #eee;
                small {
                    font-size: 16px;
                    margin-left: 20px;
                }
                &:nth-child(1) i {
                    @include dotted(#2CBE6C);
                    left: 25px;
                    top: 5px;
                }
                &:nth-child(2) i {
                    @include dotted(#f38942);
                    left: 25px;
                    top: 5px;
                }
                &:nth-child(3) i {
                    @include dotted(#5184f8);
                    left: 25px;
                    top: 5px;
                }
                &:nth-child(4) i {
                    @include dotted(#6a57ff);
                    left: 25px;
                    top: 5px;
                }
                &:last-child {
                    border: 0;
                }
            }
        }
        .el-form-item {
            margin-bottom: 0;
            .el-select {
                width: 100px;
            }
            .el-col-3 {
                text-align: right;
            }
        }
        .statistical {
            padding: 20px 0;
            border-top: 1px solid #ddd
        }
        .chart {
            background: #fff;
            margin-top: 10px;
        }
    }
</style>
