import axios from "axios";

axios.defaults.baseURL = 'http://localhost:8080/'

export default{
    namespaced: true,
    state: {
        users: [],
        user: {},
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
        getUser: ({ user }) => user,
        getUsers: ({ users }) => users,
        getLoading: ({ loading }) => loading,
        getSearchKeyword: ({ searchKeyword }) => searchKeyword,
        getSortBy: ({ sortBy }) => sortBy,
        getPagination: ({ pagination }) => pagination,
        getAlert: ({ alert }) => alert,
        getErrorMessage: ({ errorMessage }) => errorMessage
    },

    mutations: {
        setUsers(state, payload){
            state.users = payload
        },

        updateUsers(state, payload){
            state.users.push(payload)
        },

        updateUserFromUsers(state, payload){
            const users = state.users
            const userIndex = users.findIndex(c => c.id === payload.id)
            users[userIndex] = {
                ...users[userIndex],
                ...payload
            }
            state.users = users
        },

        deleteUserFromUsers(state, payload){
            const users = state.users
            const userIndex = users.findIndex(c => c.id === payload.id)
            users.splice(userIndex, 1)
            state.users = users
        },


        deleteSelectedUserFromUsers(state, payload){
            let users = state.users
            users = users.filter(( el ) => !payload.includes( el ))
            state.users = users
        },

        setUser(state, payload){
            state.user = payload
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

        async getUser({ commit }, userId)  {
            commit('setLoadingTrue')
            const theError = 'Error occurred during fetching user!'
            const response = await axios.get(
                `admin/users/show?pid=${userId}`)
                .catch(() => {
                    commit('setErrorMessage', theError)
                    commit('setLoadingFalse')
                })
            commit('setUser', response.data)
            commit('setLoadingFalse')
        },



        async getUsers({ commit }, payload)  {
            commit('setLoadingTrue')
            const theError = 'Error occurred during loading users!'
            const response = await axios.get(
                `admin/users?keyword=${payload.keyword}&page=${payload.page}&size=${payload.size}&sortBy=${payload.sortBy}`)
                .catch(() => {
                    commit('setErrorMessage', theError)
                    commit('setLoadingFalse')
                })
            commit('setUsers', response.data.content)
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

        async storeUser({ commit, dispatch, getters }, user)  {
            commit('setLoadingTrue')
            user.status = false
            const theError = 'Some Errors occurred during creating new user!'
            const response = await axios.post('admin/users/store', user)
                .catch(() => {
                    commit('setErrorMessage', theError)
                    commit('setLoadingFalse')
                })
            // don't need for this next line because it'll be executed in getUsers when route view
            // commit('updateUsers', response.data)
            dispatch('getUsers', {
                keyword: getters.getSearchKeyword,
                page: getters.getPagination.number,
                size: getters.getPagination.size,
                sortBy: getters.getSortBy
            })
            commit('showAlert', 'User='+response.data.username+' created successfully!')
            setTimeout(()=> commit('hideAlert'), 3000);
            commit('setLoadingFalse')
        },

        async updateUser({ commit, dispatch, getters }, user)  {
            commit('setLoadingTrue')
            const theError = 'Some Errors occurred during updating user='+user.username
            const response = await axios.put('admin/users/update', user)
                .catch(() => {
                    commit('setErrorMessage', theError)
                    commit('setLoadingFalse')
                })

            dispatch('getUsers', {
                keyword: getters.getSearchKeyword,
                page: getters.getPagination.number,
                size: getters.getPagination.size,
                sortBy: getters.getSortBy
            })
            commit('updateUserFromUsers', response.data)
            commit('showAlert', 'User updated successfully!')
            setTimeout(()=> commit('hideAlert'), 3000);
            commit('setLoadingFalse')
        },

        async searchUser({ commit }, payload){
            commit('setLoadingTrue')
            commit('setSearchKeyword', payload.keyword)
            const theError = 'Error occurred during loading users!'
            const response = await axios.get(`admin/users?keyword=${payload.keyword}&page=${payload.page}&size=${payload.size}&sortBy=${payload.sortBy}`)
                .catch(() => {
                    commit('setErrorMessage', theError)
                    commit('setLoadingFalse')
                })
            commit('setUsers', response.data.content)
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


    }
}
