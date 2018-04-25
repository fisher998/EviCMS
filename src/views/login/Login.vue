<template>
    <div class="login-wrapper">
        <div class="login-content">
            <el-form ref="form" :model="form" :rules="rules">
                <el-form-item>
                    <div class="CMStitle">证宝宝管理系统</div>
                </el-form-item>
                <el-form-item prop="username"
                :error="loginError.username">
                    <el-input name="username"
                              type="text"
                              v-model="form.username"
                              autoComplete="off"
                              :maxlength="25"
                              placeholder="用户名">
                    </el-input>
                </el-form-item>
                <el-form-item prop="password"
                :error="loginError.password">
                    <el-input type="password"
                              v-model="form.password"
                              autoComplete="off"
                              name="password"
                              placeholder="密码">

                    </el-input>
                </el-form-item>
                <el-form-item prop="verify_code">
                    <el-col :span="16">
                        <div class="grid-content bg-purple ">
                            <el-input
                                type="text"
                                name="verify_code"
                                auto-complete="off"
                                v-model="form.verify_code"
                                placeholder="手机验证码">
                            </el-input>
                        </div>
                    </el-col>
                    <el-col :span="6">
                        <div class="grid-content bg-purple">
                            <el-button type="primary" class="get-code" @click="sendCode" :disabled="time > 0">{{text}}</el-button>
                        </div>
                    </el-col>
                </el-form-item>
                <el-form-item>
                    <el-col :span="24">
                        <div class="grid-content bg-purple">
                            <el-button type="primary" :loading="loginLoading" @click="login()" class="big">登录</el-button>
                        </div>
                    </el-col>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
    import {getRandomNum} from '../../common/js/index';
    import {sendCode} from '../../api/User';
    export default {
        name: 'login',
        data() {
            // 验证图形验证码输入是否正确
//            const validateGraph = (rule, value, callback) => {
//                if (value === '') {
//                    callback(new Error('请输入图形验证码'));
//                } else if (value.length !== 4) {
//                    callback(new Error('验证码为四位数字'));
//                } else {
//                    callback();
//                }
//            };
            // 验证用户名是否正确
            const checkname = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('用户名不能为空'));
                } else {
                    callback();
                }
            };
            // 验证密码是否正确
            const validatepass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('密码不能为空'));
                } else {
                    callback();
                }
            };
//            const checkcode = (rule, value, callback) => {
//                if (!value) {
//                    callback(new Error('请输入验证码'));
//                    } else {
//                    if (this.verify_code !== '') {
//                        this.$refs.form.validateField('verify_code');
//                    }
//                    callback();
//                }
//            };
            return {
                loginLoading: false,
                key: '',
                time: 0,
                startTime: 60,
                form: {
                    username: '',
                    password: '',
                    graph_code: '',
                    verify_code: ''
                },
                loginError: {
                    username: '',
                    password: '',
                    graph_code: ''
                },
                rules: {
                    username: [{validator: checkname, trigger: 'blur'}],
                    password: [{validator: validatepass, trigger: 'blur'}]
                }
            };
        },
        computed: {
            text () {
                return this.time > 0 ? `重新发送(${this.time})` : '获取验证码';
            }
        },
        created () {
            this.key = getRandomNum();
        },
        methods: {
            // 获取验证码
            sendCode() {
                this.$refs.form.validateField('username', error => {
                    if (!error) {
                        sendCode(this.form.username)
                            .then(res => {
                                // 错误代码
                                const errno = res.data.error;
                                if (errno === 0) {
                                    this.start(); // 开始60秒倒计时
                                } else {
                                    this.$message({
                                        message: res.data.data,
                                        type: 'warning',
                                        showClose: true
                                    });
                                    this.signupForm.graph_code = '';
                                    this.refresh();
                                }
                            });
                    } else {
                        return false;
                    }
                });
            },
            // 刷新验证码
            refresh () {
                this.key = getRandomNum();
                this.$refs.verifyCode.src = '/graphics/code/get?ignore=1&key=' + this.key;
            },
            start () {
                this.time = this.startTime;
                this.timer();
            },
            timer() {
                if (this.time > 0) {
                    this.time--;
                    setTimeout(this.timer, 1000);
                }
            },
            login() {
                    this.$refs['form'].validate((valid) => {
                        if (valid) {
                            this.loginError.username = '';
                            this.loginError.password = '';
                            this.$store.dispatch('adminLogin', this.form).then((res) => {
                                this.loginLoading = false;
                                switch (res) {
                                    case 0:
                                        this.loginLoading = true;
                                        this.$router.push({path: '/'});
                                        break;
                                    case 100001:
                                        this.loginError.username = '管理员不存在，请联系超管添加';
                                            break;
                                    case 100002:
                                        this.$message({
                                            message: '该账号已被冻结，不能登录',
                                            type: 'error',
                                            showClose: true
                                        });
                                        break;
                                    case 100003:
                                        this.$message({
                                            message: '登陆失败，检查用户名和密码是否正确',
                                            type: 'error',
                                            showClose: true
                                        });
                                        break;
                                    case 100009:
                                        this.$message({
                                            message: '输入的验证码有误',
                                            type: 'error',
                                            showClose: true
                                        });
                                }
                            }).catch(err => {
                                this.$message.error(err);
                            });
                        } else {
                            console.log('error submit!!');
                            return false;
                        }
                    });
            }
        }
    };
</script>
<style lang="scss">
    .login-wrapper {
        background: #fff;
        width: 100vw;
        height: 100vh;

    .login-content {
        width: 300px;
        padding: 20px;
        height: 270px;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: #fff;
        margin: auto;
        box-shadow: 0 0 8px -2px rgba(0, 0, 0, .2);
    }

    .CMStitle {
        font-size: 1.5rem;
    }

    .big {
        display: block;
        width: 100%;
    }

    .get-code {
        border-radius: 0 4px 4px 0;
    }

    .bg-purple .el-input__inner {
        border-radius: 4px 0 0 4px;
    }

    }

</style>
