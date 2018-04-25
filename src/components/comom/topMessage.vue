<template>
    <div id="topMessage">
        <div><span>{{operationName}}</span></div>
        <div><span>快速筛选:</span>
            <div class="tab-wrapper">
                <el-tabs v-model="activeName" @tab-click="handleClick">
                    <el-tab-pane label="全部" name="first"></el-tab-pane>
                    <el-tab-pane label="已退款" name="second"></el-tab-pane>
                    <el-tab-pane label="已拒绝" name="third"></el-tab-pane>
                </el-tabs>
            </div>
            <el-form :inline="true" :model="fromInline">

            </el-form>
        </div>
    </div>
</template>
<script>
    export default{
        data() {
            return {
                currentTabIndex: 0,
                activeName: 'first',
                operaionName: ''
            };
        }
    };
</script>
<style>

</style>
