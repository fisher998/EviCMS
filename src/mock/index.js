import Mock from 'mockjs';
import side from './sidebar.js';
const baseUrl = 'http://118.190.143.6/';
// 获取侧边栏数据
Mock.mock(baseUrl + 'file/list', 'get', side);
