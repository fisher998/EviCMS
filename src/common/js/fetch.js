import axios from 'axios';
import store from '../../store';
import {getToken, removeToken} from './auth';
// 创建axios实例
const service = axios.create({
        baseURL: 'http://118.190.143.6/',  //  admin的base_url
        timeout: 5000                  //  请求超时
    }
);
service.interceptors.request.use(config => {
    // 发送请求之前检测Token
    if (store.getters.token) {
        config.headers['auth-token'] = getToken(); // 为每个请求添加token
    }
    return config;
}, error => {
    // Do something with request error
   // console.log(error); // for debug
    Promise.reject(error);
});
service.interceptors.response.use(
    response => {
       // console.log(response);
        if (response.data.error === 100002) {
            removeToken(); // 移除cookie中的token
            localStorage.clear();
            location.reload();
        }
        // console.log(response);
        return response;
    },
    error => {
       // console.log('err' + error); // for debug
        return Promise.reject(error);
    });
export default service;
