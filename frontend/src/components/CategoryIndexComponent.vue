<template>
    <div v-if="alert">
        <TheAlert :classes="'alert alert-success'" :alert="alert"/>
    </div>

    <h5 class="card-header">Categories</h5>
    <div class="d-flex">
        <TheSearch @search-category="searchCategory"
                    :searchKeyword="searchKeyword"
                    :eventType="'searchCategory'"/>
        <TheCreateBtn :eventType="'createCategoryBtn'"
                      @create-category-btn="handleCreateCategoryBtn"/>
    </div>

    <div class="card-body">
        <div v-if="isLoading">
            <TheLoading />
        </div>
        <div v-else>
            <div v-if="!errorMessage">
                <div v-if="selectedCategories.length" class="d-flex w-100">
                        <p class="me-2">{{ selectedCategories.length }} rows selected</p>
                        <button class="btn btn-danger" type="button" @click="handleDeleteSelectedCategoryBtn">Delete</button>
                </div>
                <TheTable
                    :is-all-selected="isAllSelected"
                    @selectAllElementsEvent="selectAllCategories"
                    @selectElementEvent="selectCategory"
                    @editElementEvent="handleEditCategoryBtn"
                    @deleteElementEvent="handleDeleteCategoryBtn"
                    :fields="fields"
                    :elements="categories"
                    :is-checked="isChecked"
                    @sortByFieldEvent="sortByField"
                />

                <div class="float-start">
                    <TheSizeRows @changeSizeEvent="changeSize"
                    :pageSize="pageSize"
                    />
                </div>
                <div class="d-flex justify-content-end">
                    <ThePagination
                        @paginate-event="paginate"
                        :total-and-number-of-elts="totalAndNumberOfElts"
                        :is-first-page="isFirstPage"
                        :is-last-page="isLastPage"
                        :page-number="pageNumber"
                        :pages="pages"
                    />
                </div>
            </div>
            <div v-else>
                <TheAlert :classes="'alert alert-danger'" :alert="errorMessage"/>
            </div>
        </div>
    </div>

    <!-- Create Category Modal -->
    <TheModal :id="'createCategoryModal'"
              :modalTitle="'Create'"
              :eventType="'createCategoryEvent'"
              @create-category-event="addCategory">
        <label for="categoryCodeField" class="form-label">Category Code *</label>
        <input id="categoryCodeField" type="text" class="form-control"
               placeholder="Enter category Code" v-model="category.categoryCode">
        <p v-if="!validateForm && !category.categoryCode" class="text-danger">
            This field is required
        </p>
        <br>
        <label for="categoryCodeField" class="form-label">Category Name *</label>
        <input id="categoryNameField" type="text" class="form-control"
               placeholder="Enter category Name" v-model="category.categoryName">
        <p v-if="!validateForm && !category.categoryName" class="text-danger">
            This field is required
        </p>
    </TheModal>

    <!-- Update Category Modal -->
    <TheModal :id="'updateCategoryModal'"
              :modalTitle="'Update'"
              :eventType="'updateCategoryEvent'"
              @update-category-event="updateCategory">
        <label for="categoryCodeField" class="form-label">Category Code *</label>
        <input id="categoryCodeField" type="text" class="form-control"
               placeholder="Enter category Code" v-model="category.categoryCode">
        <p v-if="!validateForm && !category.categoryCode" class="text-danger">
            This field is required
        </p>
        <br>
        <label for="categoryCodeField" class="form-label">Category Name *</label>
        <input id="categoryNameField" type="text" class="form-control"
               placeholder="Enter category Name" v-model="category.categoryName">
        <p v-if="!validateForm && !category.categoryName" class="text-danger">
            This field is required
        </p>
    </TheModal>

    <!-- Delete Category Modal -->
    <TheModal :id="'deleteCategoryModal'"
              :modalTitle="'Delete'"
              :eventType="'deleteCategoryEvent'"
              @delete-category-event="deleteCategory">
        <h3>Are you sure you want to delete </h3>
        <p>You won't be able to revert this!</p>
    </TheModal>

    <!-- Delete Selected Category Modal -->
    <TheModal :id="'deleteSelectedCategoryModal'"
              :modalTitle="'Delete Selected'"
              :eventType="'deleteSelectedCategoryEvent'"
              @delete-selected-category-event="deleteSelectedCategory">
        <h3>Are you sure you want to delete selected categories </h3>
        <p>You won't be able to revert this!</p>
    </TheModal>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import { useStore } from "vuex";
