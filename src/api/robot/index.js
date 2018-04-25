import fetch from '@/common/js/fetch';
// 获取vnc列表
export function vncList(status, perPage, page) {
    return fetch({
        method: 'get',
        url: `/evidencerobot/vnc/list?status=${status}&perPage=${perPage}&page=${page}`
    });
}
// 搜索vnc
export function searchvncList(ip) {
    return fetch({
        method: 'get',
        url: `/evidencerobot/vnc/list?ip=${ip}`
    });
}
// 添加vnc
export function addVnc(params) {
    let addvnc = params;
    return fetch({
        method: 'post',
        // url: '/evidencerobot/vnc/add',
        // addvnc
        url: `/evidencerobot/vnc/add?ip=${addvnc.ip}&port=${addvnc.port}&is_allocation=${addvnc.is_allocation}`
    });
}
// 更新vnc
export function updateVnc(params) {
    let updatavnc = params;
    return fetch({
        method: 'post',
        url: `/evidencerobot/vnc/update?id=${updatavnc.id}&ip=${updatavnc.ip}&port=${updatavnc.port}&is_allocation=${updatavnc.is_allocation}`
    });
}
// 重启vnc
export function restartVnc(id) {
    return fetch({
        method: 'get',
        url: `/evidencerobot/vnc/reboot?id=${id}`
    });
}
// 重置录制vnc
export function resetVnc(id) {
    return fetch({
        method: 'get',
        url: `/evidencerobot/vnc/reset?id=${id}`
    });
}
// 获取vnc详情
export function vncDetail(id) {
    return fetch({
        method: 'get',
        url: `/evidencerobot/vnc/detail?id=${id}`
    });
}
// 分配列表
export function allocationList(id, status, perPage, page) {
    return fetch({
        method: 'get',
        url: `/evidencerobot/allocation/list?id=${id}&status=${status}&perPage=${perPage}&page=${page}`
    });
}
// 操作日志接口
export function oprecordList(id) {
    return fetch({
        method: 'get',
        url: `/evidencerobot/oprecord/list?id=${id}`
    });
}
// 取消录制接口
export function cancelVnc(id) {
    return fetch({
        method: 'get',
        url: `/evidencerobot/vnc/cancel?id=${id}`
    });
}
