// import {getFileList, getSearchFile} from '../../api/cert';
import {getCertifyDetail} from '../../api/operation';
const cert = {
    state: {
        details: '',
        statu: '1'
    },
    mutations: {
        DETAILS: (state, details) => {
            state.details = details;
        },
        STATU: (state, statu) => {
            state.statu = statu;
        }
    },
    actions: {
        // 获取公证详情
        getDetail: ({commit}, {detailId}) => {
            return new Promise(resolve => {
                getCertifyDetail(detailId).then(res => {
                    if (res.data.error === 0) {
                        commit('DETAILS', res.data.data);
                        commit('STATU', res.data.data.status);
                    } else {
                        this.$message({
                            type: 'error',
                            message: res.data.data
                        });
                    }
                    resolve(res);
                });
            });
        }
    }
};

export default cert;