import TheModal from "@/components/TheModal.vue";
import bootstrap from "bootstrap/dist/js/bootstrap";
import TheAlert from "@/components/TheAlert.vue";
import TheSearch from "@/components/TheSearch.vue";
import TheCreateBtn from "@/components/TheCreateBtn.vue";
import TheLoading from "@/components/TheLoading.vue";
import TheSizeRows from "@/components/TheSizeRows.vue";
import ThePagination from "@/components/ThePagination.vue";
import TheTable from "@/components/TheTable.vue";

const store = useStore()
const pageSize = ref(10);

const fields = [
    'Category Code', 'Category Name', 'Actions'
]

onMounted(() => {
    store.dispatch('getCategories',
    {
        keyword: searchKeyword.value,
        page: 0,
        size: pageSize.value,
        sortBy: sortBy.value
    })})
const categories = computed(() => store.getters.getCategories);
const errorMessage = computed(() => store.getters.getErrorMessage);
const isLoading = computed(() => store.getters.getLoading);
const alert = computed(() => store.getters.getAlert)
const pages = computed(() => store.getters.getPagination.totalPages)
const isLastPage = computed(() => store.getters.getPagination.last)
const isFirstPage = computed(() => store.getters.getPagination.first)
const pageNumber = computed(() => store.getters.getPagination.number)
const totalElts = computed(() => store.getters.getPagination.totalElements)
const numberOfElts = computed(() => store.getters.getPagination.numberOfElements)
const totalAndNumberOfElts = computed(() => (pageSize.value * pageNumber.value) + 1 +' - '+ ((pageNumber.value * pageSize.value) + numberOfElts.value) +' of '+ totalElts.value )

const category = reactive({
    id: null,
    categoryCode: '',
    categoryName: ''
})

const selectedCategories = ref([]);
const searchKeyword = ref('')
const validateForm = ref(true)
const isAllSelected = ref(false)
const sortBy = ref('ID_DESC')

const hideModal= (modalId)=> {
    const myModalEl = document.getElementById(modalId);
    const modal = bootstrap.Modal.getInstance(myModalEl)
    modal.hide();
}
const showModal = (modalId) => {
    const myModalAlternative = new bootstrap.Modal(modalId)
    myModalAlternative.show()
}
const initCategory = (cat) => {
    category.id = cat.id
    category.categoryName = cat.categoryName
    category.categoryCode = cat.categoryCode
}
const handleCreateCategoryBtn = () => {
    showModal('#createCategoryModal')
}
const addCategory = ()=> {
    if (category.categoryCode && category.categoryName){
        hideModal('createCategoryModal')
        store.dispatch('storeCategory', category)
        // hide deleteSelectedButton
        selectedCategories.value = []
        // reset category object to empty after create new category
        initCategory({ id:null, categoryCode:'', categoryName:'' })

    }else validateForm.value = false
}
const handleEditCategoryBtn = (cat) => {
    initCategory(cat)
    showModal('#updateCategoryModal')
}
const updateCategory = () => {
    if (category.categoryCode && category.categoryName){
        hideModal('updateCategoryModal')
        store.dispatch('updateCategory', category)
        initCategory({ id:null, categoryCode:'', categoryName:'' })
    }else validateForm.value = false
}
const handleDeleteCategoryBtn = (cat) => {
    initCategory(cat)
    showModal('#deleteCategoryModal')
}
const deleteCategory = ()=> {
    hideModal('deleteCategoryModal')
    store.dispatch('deleteCategory', category)
}
onMounted(()=> {
    // run instruction after closing createCategoryModal or creating new cateogry
    const myModalEl = document.getElementById('createCategoryModal')
    myModalEl.addEventListener('hide.bs.modal', () => {
        // active again form-validation
        validateForm.value = true

        // clear search bar after creating new category
        searchKeyword.value=''
        store.commit('setSearchKeyword', "")
    })

    const myUpdateModalEl = document.getElementById('updateCategoryModal')
    myUpdateModalEl.addEventListener('hide.bs.modal', () => {
        if (selectedCategories.value.length > 0)
            selectedCategories.value = []
    })

    const myDeleteModalEl = document.getElementById('deleteCategoryModal')
    myDeleteModalEl.addEventListener('hide.bs.modal', () => {
        if (selectedCategories.value.length > 0)
            selectedCategories.value = []
    })

    const myDeleteSelectedModalEl = document.getElementById('deleteSelectedCategoryModal')
    myDeleteSelectedModalEl.addEventListener('hide.bs.modal', () => {
        isAllSelected.value = false
    })
})

