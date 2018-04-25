import axios from 'axios';
// 管理员登入WEB
export function admin_web(admin_id, dest_user) {
    return axios.get('https://api.51zbb.net/admin/v1/user/login/token?' + 'admin_id=' + admin_id + '&dest_user=' + dest_user);
  // return axios({
  //     method: 'get',
  //     url: 'https://api.51zbb.net/admin/v1/user/login/token',
  //     data: {
  //         admin_id,
  //         dest_user
  //     }
  // });
}
