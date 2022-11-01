import axios from "axios";

axios.defaults.baseURL = 'http://localhost:8080/'

export default{
    namespaced: true,
    state: {
        sales: [],
        sale: {},
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
        getSale: ({ sale }) => sale,
        getSales: ({ sales }) => sales,
        getLoading: ({ loading }) => loading,
        getSearchKeyword: ({ searchKeyword }) => searchKeyword,
        getSortBy: ({ sortBy }) => sortBy,
        getPagination: ({ pagination }) => pagination,
        getAlert: ({ alert }) => alert,
        getErrorMessage: ({ errorMessage }) => errorMessage
    },

    mutations: {
        setSales(state, payload){
            state.sales = payload
        },

        updateSales(state, payload){
            state.sales.push(payload)
        },

        updateSaleFromSales(state, payload){
            const sales = state.sales
            const saleIndex = sales.findIndex(c => c.id === payload.id)
            sales[saleIndex] = {
                ...sales[saleIndex],
                ...payload
            }
            state.sales = sales
        },

        deleteSaleFromSales(state, payload){
            const sales = state.sales
            const saleIndex = sales.findIndex(c => c.id === payload.id)
            sales.splice(saleIndex, 1)
            state.sales = sales
        },


        deleteSelectedSaleFromSales(state, payload){
            let sales = state.sales
            sales = sales.filter(( el ) => !payload.includes( el ))
            state.sales = sales
        },

        setSale(state, payload){
            state.sale = payload
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

        async getSale({ commit }, saleId)  {
            commit('setLoadingTrue')
            const theError = 'Error occurred during fetching sale!'
            const response = await axios.get(
                `seller/sales/show?sid=${saleId}`)
                .catch(() => {
                    commit('setErrorMessage', theError)
                    commit('setLoadingFalse')
                })
            commit('setSale', response.data)
            commit('setLoadingFalse')
        },



        async getSales({ commit }, payload)  {
            commit('setLoadingTrue')
            const theError = 'Error occurred during loading sales!'
            const response = await axios.get(
                `seller/sales?keyword=${payload.keyword}&page=${payload.page}&size=${payload.size}&sortBy=${payload.sortBy}`)
                .catch(() => {
                    commit('setErrorMessage', theError)
                    commit('setLoadingFalse')
                })
            commit('setSales', response.data.content)
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

        async storeSale({ commit, dispatch, getters }, sale)  {
            commit('setLoadingTrue')
            sale.status = false
            const theError = 'Some Errors occurred during creating new sale!'
            const response = await axios.post('seller/sales/store', sale)
                .catch(() => {
                    commit('setErrorMessage', theError)
                    commit('setLoadingFalse')
                })
            // don't need for this next line because it'll be executed in getSales when route view
            // commit('updateSales', response.data)
            commit('showAlert', 'Sale='+response.data.saleCode+' created successfully!')
            setTimeout(()=> commit('hideAlert'), 3000);
            commit('setLoadingFalse')
        },

        async updateSale({ commit, dispatch, getters }, sale)  {
            commit('setLoadingTrue')
            const theError = 'Some Errors occurred during updating sale='+sale.salename
            const response = await axios.put('seller/sales/update', sale)
                .catch(() => {
                    commit('setErrorMessage', theError)
                    commit('setLoadingFalse')
                })

            dispatch('getSales', {
                keyword: getters.getSearchKeyword,
                page: getters.getPagination.number,
                size: getters.getPagination.size,
                sortBy: getters.getSortBy
            })
            commit('updateSaleFromSales', response.data)
            commit('showAlert', 'Sale updated successfully!')
            setTimeout(()=> commit('hideAlert'), 3000);
            commit('setLoadingFalse')
        },

        async searchSale({ commit }, payload){
            commit('setLoadingTrue')
            commit('setSearchKeyword', payload.keyword)
            const theError = 'Error occurred during loading sales!'
            const response = await axios.get(`seller/sales?keyword=${payload.keyword}&page=${payload.page}&size=${payload.size}&sortBy=${payload.sortBy}`)
                .catch(() => {
                    commit('setErrorMessage', theError)
                    commit('setLoadingFalse')
                })
            commit('setSales', response.data.content)
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