const searchCategory = (key) =>{
    store.dispatch('searchCategory',
        {keyword: key, page: 0, size: pageSize.value, sortBy: 'ID_DESC'})
    searchKeyword.value = store.getters.getSearchKeyword
}

const changeSize = (newSize) => {
    pageSize.value = +newSize
    store.dispatch('searchCategory',
        {keyword: searchKeyword.value, page: 0, size: pageSize.value, sortBy: sortBy.value})
}

const paginate = (p) => {
    store.dispatch('searchCategory',
        {keyword: searchKeyword.value, page: p, size: pageSize.value, sortBy: sortBy.value})
}

const selectAllCategories = (isAllSelectedTemp) => {
    isAllSelected.value = isAllSelectedTemp
    selectedCategories.value.length = 0
    if (isAllSelected.value){
        for (let i = 0; i < categories.value.length; i++) {
            selectedCategories.value.push(categories.value[i])
        }
    }
}

const selectCategory = (c) => {
    let index = -1
    for (let i = 0; i < selectedCategories.value.length; i++) {
        if (c.categoryCode === selectedCategories.value[i].categoryCode){
            selectedCategories.value.splice(i, 1)
            index = i
            break
        }
    }

    if (index === -1) selectedCategories.value.push(c)
}

const isChecked = (c) => {
    for (let i = 0; i < selectedCategories.value.length; i++) {
        if (c.categoryCode === selectedCategories.value[i].categoryCode) return true
    }
    return false
}

const handleDeleteSelectedCategoryBtn = () => {
    showModal('#deleteSelectedCategoryModal')
}

const deleteSelectedCategory = () => {
    hideModal('deleteSelectedCategoryModal')
    store.dispatch('deleteSelectedCategory', selectedCategories.value)
    selectedCategories.value = []
    initCategory({ id:null, categoryCode:'', categoryName:'' })
}

const sortByField = (fieldIndex) => {
    switch (fieldIndex) {
        case 0:
            setSortByValue('CATEGORY_CODE')
            store.dispatch('getCategories',
                {keyword: searchKeyword.value, page: pageNumber.value, size: pageSize.value, sortBy: sortBy.value})
            break
        case 1:
            setSortByValue('CATEGORY_NAME')
            store.dispatch('getCategories',
                {keyword: searchKeyword.value, page: pageNumber.value, size: pageSize.value, sortBy: sortBy.value})
            break
    }
}

const setSortByValue = (fieldName) => {
    if (sortBy.value === `${fieldName}_ASC`)
        return sortBy.value = `${fieldName}_DESC`
    return sortBy.value = `${fieldName}_ASC`
}

</script>

