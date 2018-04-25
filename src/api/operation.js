import fetch from '@/common/js/fetch';

// 投诉建议列表
export function feedbackList(status, perPage, page) {
    const params = {
        status,
        perPage,
        page
    };
    return fetch({
        method: 'get',
        url: 'operation/feedback/list',
        params
    });
}

// 投诉建议详情
export function feedbackdetail(report_id) {
    const params = {
        report_id
    };
    return fetch({
        method: 'get',
        url: 'operation/feedback/detail',
        params
    });
}

// 投诉建议回复
export function feedbackreplay(report_id, content) {
    const params = {
        report_id,
        content
    };
    return fetch({
        method: 'post',
        url: 'operation/feedback/reply',
        params
    });
}

// 退款列表
export function getRefundList(username, cert_no, time_begin, time_end, status, perPage, page) {
    const params = {
        username,
        cert_no,
        time_begin,
        time_end,
        status,
        perPage,
        page
    };
    return fetch({
        method: 'get',
        url: 'operation/refund/list',
        params
    });
}

// 退款处理
export function refundHandle(request_id, reason, is_agree) {
    const params = {
        request_id,
        reason,
        is_agree
    };
    return fetch({
        method: 'post',
        url: 'operation/refund/handle',
        params
    });
}

// 获取出证详情
export function getCertifyDetail(apply_id) {
    const params = {
        apply_id
    };
    return fetch({
        method: 'get',
        url: 'operation/certify/detail',
        params
    });
}

// 出证列表
export function certifyList(phone, cert_num, time_begin, time_end, status, perPage, page) {
    const params = {
        phone,
        cert_num,
        time_begin,
        time_end,
        status,
        perPage,
        page
    };
    return fetch({
        method: 'get',
        url: 'operation/certify/list',
        params
    });
}
// 出证编辑
export function certifyUpdate(apply_id, op_code, phone, rec_addr, exp_time, code_id, user_name, exp_order_no) {
    const params = {
        apply_id,
        op_code,
        phone,
        rec_addr,
        exp_time,
        code_id,
        user_name,
        exp_order_no
    };
    return fetch({
        method: 'post',
        url: 'operation/certify/update',
        params
    });
}
// 出庭列表
export function trailManage(time_begin, time_end, status, perPage, page) {
    const params = {
        time_begin,
        time_end,
        status,
        perPage,
        page
    };
    return fetch({
        method: 'get',
        url: 'operation/court/list',
        params
    });
}
// 出庭详情
export function courtDetail(apply_id) {
    const params = {
        apply_id
    };
    return fetch({
        method: 'get',
        url: 'operation/court/detail',
        params
    });
}

// 出庭编辑
export function courtUpdate(court_id, op_code, username, trade_time, address, trade_money, court_user, trade_type, transport, remark, lodging) {
const params = {
    court_id,
    op_code,
    username,
    trade_time,
    address,
    trade_money,
    court_user,
    trade_type,
    transport,
    remark,
    lodging
};
return fetch({
    method: 'post',
    url: 'operation/court/update',
    params
});
}
// 出庭沟通
export function courtCommunicate(court_id, content) {
const params = {
    court_id,
    content
};
return fetch({
    method: 'post',
    url: 'operation/court/communicate',
    params
});
}
// 获得快递公司列表
export function certifyExpresslist() {
    return fetch({
        method: 'get',
        url: 'operation/certify/expresslist'
    });
}
