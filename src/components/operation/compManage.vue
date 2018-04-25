<template>
    <div id="compManage">
        <div class="mbody">
            <div class="top">
                <span class="compManage">投诉建议管理</span>
                <div class="top-area">
                  <span>快速筛选：</span>
                    <div class="tab-wrapper">
                        <el-tabs v-model="activeName" @tab-click="handleClick()">
                            <el-tab-pane label="全部" name=0 ></el-tab-pane>
                            <el-tab-pane label="已处理" name=2></el-tab-pane>
                            <el-tab-pane label="未处理" name=1></el-tab-pane>
                        </el-tabs>
                    </div>
                </div>
            </div>
            <div class="list-area" id="data_list_area">
                <table border="0" cellspacing="0" cellpadding="=0">
                    <thead>
                    <tr>
                        <th>时间</th>
                        <th>用户名称</th>
                        <th>内容</th>
                        <th>状态</th>
                        <th>操作</th>
                    </tr>
                    </thead>
                    <tbody v-bind:class = "{hide:compList}">
                    <tr v-for="(item,index) in compManage">
                        <td>{{item.request_time}}</td>
                        <td>(+{{item.user.area_code}}) {{item.user.cell_phone}}</td>
                        <td class="content">{{item.content}}</td>
                        <td>

                            <template v-if="item.status === 1">
                                <span class="redtext">未处理</span>
                            </template>
                            <template v-else-if="item.status === 2">
                                <span class="greentext">已处理</span>
                            </template>
                            <template v-else>
                                <span class="bluetext">处理中</span>
                            </template>
                        </td>
                        <td>
                            <template v-if="item.status == 2">
                                <el-button size="small"  :class="{hide:deal}" @click="tofeedbackDetail(index)">查看</el-button>
                            </template>
                            <template v-else>
                                <el-button size="small" class="addStyle" :class="{hide:deal}" @click="tofeedbackDetail(index)">处理</el-button>
                            </template>
                        </td>
                    </tr>
                    </tbody>
                </table>
                <!--分页-->
                <div class="pagination"  :class="{hide:compList}" v-if="total > 15">
                    <el-pagination
                        layout="prev, pager, next,total"
                        :total= "total"
                        :page-size="perpage"
                        :current-page.sync="currentPage"
                        @current-change="handleCurrentChange()"
                    >
                    </el-pagination>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {feedbackList} from '../../api/operation';
    import {contains} from '../../assets/public';
    export default {
        created() {
            this._getCompManage();
            this.controlPermission();
        },
        data () {
            return {
                total: 0,
                currentPage: 1,
                currentTabIndex: 0,
                perpage: 15, // 每页的条数
                compList: false, // 判断是否有显示列表权限
                activeName: 0,
                deal: false, // 投诉建议处理权限
                compManage: [
                ]
            };
        },
        methods: {
            handleClick() {
                if (this.activeName === 0) {
                    this._getCompManage();
                } else {
                    this._getCompManage(this.activeName);
                }
            },
//            获取列表
            _getCompManage(num) {
                feedbackList(num, this.perpage, this.currentPage).then(res => {
                   if (res.data.error === 0) {
                       this.compManage = res.data.data.data;
                     this.total = res.data.data.total;
                   }
                });
            },
            tofeedbackDetail(index) {
                this.$router.push({name: 'complaint', params: {report_id: this.compManage[index].report_id, status: this.compManage[index].status, reply_content: this.compManage[index].reply_content}});
            },
            handleCurrentChange() {
                this._getCompManage();
            },
            // 判断权限
            controlPermission() {
                this.compList = !contains('operation_feedback_list'); // 是否有显示列表权限
                this.deal = !contains('operation_feedback_reply'); // 是否有回复权限
            }
        }
    };

</script>

<style lang="scss" type="text/scss">
    @import '../../style/common.scss';
    #compManage{
        padding: 0 15px;
    a{
        color:#333;
    }
        .top:before{
            content:'';
            display:block;
            height:0;
            clear:both;
        }
   table{
       table-layout:fixed;
       .content{
           overflow:hidden;
           text-overflow:ellipsis;
           white-space:nowrap;
       }
       .addStyle{
           border:1px solid #409EFF;
           span{
               color:#409EFF;
           }
       }
       td{
           border-bottom:1px solid #eee;
           .redtext{
               color:#ff4949;
           }
           .bluetext{
               color:#20a0ff;
           }
           .greentext{
               color:#4cce6d;
           }
       }
   }
.pagination{
    margin:15px 0;
    text-align: center;
    .el-pagination{
        display:inline-block;
    }
}
    .compManage {
        /*float: left;*/
        border-left: 2px solid #2D4D9F;
        padding-left: 15px;
        margin-right:40px;
        display:inline-block;
    }
    .el-tabs{
        .el-tabs__header{
            border-bottom:0;
        }
    }
    .top-area{
    width:500px;
    display:inline-block;
        .tab-wrapper{
            display: inline-block;
            vertical-align: -28px;
            margin-left: 10px;
            width: 280px;
        }
    }
    #compManage {
        background: #eee;
        height: 100%;
        padding: 15px 25px;
    }

    #compManage input {
        padding: 2px;
        /*display:inline-block;*/
    }


    table, thead, tbody {
        width: 100%;
    }

    .el-button {
        margin: 0;
    }
    #compManage .grayline {
        border: 1px solid #ccc;
        height: 30px;
        margin: 0 20px;
        display:block;
    }
    }
</style>
