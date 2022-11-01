import axios from "axios";

axios.defaults.baseURL = 'http://localhost:8080/'

export default{
    state: {
        categories: [],
        category: {},
        loading: false,
        searchKeyword: '',
        page: 0,
        size: 10,
        alert: '',
        sortBy: 'ID_DESC',
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
        getCategories: ({ categories }) => categories,
        getLoading: ({ loading }) => loading,
        getSearchKeyword: ({ searchKeyword }) => searchKeyword,
        getSortBy: ({ sortBy }) => sortBy,
        getPagination: ({ pagination }) => pagination,
        getAlert: ({ alert }) => alert,
        getErrorMessage: ({ errorMessage }) => errorMessage
    },

    mutations: {
        setCategories(state, payload){
            state.categories = payload
        },

        updateCategories(state, payload){
            state.categories.push(payload)
        },

        updateCategoryFromCategories(state, payload){
            const categories = state.categories
            const categoryIndex = categories.findIndex(c => c.id === payload.id)
            categories[categoryIndex] = {
                ...categories[categoryIndex],
                ...payload
            }
            state.categories = categories
        },

        deleteCategoryFromCategories(state, payload){
            const categories = state.categories
            const categoryIndex = categories.findIndex(c => c.id === payload.id)
            categories.splice(categoryIndex, 1)
            state.categories = categories
        },


        deleteSelectedCategoryFromCategories(state, payload){
            let categories = state.categories
            categories = categories.filter(( el ) => !payload.includes( el ))
            state.categories = categories
        },

        setCategory(state, payload){
            state.category = payload
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

        async getCategories({ commit }, payload)  {
            commit('setLoadingTrue')
            const theError = 'Error occurred during loading categories!'
            const response = await axios.get(
                `special/categories?keyword=${payload.keyword}&page=${payload.page}&size=${payload.size}&sortBy=${payload.sortBy}`)
                .catch(() => {
                    commit('setErrorMessage', theError)
                    commit('setLoadingFalse')
                })
            commit('setCategories', response.data.content)
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

        async getAllCategories({ commit }){
            commit('setLoadingTrue')
            const theError = 'Error occurred during loading categories!'
            const response = await axios.get(
                `special/categories/all`)
                .catch(() => {
                    commit('setErrorMessage', theError)
                    commit('setLoadingFalse')
                })
            commit('setCategories', response.data)
            commit('setLoadingFalse')
        },

        async storeCategory({ commit, dispatch, getters }, category)  {
            commit('setLoadingTrue')
            const theError = 'Some Errors occurred during creating new category!'
            const response = await axios.post('special/categories/store', category)
                .catch(() => {
                    commit('setErrorMessage', theError)
                    commit('setLoadingFalse')
                })
            commit('updateCategories', response.data)
            dispatch('getCategories', {
                keyword: getters.getSearchKeyword,
                page: getters.getPagination.number,
                size: getters.getPagination.size,
                sortBy: getters.getSortBy
            })
            commit('showAlert', 'Category='+response.data.categoryName+' created successfully!')
            setTimeout(()=> commit('hideAlert'), 3000);
            commit('setLoadingFalse')
        },

        async updateCategory({ commit, dispatch, getters }, category)  {
            commit('setLoadingTrue')
            const theError = 'Some Errors occurred during updating category='+category.categoryName
            const response = await axios.put('special/categories/update', category)
                .catch(() => {
                    commit('setErrorMessage', theError)
                    commit('setLoadingFalse')
                })

            dispatch('getCategories', {
                keyword: getters.getSearchKeyword,
                page: getters.getPagination.number,
                size: getters.getPagination.size,
                sortBy: getters.getSortBy
            })
            commit('updateCategoryFromCategories', response.data)
            commit('showAlert', 'Category updated successfully!')
            setTimeout(()=> commit('hideAlert'), 3000);
            commit('setLoadingFalse')
        },

        async deleteCategory({ commit, dispatch, getters }, category)  {
            commit('setLoadingTrue')
            const theError = 'Some Errors occurred during deleting category='+category.categoryName
            const response = await axios.delete('special/categories/destroy', { data: { id: category.id } })
                .catch(() => {
                    commit('setErrorMessage', theError)
                    commit('setLoadingFalse')
                })
            dispatch('getCategories', {
                keyword: getters.getSearchKeyword,
                page: getters.getPagination.number,
                size: getters.getPagination.size,
                sortBy: getters.getSortBy
            })
            commit('showAlert', 'Category deleted successfully!')
            setTimeout(()=> commit('hideAlert'), 3000);
            commit('setLoadingFalse')
        },

        async deleteSelectedCategory({ commit, dispatch, getters }, selectedCategories)  {
            commit('setLoadingTrue')
            const theError = 'Some Errors occurred during deleting selected categories'
            const response = await axios.delete('special/categories/destroyAll', { data:  selectedCategories  })
                .catch(() => {
                    commit('setErrorMessage', theError)
                    commit('setLoadingFalse')
                })

            dispatch('getCategories', {
                keyword: getters.getSearchKeyword,
                page: getters.getPagination.number,
                size: getters.getPagination.size,
                sortBy: getters.getSortBy
            })
            commit('showAlert', 'Selected categories deleted successfully!')
            setTimeout(()=> commit('hideAlert'), 3000);
            commit('setLoadingFalse')
        },

        async searchCategory({ commit }, payload){
            commit('setLoadingTrue')
            commit('setSearchKeyword', payload.keyword)
            const theError = 'Error occurred during loading categories!'
            const response = await axios.get(`special/categories?keyword=${payload.keyword}&page=${payload.page}&size=${payload.size}&sortBy=${payload.sortBy}`)
                .catch(() => {
                    commit('setErrorMessage', theError)
                    commit('setLoadingFalse')
                })
            commit('setCategories', response.data.content)
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
