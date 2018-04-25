import fetch from '@/common/js/fetch';
// 用户数据-总数接口
export function userTotal () {
 return fetch({
     method: 'get',
     url: 'statistic/users/total'
 });
}
// 用户数据-按时间查询接口
export function userTime(time_begin, time_end, type) {
    const params = {
        time_begin,
        time_end,
        type
    };
    return fetch({
        method: 'get',
        url: 'statistic/users/time',
        params
    });
}
// 行为数据-总数接口
export function actionsTotal() {
    return fetch({
        method: 'get',
        url: 'statistic/actions/total'
    });
}
// 行为数据--按时间查询接口
export function actionTime(time_begin, time_end, type) {
    const params = {
        time_begin,
        time_end,
        type
    };
    return fetch({
        method: 'get',
        url: 'statistic/actions/time',
        params
    });
}
// 交易统计--按时间查询接口
export function tradeTime(time_begin, time_end, type) {
    const params = {
        time_begin,
        time_end,
        type
    };
    return fetch({
        method: 'get',
        url: 'statistic/trades/time',
        params
    });
}
