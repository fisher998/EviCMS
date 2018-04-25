import fetch from '@/common/js/fetch';

// 角色列表
export function getRoleList() {
    return fetch({
        method: 'get',
        url: 'admin/roles/list'
    });
}

// 角色添加
export function addRole(name, description) {
    const params = {
        name,
        description
    };
    return fetch({
        method: 'post',
        url: 'admin/roles/add',
        params
    });
}

// 角色详情
export function detailRoles(id) {
    const params = {
        id
    };
    return fetch({
        method: 'get',
        url: 'admin/roles/detail',
        params
    });
}

// 角色编辑
export function updateRoles(id, name, description) {
    const params = {
        id,
        name,
        description
    };
    return fetch({
        method: 'post',
        url: 'admin/roles/update',
        params
    });
}

// 获取角色列表
export function getRole() {
    return fetch({
        method: 'get',
        url: 'admin/roles/list'
    });
}

// 删除角色
export function deleteRole(id) {
    return fetch({
        method: 'get',
        url: 'admin/roles/delete',
        params: {id}
    });
}

//   添加管理员
export function addAdmin(username, name, password, phone, role_id) {
    const params = {
        username,
        name,
        password,
        phone,
        role_id
    };
    return fetch({
        method: 'post',
        url: 'admin/add',
        params
    });
}

// 获取管理员权限
export function getAdminLimit(admin_id) {
    return fetch({
        method: 'get',
        url: 'res.data.data',
        admin_id
    });
}

// 获取管理员列表
export function getAdminList(username, time_begin, time_end, perPage, page) {
    const params = {
        username,
        time_begin,
        time_end,
        perPage,
        page
    };
    return fetch({
        method: 'get',
        url: 'admin/list',
        params
    });
}

//  获取管理员日志
export function getAdminLog(username, log_type, time_begin, time_end, perPage, page) {
    const params = {
        username,
        log_type,
        time_begin,
        time_end,
        perPage,
        page
    };
    return fetch({
        method: 'get',
        url: 'admin/logs/list',
        params
    });
}

// 获取所有的权限列表
// export function getPrivilegeList() {
//     return fetch({
//         method: 'get',
//         url: 'admin/all_permissions'
//     });
// }

// 发送短信 验证码
export function getCode(username) {
    const params = {
        username
    };
    return fetch({
        method: 'get',
        url: 'admin/code',
        params
    });
}

// 编辑管理员
export function editAdmin(admin_id, username, name, password, phone, role_id) {
    const params = {
        admin_id,
        username,
        name,
        password,
        phone,
        role_id
    };
    return fetch({
        method: 'post',
        url: 'admin/update',
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
// 冻结管理员
export function frezeAdmin(admin_id, status) {
    const params = {
        admin_id,
        status
    };
    return fetch({
        method: 'post',
        url: 'admin/freeze',
        params
    });
}
export function adminDetail(admin_id) {
    const params = {
        admin_id
    };
    return fetch({
        method: 'get',
        url: 'admin/detail',
        params
    });
}
// 权限列表
export function permissionList(type) {
    const params = {
        type
    };
    return fetch({
        method: 'get',
        url: 'admin/permission/list',
        params
    });
}

// 查看角色下的所有权限
export function ownpermission(role_id) {
    const params = {
        role_id
    };
    return fetch({
        method: 'get',
        url: 'admin/roles/ownpermission',
        params
    });
}

// 分配权限
export function rolesAssignment(role_id, permissions) {
    const params = {
        role_id,
        permissions
    };
    return fetch({
        method: 'post',
        url: 'admin/roles/assignment',
        params
    });
}
