<template>
   <div>
       <el-date-picker
      v-model="value"
      type="daterange"
      align="right"
      unlink-panels
      range-separator="至"
      placeholder="开始日期"
      :picker-options="pickerOptions2">
    </el-date-picker>

   </div>
</template>
<script>
export default {
  data() {
    return {
        value: '',
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
      }
    };
  },
  method: {
  }
};
</script>

<style scoped>
    @import '../style/common.scss';
    @import '../scss/mixin.scss';

</style>
