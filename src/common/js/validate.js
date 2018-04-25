// 验证手机号
export function isValidMobile(val) {
    return /^1(3|4|5|7|8)\d{9}$/.test(val);
}
