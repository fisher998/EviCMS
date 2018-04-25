import fetch from '../common/js/fetch.js';
// import CryptoJS from 'crypto-js';
//  用户列表
export function getUserList(phone, reg_time_begin, reg_time_end, perPage, page) {
    const params = {
       phone,
       reg_time_begin,
       reg_time_end,
        perPage,
        page
    };
    return fetch({
        method: 'get',
        url: 'user/list',
        params
    });
}
// 添加用户
export function addUser(phone, password, area_code, amount) {
    const params = {
        phone,
        password,
        area_code,
        amount
    };
    return fetch({
        method: 'post',
        url: 'user/add',
        params
    });
}
// 编辑用户
export function editUser(user_id, phone, password, area_code, amount, reason) {
    const params = {
        user_id,
        phone,
       password,
        area_code,
        amount,
        reason
    };
    return fetch({
       method: 'post',
       url: 'user/update',
       params
    });
}
// 用户详情
export function userDetail(user_id) {
    const params = {
        user_id
    };
    return fetch({
        method: 'get',
        url: 'user/detail',
        params
    });
}
// 恶意操作次数
export function exception(user_id) {
    const params = {
        user_id
    };
    return fetch({
        method: 'get',
        url: 'user/exception',
        params
    });
}
// 冻结用户
export function userFreeze(user_id, status) {
    const params = {
        user_id,
        status
    };
    return fetch({
        method: 'post',
        url: 'user/freeze',
        params
    });
}
// 公测用户列表
export function getBetaList(name, perPage, page) {
    const params = {
       name,
        perPage,
        page
    };
    return fetch({
        method: 'get',
        url: 'user/beta/list',
        params
    });
}
// 公测用户添加
export function addetaUser(user_name, recommend_user, phone, gift_amount, expire_time, area_code) {
  const params = {
      user_name,
      recommend_user,
      phone,
      gift_amount,
      expire_time,
      area_code
  };
  return fetch({
     method: 'post',
      url: 'user/beta/add',
      params
  });
}
// 公测用户详情
export function betaDetail(id) {
  const params = {
      id
  };
  return fetch({
      method: 'get',
      url: 'user/beta/detail',
      params
  });
}
// 公测用户编辑
export function betaUpdate(id, user_name, recommend_user, area_code, phone, gift_amount, expire_time) {
const params = {
    id,
    user_name,
    recommend_user,
    area_code,
    phone,
    gift_amount,
    expire_time
};
return fetch({
    method: 'post',
    url: 'user/beta/update',
    params
});
}
// 查看公测用户详情
export function betaUserDetail(user_id) {
    return fetch({
        method: 'get',
        url: 'beta/detail',
        user_id
    });
}
// 公测用户删除
export function betaDelete(id) {
    const params = {
        id
    };
    return fetch({
        method: 'get',
        url: 'user/beta/delete',
        params
    });
}
// 管理员登入WEB
export function admin_web(user_id) {
    const params = {
        user_id
    };
    return fetch({
        method: 'get',
        url: 'user/admin_web',
        params
    });
}
// 获取验证码
export function sendCode(username) {
const params = {
    username
};
return fetch({
   method: 'get',
   url: 'admin/code',
    params
});
}
