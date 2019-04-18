// 组件库操作
import * as types from '../types'
import $http from '@/plugins/axios.js'

export default {
    namespaced: true,
    state: {
        comData: []
    },
    getters: {},
    mutations: {
        [types.SET_GROUPS](state, data) {
            state.comData = data;
        }
    },
    actions: {
        getGroups({ commit }) {
            $http.getData("getGroups").then(data => {
                commit(types.SET_GROUPS, data);
            });
        }
    }
}