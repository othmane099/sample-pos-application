import axios from "axios";

axios.defaults.baseURL = 'http://localhost:8080/'

export default{
    namespaced: true,
    state: {
        customers: [],
        customer: {},
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
        getCustomer: ({ customer }) => customer,
        getCustomers: ({ customers }) => customers,
        getLoading: ({ loading }) => loading,
        getSearchKeyword: ({ searchKeyword }) => searchKeyword,
        getSortBy: ({ sortBy }) => sortBy,
        getPagination: ({ pagination }) => pagination,
        getAlert: ({ alert }) => alert,
        getErrorMessage: ({ errorMessage }) => errorMessage
    },

    mutations: {
        setCustomers(state, payload){
            state.customers = payload
        },

        updateCustomers(state, payload){
            state.customers.push(payload)
        },

        updateCustomerFromCustomers(state, payload){
            const customers = state.customers
            const customerIndex = customers.findIndex(c => c.id === payload.id)
            customers[customerIndex] = {
                ...customers[customerIndex],
                ...payload
            }
            state.customers = customers
        },

        deleteCustomerFromCustomers(state, payload){
            const customers = state.customers
            const customerIndex = customers.findIndex(c => c.id === payload.id)
            customers.splice(customerIndex, 1)
            state.customers = customers
        },


        deleteSelectedCustomerFromCustomers(state, payload){
            let customers = state.customers
            customers = customers.filter(( el ) => !payload.includes( el ))
            state.customers = customers
        },

        setCustomer(state, payload){
            state.customer = payload
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

        async getAllCustomers({ commit })  {
            commit('setLoadingTrue')
            const theError = 'Error occurred during fetching customer!'
            const response = await axios.get(
                `seller/customers/all`)
                .catch(() => {
                    commit('setErrorMessage', theError)
                    commit('setLoadingFalse')
                })
            commit('setCustomers', response.data)
            commit('setLoadingFalse')
        },

        async getCustomer({ commit }, customerId)  {
            commit('setLoadingTrue')
            const theError = 'Error occurred during fetching customer!'
            const response = await axios.get(
                `seller/customers/show?pid=${customerId}`)
                .catch(() => {
                    commit('setErrorMessage', theError)
                    commit('setLoadingFalse')
                })
            commit('setCustomer', response.data)
            commit('setLoadingFalse')
        },



        async getCustomers({ commit }, payload)  {
            commit('setLoadingTrue')
            const theError = 'Error occurred during loading customers!'
            const response = await axios.get(
                `seller/customers?keyword=${payload.keyword}&page=${payload.page}&size=${payload.size}&sortBy=${payload.sortBy}`)
                .catch(() => {
                    commit('setErrorMessage', theError)
                    commit('setLoadingFalse')
                })
            commit('setCustomers', response.data.content)
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

        async storeCustomer({ commit, dispatch, getters }, customer)  {
            commit('setLoadingTrue')
            customer.status = false
            const theError = 'Some Errors occurred during creating new customer!'
            const response = await axios.post('seller/customers/store', customer)
                .catch(() => {
                    commit('setErrorMessage', theError)
                    commit('setLoadingFalse')
                })
            // don't need for this next line because it'll be executed in getCustomers when route view
            // commit('updateCustomers', response.data)
            dispatch('getCustomers', {
                keyword: getters.getSearchKeyword,
                page: getters.getPagination.number,
                size: getters.getPagination.size,
                sortBy: getters.getSortBy
            })
            commit('showAlert', 'Customer='+response.data.fullName+' created successfully!')
            setTimeout(()=> commit('hideAlert'), 3000);
            commit('setLoadingFalse')
        },

        async updateCustomer({ commit, dispatch, getters }, customer)  {
            commit('setLoadingTrue')
            const theError = 'Some Errors occurred during updating customer='+customer.fullName
            const response = await axios.put('seller/customers/update', customer)
                .catch(() => {
                    commit('setErrorMessage', theError)
                    commit('setLoadingFalse')
                })

            dispatch('getCustomers', {
                keyword: getters.getSearchKeyword,
                page: getters.getPagination.number,
                size: getters.getPagination.size,
                sortBy: getters.getSortBy
            })
            // commit('updateCustomerFromCustomers', response.data)
            commit('showAlert', 'Customer updated successfully!')
            setTimeout(()=> commit('hideAlert'), 3000);
            commit('setLoadingFalse')
        },

        async searchCustomer({ commit }, payload){
            commit('setLoadingTrue')
            commit('setSearchKeyword', payload.keyword)
            const theError = 'Error occurred during loading customers!'
            const response = await axios.get(`seller/customers?keyword=${payload.keyword}&page=${payload.page}&size=${payload.size}&sortBy=${payload.sortBy}`)
                .catch(() => {
                    commit('setErrorMessage', theError)
                    commit('setLoadingFalse')
                })
            commit('setCustomers', response.data.content)
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
