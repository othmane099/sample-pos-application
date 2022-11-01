import axios from "axios";

axios.defaults.baseURL = 'http://localhost:8080/'

export default{
    namespaced: true,
    state: {
        roles: [],
        role: {},
        loading: false,
        searchKeyword: '',
        page: 0,
        size: 10,
        sortBy: 'ID_DESC',
        alert: '',
        errorMessage: '',
        pagination: {
            last: false,
            totalElements: 0,
            totalPages: 0,
            size: 0,
            number: 0,
            first: false,
            numberOfElements: 0
        }
    },

    getters: {
        getRole: ({ role }) => role,
        getRoles: ({ roles }) => roles,
        getLoading: ({ loading }) => loading,
        getSearchKeyword: ({ searchKeyword }) => searchKeyword,
        getSortBy: ({ sortBy }) => sortBy,
        getPagination: ({ pagination }) => pagination,
        getAlert: ({ alert }) => alert,
        getErrorMessage: ({ errorMessage }) => errorMessage
    },

    mutations: {
        setRoles(state, payload){
            state.roles = payload
        },

        updateRoles(state, payload){
            state.roles.push(payload)
        },

        updateRoleFromRoles(state, payload){
            const roles = state.roles
            const roleIndex = roles.findIndex(c => c.id === payload.id)
            roles[roleIndex] = {
                ...roles[roleIndex],
                ...payload
            }
            state.roles = roles
        },

        deleteRoleFromRoles(state, payload){
            const roles = state.roles
            const roleIndex = roles.findIndex(c => c.id === payload.id)
            roles.splice(roleIndex, 1)
            state.roles = roles
        },


        deleteSelectedRoleFromRoles(state, payload){
            let roles = state.roles
            roles = roles.filter(( el ) => !payload.includes( el ))
            state.roles = roles
        },

        setRole(state, payload){
            state.role = payload
        },

        setPagination(state, payload){
            state.pagination = payload
        },

        setLoadingTrue(state){
            state.loading = true
        },

        setLoadingFalse(state){
            state.loading = false
        },

        setSearchKeyword(state, payload) {
            state.searchKeyword = payload;
        },

        setPage(state, payload) {
            state.page = payload;
        },

        setSize(state, payload) {
            state.size = payload;
        },

        setSortBy(state, payload){
            state.sortBy = payload
        },

        showAlert(state, payload) {
            state.alert = payload;
        },

        hideAlert(state) {
            state.alert = '';
        },

        setErrorMessage(state, payload) {
            state.errorMessage = payload;
        },
    },

    actions: {

        async getAllRoles({ commit })  {
            commit('setLoadingTrue')
            const theError = 'Error occurred during loading roles!'
            const response = await axios.get(
                `admin/roles/all`)
                .catch(() => {
                    commit('setErrorMessage', theError)
                    commit('setLoadingFalse')
                })
            commit('setRoles', response.data)
            commit('setLoadingFalse')
        },

        async getRole({ commit }, roleId)  {
            commit('setLoadingTrue')
            const theError = 'Error occurred during fetching role!'
            const response = await axios.get(
                `admin/roles/show?pid=${roleId}`)
                .catch(() => {
                    commit('setErrorMessage', theError)
                    commit('setLoadingFalse')
                })
            commit('setRole', response.data)
            commit('setLoadingFalse')
        },



        async getRoles({ commit }, payload)  {
            commit('setLoadingTrue')
            const theError = 'Error occurred during loading roles!'
            const response = await axios.get(
                `admin/roles?keyword=${payload.keyword}&page=${payload.page}&size=${payload.size}&sortBy=${payload.sortBy}`)
                .catch(() => {
                    commit('setErrorMessage', theError)
                    commit('setLoadingFalse')
                })
            commit('setRoles', response.data.content)
            commit('setPage', response.data.number)
            commit('setSize', response.data.content)
            commit('setPagination', {
                last: response.data.last,
                totalElements: response.data.totalElements,
                totalPages: response.data.totalPages,
                size: response.data.size,
                number: response.data.number,
                first: response.data.first,
                numberOfElements: response.data.numberOfElements,
            })
            commit('setLoadingFalse')
        },

        async storeRole({ commit, dispatch, getters }, role)  {
            commit('setLoadingTrue')
            const theError = 'Some Errors occurred during creating new role!'
            const response = await axios.post('admin/roles/store', role)
                .catch(() => {
                    commit('setErrorMessage', theError)
                    commit('setLoadingFalse')
                })
            // don't need for this next line because it'll be executed in getRoles when route view
            // commit('updateRoles', response.data)
            commit('showAlert', 'Role='+response.data.rolename+' created successfully!')
            setTimeout(()=> commit('hideAlert'), 3000);
            commit('setLoadingFalse')
        },

        async updateRole({ commit, dispatch, getters }, role)  {
            commit('setLoadingTrue')
            const theError = 'Some Errors occurred during updating role='+role.roleName
            const response = await axios.put('admin/roles/update', role)
                .catch(() => {
                    commit('setErrorMessage', theError)
                    commit('setLoadingFalse')
                })

            dispatch('getRoles', {
                keyword: getters.getSearchKeyword,
                page: getters.getPagination.number,
                size: getters.getPagination.size,
                sortBy: getters.getSortBy
            })
            commit('updateRoleFromRoles', response.data)
            commit('showAlert', 'Role updated successfully!')
            setTimeout(()=> commit('hideAlert'), 3000);
            commit('setLoadingFalse')
        },

        async searchRole({ commit }, payload){
            commit('setLoadingTrue')
            commit('setSearchKeyword', payload.keyword)
            const theError = 'Error occurred during loading roles!'
            const response = await axios.get(`admin/roles?keyword=${payload.keyword}&page=${payload.page}&size=${payload.size}&sortBy=${payload.sortBy}`)
                .catch(() => {
                    commit('setErrorMessage', theError)
                    commit('setLoadingFalse')
                })
            commit('setRoles', response.data.content)
            commit('setPagination', {
                last: response.data.last,
                totalElements: response.data.totalElements,
                totalPages: response.data.totalPages,
                size: response.data.size,
                number: response.data.number,
                first: response.data.first,
                numberOfElements: response.data.numberOfElements,
            })
            commit('setLoadingFalse')
        }
    }
}
