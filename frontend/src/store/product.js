import axios from "axios";

axios.defaults.baseURL = 'http://localhost:8080/'

export default{
    namespaced: true,
    state: {
        products: [],
        product: {},
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
        getProduct: ({ product }) => product,
        getProducts: ({ products }) => products,
        getLoading: ({ loading }) => loading,
        getSearchKeyword: ({ searchKeyword }) => searchKeyword,
        getSortBy: ({ sortBy }) => sortBy,
        getPagination: ({ pagination }) => pagination,
        getAlert: ({ alert }) => alert,
        getErrorMessage: ({ errorMessage }) => errorMessage
    },

    mutations: {
        setProducts(state, payload){
            state.products = payload
        },

        updateProducts(state, payload){
            state.products.push(payload)
        },

        updateProductFromProducts(state, payload){
            const products = state.products
            const productIndex = products.findIndex(c => c.id === payload.id)
            products[productIndex] = {
                ...products[productIndex],
                ...payload
            }
            state.products = products
        },

        deleteProductFromProducts(state, payload){
            const products = state.products
            const productIndex = products.findIndex(c => c.id === payload.id)
            products.splice(productIndex, 1)
            state.products = products
        },


        deleteSelectedProductFromProducts(state, payload){
            let products = state.products
            products = products.filter(( el ) => !payload.includes( el ))
            state.products = products
        },

        setProduct(state, payload){
            state.product = payload
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

        async getProduct({ commit }, productId)  {
            commit('setLoadingTrue')
            const theError = 'Error occurred during fetching product!'
            const response = await axios.get(
                `special/products/show?pid=${productId}`)
                .catch(() => {
                    commit('setErrorMessage', theError)
                    commit('setLoadingFalse')
                })
            commit('setProduct', response.data)
            commit('setLoadingFalse')
        },



        async getProducts({ commit }, payload)  {
            commit('setLoadingTrue')
            const theError = 'Error occurred during loading products!'
            const response = await axios.get(
                `special/products?keyword=${payload.keyword}&page=${payload.page}&size=${payload.size}&sortBy=${payload.sortBy}`)
                .catch(() => {
                    commit('setErrorMessage', theError)
                    commit('setLoadingFalse')
                })
            commit('setProducts', response.data.content)
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

        async getAllProductsByKeyword({ commit }, keyword)  {
            commit('setLoadingTrue')
            const theError = 'Error occurred during loading products!'
            const response = await axios.get(
                `special/products/search?keyword=${keyword}`)
                .catch(() => {
                    commit('setErrorMessage', theError)
                    commit('setLoadingFalse')
                })
            commit('setProducts', response.data)
            commit('setLoadingFalse')
        },

        async storeProduct({ commit, dispatch, getters }, product)  {
            commit('setLoadingTrue')
            const theError = 'Some Errors occurred during creating new product!'
            const response = await axios.post('special/products/store', product)
                .catch(() => {
                    commit('setErrorMessage', theError)
                    commit('setLoadingFalse')
                })
            // don't need for this next line because it'll be executed in getProducts when route view
            // commit('updateProducts', response.data)
            commit('showAlert', 'Product='+response.data.productName+' created successfully!')
            setTimeout(()=> commit('hideAlert'), 3000);
            commit('setLoadingFalse')
        },

        async updateProduct({ commit, dispatch, getters }, product)  {
            commit('setLoadingTrue')
            const theError = 'Some Errors occurred during updating product='+product.productName
            const response = await axios.put('special/products/update', product)
                .catch(() => {
                    commit('setErrorMessage', theError)
                    commit('setLoadingFalse')
                })

            dispatch('getProducts', {
                keyword: getters.getSearchKeyword,
                page: getters.getPagination.number,
                size: getters.getPagination.size,
                sortBy: getters.getSortBy
            })
            commit('updateProductFromProducts', response.data)
            commit('showAlert', 'Product updated successfully!')
            setTimeout(()=> commit('hideAlert'), 3000);
            commit('setLoadingFalse')
        },

        async deleteProduct({ commit, dispatch, getters }, product)  {
            commit('setLoadingTrue')
            const theError = 'Some Errors occurred during deleting product='+product.productName
            const response = await axios.delete('special/products/destroy', { data: { id: product.id } })
                .catch(() => {
                    commit('setErrorMessage', theError)
                    commit('setLoadingFalse')
                })

            dispatch('getProducts', {
                keyword: getters.getSearchKeyword,
                page: getters.getPagination.number,
                size: getters.getPagination.size,
                sortBy: getters.getSortBy
            })
            commit('showAlert', 'Product deleted successfully!')
            setTimeout(()=> commit('hideAlert'), 3000);
            commit('setLoadingFalse')
        },

        async deleteSelectedProducts({ commit, dispatch, getters }, selectedProducts)  {
            commit('setLoadingTrue')
            const theError = 'Some Errors occurred during deleting selected products'
            const response = await axios.delete('special/products/destroyAll', { data:  selectedProducts  })
                .catch(() => {
                    commit('setErrorMessage', theError)
                    commit('setLoadingFalse')
                })

            dispatch('getProducts', {
                keyword: getters.getSearchKeyword,
                page: getters.getPagination.number,
                size: getters.getPagination.size,
                sortBy: getters.getSortBy
            })
            commit('showAlert', 'Selected products deleted successfully!')
            setTimeout(()=> commit('hideAlert'), 3000);
            commit('setLoadingFalse')
        },

        async searchProduct({ commit }, payload){
            commit('setLoadingTrue')
            commit('setSearchKeyword', payload.keyword)
            const theError = 'Error occurred during loading products!'
            const response = await axios.get(`special/products?keyword=${payload.keyword}&page=${payload.page}&size=${payload.size}&sortBy=${payload.sortBy}`)
                .catch(() => {
                    commit('setErrorMessage', theError)
                    commit('setLoadingFalse')
                })
            commit('setProducts', response.data.content)
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
