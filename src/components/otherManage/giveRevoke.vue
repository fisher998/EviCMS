<template>
    <div id="revoke">
        <div class="revokeTop">
            <span>菜单管理--菜单详情</span>
        </div>
        <div class="revokeCon">
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选
            </el-checkbox>
            <div style="margin: 15px 0;"></div>
            <el-checkbox-group v-model="checkedRoles" @change="handleCheckedRolesChange">
                <el-checkbox v-for="role in roles" :label="role" :key="role.id">{{role.name}}</el-checkbox>
            </el-checkbox-group>
            <div class="button">
                <el-button type="primary" @click="saveRovoke">保存</el-button>
                <el-button type="success" @click="back">返回</el-button>
            </div>
        </div>
    </div>
</template>
<script>
    import {getRoleList} from '../../api/setuser';
    import {detailmenu, updatemenu} from '../../api/other';

    export default {
        created() {
            this.getList();
        },
        data() {
            return {
                checkAll: false,
                checkedRoles: [],
                roles: [],
                isIndeterminate: true,
                detail: ''
            };
        },
        methods: {
            handleCheckAllChange(val) {
                this.checkedRoles = val ? this.roles : [];
                this.isIndeterminate = false;
            },
            handleCheckedRolesChange(value) {
                let checkedCount = value.length;
                this.checkAll = checkedCount === this.roles.length;
                this.isIndeterminate = checkedCount > 0 && checkedCount < this.roles.length;
            },
            // 获取列表
            getList() {
                return new Promise(() => {
                    getRoleList().then(res => {
                        if (res.data.error === 0) {
                            this.roles = res.data.data;
                        }
                    }).then(res => {
                        detailmenu(this.$route.params.rovokeId).then(res => {
                            this.detail = res.data.data;
                            for (let s of this.roles) {
                                if (res.data.data.role_id.indexOf(s.id) !== -1) {
                                    this.checkedRoles.push(s);
                                }
                            }
                        });
                    });
                });
            },
            // 保存权限
            saveRovoke() {
                let str = [];
                for (let item of this.checkedRoles) {
                    str.push(item.id);
                }
                str = str.join(',');
                console.log(str);
                updatemenu(this.detail.menu_id, this.detail.name, this.detail.link, this.detail.status, this.detail.pid, str).then(res => {
                    if (res.data.error === 0) {
                        this.$message({
                            message: '保存成功',
                            type: 'success',
                            showClose: true
                        });
                    } else {
                        this.$message({
                            message: res.data.data,
                            type: 'error'
                        });
                    }
                });
            },
            // 返回
            back() {
                this.$router.go(-1);
            }
        }
    };
</script>
<style lang="scss">
    /*@import '../../style/common.scss';*/
    @import '../../scss/mixin.scss';

    #revoke {
        padding: 0 15px;

    .revokeTop {
        padding: 15px 0;

    span {
    @include span;
    }

    }
    .revokeCon {
        position: relative;
        padding: 15px 40px 15px;
        min-height: calc(100vh - 100px);
        background: #fff;
    }

    .button {
        position:absolute;
        bottom:30px;

        /*display: flex;*/
        /*bottom:0;*/
    }
    }
</style>
