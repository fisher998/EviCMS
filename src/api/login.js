import fetch from '@/common/js/fetch';
// 登录处理
export function adminLogin(username, password, code) {
    const params = {
        username,
        password,
        code
    };
    return fetch({
       method: 'post',
       url: 'admin/login',
        params
    });
}
// 退出登录
export function logOut() {
    return fetch({
        method: 'get',
        url: '/admin/logout'
    });
}
// 待处理事件统计
export function task() {
    return fetch({
        method: 'get',
        url: 'statistic/task'
    });
}
