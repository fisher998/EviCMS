<template>
    <div id="behaviourData">
        <div class="behaviourData"><span>行为分析</span></div>
        <div>
            <table cellspacing="0" cellpadding="0" border="0">
                <thead>
                <tr>
                    <th>操作类型</th>
                    <th>登录</th>
                    <th>网页打印</th>
                    <th>文档保全</th>
                    <th>录音存证</th>
                    <th>录像存证</th>
                    <th>拍照存证</th>
                    <th>截屏存证</th>
                    <th>验证</th>
                    <th>全挂</th>
                    <th>单挂</th>
                    <th>出证</th>
                    <th>纸质出证</th>
                    <th>出庭</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>操作总数</td>
                    <td>{{AllData.loginCount}}</td>
                    <td>{{AllData.webPrintCount}}</td>
                    <td>{{AllData.documentCount}}</td>
                    <td>{{AllData.radioCount}}</td>
                    <td>{{AllData.videoCount}}</td>
                    <td>{{AllData.photoCount}}</td>
                    <td>{{AllData.screenCount}}</td>
                    <td>{{AllData.poeCount}}</td>
                    <td>{{AllData.fullAmountCount}}</td>
                    <td>{{AllData.singleAmountCount}}</td>
                    <td>{{AllData.certifyCount}}</td>
                    <td>{{AllData.paperCount}}</td>
                    <td>{{AllData.courtCount}}</td>
                </tr>
                </tbody>
            </table>
        </div>
        <div class="statistical">
            <template>
            <el-form :inline="true" :model="searchForm" ref="searchForm">
                <el-form-item label="统计方式：">
                    <el-select v-model="searchForm.value" size="small" placeholder="请选择">
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
                                align="left"
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
                            size="small"
                            @keyup.enter.native="searchList"
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
                            size="small"
                            @keyup.enter.native="searchList"
                            placeholder="选择结束年份">
                        </el-date-picker>
                    </el-form-item>
                </template>
                <el-form-item>
                    <el-button @click="searchList" size="small">搜索</el-button>
                </el-form-item>
            </el-form>
            </template>
        </div>
        <div>
            <table cellpadding="0" cellspacing="0" border="0">
                <thead>
                <th>时间</th>
                <th>登录</th>
                <th>网页打印</th>
                <th>文档保全</th>
                <th>录音存证</th>
                <th>录像存证</th>
                <th>拍照存证</th>
                <th>截屏存证</th>
                <th>验证</th>
                <th>全挂</th>
                <th>单挂</th>
                <th>出证</th>
                <th>纸质出证</th>
                <th>出庭</th>
                </thead>
                <tbody v-bind:class="{hide: showList}">
                <tr v-for="(item, index) in searchData">
                    <td>{{item.date}}</td>
                    <td>{{item.loginCount}}</td>
                    <td>{{item.webPrintCount}}</td>
                    <td>{{item.documentCount}}</td>
                    <td>{{item.radioCount}}</td>
                    <td>{{item.videoCount}}</td>
                    <td>{{item.photoCount}}</td>
                    <td>{{item.screenCount}}</td>
                    <td>{{item.poeCount}}</td>
                    <td>{{item.fullAmountCount}}</td>
                    <td>{{item.singleAmountCount}}</td>
                    <td>{{item.certifyCount}}</td>
                    <td>{{item.paperCount}}</td>
                    <td>{{item.courtCount}}</td>
                </tr>
                </tbody>
            </table>
        </div>
        <!--分页-->
        <div class="pagination" v-if="total>15">
            <el-pagination
                layout="prev, pager, next,total"
                :total="total"
                :page-size="size"
                :current-page.sync="currentPage"
                @current-change="handleCurrentChange()"
            >
            </el-pagination>
        </div>
        <div class="behaviour">
            <ve-line :data="chartData" :settings="chartSettings"></ve-line>
        </div>
    </div>
</template>
<script>
    import {actionsTotal, actionTime} from '../../api/statistic';
    import {translateTime, contains} from '../../assets/public';
    export default {
        created() {
            this._getTotalData();
            this.searchList();
            this.chartData;
            this.chartSettings;
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
                showList: false, // 是否有显示列表权限
                currentTabIndex: 0,
                activeName: 'first',
                operaionName: '',
                AllData: [],
                currentPage: 1, // 当前页
                size: 15, // 一页显示条数
                total: 0,
                searchData: [],
                chartData: {
                    columns: ['网页打印', '日期', '文档保全', '网页截屏', '录音存证', '录像存证', '拍照存证', '截屏存证', '纸质出证'],
                    rows: []
                },
                chartSettings: {
                    metrics: ['网页打印', '网页截屏', '录音存证', '录像存证', '拍照存证', '截屏存证', '纸质出证', '文档保全'],
                    dimension: ['日期']
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
                }
            };
        },
        methods: {
            handleClick: function () {
                console.log('click');
            },
            _getTotalData() {
                actionsTotal().then(res => {
                    if (res.data.error === 0) {
                        this.AllData = res.data.data || [];
                    }
                });
            },
            // 转换表格数组
            ArrayList(list, array) {
//                array = [];
                for (let i = 0; i < list.length; i++) {
                    array.push({'网页打印': list[i].webPrintCount, '日期': list[i].date, '网页截屏': list[i].webscreenCount, '文档保全': list[i].documentCount, '录音存证': list[i].radioCount, '录像存证': list[i].videoCount, '拍照存证': list[i].photoCount, '截屏存证': list[i].screenCount, '纸质出证': list[i].paperCount});
                }
            },
            // 获取时间查询结果
            searchList() {
                this.chartData.rows = [];
                if (this.searchForm.value === '1') {
                    actionTime(translateTime(this.searchForm.time[0]), translateTime(this.searchForm.time[1]), parseInt(this.searchForm.value)).then(res => {
                   if (res.data.error === 0) {
                       this.searchData = res.data.data;
                      this.ArrayList(this.searchData, this.chartData.rows);
                      this.total = res.data.total;
                   }
                });
                } else {
                actionTime(translateTime(this.searchForm.value1), translateTime(this.searchForm.value2), parseInt(this.searchForm.value)).then(res => {
                   if (res.data.error === 0) {
                       this.searchData = res.data.data;
                      this.ArrayList(this.searchData, this.chartData.rows);
                      this.total = res.data.total;
                   }
                });
                }
            },
            handleCurrentChange() {
                console.log('click');
            },
            // 权限控制函数
            permissionControl() {
                this.AllData = !contains('statistic_actions_total') ? this.AllData : {}; // 操作分类总数列表
                this.searchData = !contains('statistic_actions_time') ? this.searchData : {}; // 操作分类按时间接口
            }
        }
    };
</script>
<style lang="scss" type="text/scss">
    @import '../../style/common.scss';
    @import '../../scss/mixin.scss';
    #behaviourData {
        padding: 0 15px;

    .behaviourData {
        padding: 15px 0;
    span {
       @include span;
    }

    }
        .el-form{
            .el-form-item{
                margin-bottom: 0;
                .el-col-3{
                    text-align: right;
                }
                .el-select{
                    width:100px;
                }
            }
        }
        .statistical{
            margin:10px 0;
        }
        .behaviour{
            background: #fff;
            margin-top:10px;
        }
    }
</style>
