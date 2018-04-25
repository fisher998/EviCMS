import fetch from '@/common/js/fetch';

// 秘钥详情
export function getsecretDetail(type) {
    return fetch({
        method: 'get',
        url: 'system/secret/detail',
        params: {type}
    });
}
// 秘钥更新
export function updataSecret(param) {
    const params = {
        type: param.type,
        app_secret: param.app_secret,
        app_key: param.app_key
    };
    return fetch({
        method: 'post',
        url: 'system/secret/update',
        params
    });
}
