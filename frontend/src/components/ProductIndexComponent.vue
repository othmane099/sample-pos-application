<template>
    <div v-if="alert">
        <TheAlert :classes="'alert alert-success'" :alert="alert"/>
    </div>

    <h5 class="card-header">Products</h5>
    <div class="d-flex">
        <TheSearch @search-product="searchProduct"
                   :searchKeyword="searchKeyword"
                   :eventType="'searchProduct'"/>

    </div>

    <div class="card-body">
        <div v-if="isLoading">
            <TheLoading />
        </div>
        <div v-else>
            <div v-if="!errorMessage">
                <div v-if="selectedProducts.length" class="d-flex w-100">
                    <p class="me-2">{{ selectedProducts.length }} rows selected</p>
                    <button class="btn btn-danger" type="button" @click="handleDeleteSelectedProductsBtn">Delete</button>
                </div>
                <table class="table table-bordered">
                    <thead>
                    <tr>
                        <th scope="col">
                            <input type="checkbox"
                                   v-model="isAllSelected"
                                   @change="selectAllProducts">
                            <p class="d-inline-block ms-2">Name</p>
                        </th>
                        <th scope="col"><p>Code</p></th>
                        <th scope="col"><p>Category</p></th>
                        <th scope="col"><p>Price</p></th>
                        <th scope="col"><p>Quantity</p></th>
                        <th scope="col"><p>Actions</p></th>
                    </tr>
                    </thead>
                    <tbody>
                    <!-- Loop through the list get the each student data -->
                    <tr v-for="prod in products" :key='prod.id'>
                        <td>
                            <input type="checkbox" :checked="isChecked(prod)"
                                   @change="selectProduct(prod)">
                            <p class="d-inline-block ms-2">{{ prod.productName }}</p>
                        </td>
                        <td>
                            {{ prod.productCode}}
                        </td>
                        <td>
                            {{ prod.categories.map(a => a.categoryName).toString() }}
                        </td>
                        <td>
                            {{ prod.sellingPrice}}
                        </td>
                        <td>
                            {{ prod.quantity}}
                        </td>
                        <td>
                            <button type="button" class="btn btn-success me-1"
                                    @click="handleEditProductBtn(prod.id)">E</button>
                            <button type="button" class="btn btn-danger me-1"
                                    @click="handleDeleteProductBtn(prod)">D</button>
                            <button type="button" class="btn btn-dark"
                                    @click="handleViewProductBtn(prod.id)">V</button>
                        </td>
                    </tr>
                    </tbody>
                </table>


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


    <!-- Delete Product Modal -->
    <TheModal :id="'deleteProductModal'"
              :modalTitle="'Delete'"
              :eventType="'deleteProductEvent'"
              @delete-product-event="deleteProduct">
        <h3>Are you sure you want to delete </h3>
        <p>You won't be able to revert this!</p>
    </TheModal>

    <!-- Delete Selected Products Modal -->
    <TheModal :id="'deleteSelectedProductsModal'"
              :modalTitle="'Delete Selected Products'"
              :eventType="'deleteSelectedProductsEvent'"
              @delete-selected-products-event="deleteSelectedProducts">
        <h3>Are you sure you want to delete selected categories </h3>
        <p>You won't be able to revert this!</p>
    </TheModal>



</template>

<script setup>
// import
import {computed, onMounted, reactive, ref} from "vue";
import store from "@/store";
import TheAlert from "@/components/TheAlert.vue";
import TheSearch from "@/components/TheSearch.vue";
import TheLoading from "@/components/TheLoading.vue";
import TheSizeRows from "@/components/TheSizeRows.vue";
import ThePagination from "@/components/ThePagination.vue";
import TheModal from "@/components/TheModal.vue";
import bootstrap from "bootstrap/dist/js/bootstrap";
import {useRouter} from "vue-router";


// ref
const pageSize = ref(10)
const searchKeyword = ref('')
const sortBy = ref('ID_DESC')
const selectedProducts = ref([])
const product = reactive({
    id: null,
    productCode: '',
    productName: '',
})
const tempProduct = ref({})
const isAllSelected = ref(false)
const router = useRouter()


/* computed */
const pages = computed(() => store.getters["product/getPagination"].totalPages)
const isLastPage = computed(() => store.getters["product/getPagination"].last)
const isFirstPage = computed(() => store.getters["product/getPagination"].first)
const pageNumber = computed(() => store.getters["product/getPagination"].number)
const totalElts = computed(() => store.getters["product/getPagination"].totalElements)
const numberOfElts = computed(() => store.getters["product/getPagination"].numberOfElements)
const totalAndNumberOfElts = computed(() => (pageSize.value * pageNumber.value) + 1 +' - '+ ((pageNumber.value * pageSize.value) + numberOfElts.value) +' of '+ totalElts.value )
const isLoading = computed( () => store.getters["product/getLoading"])
const errorMessage = computed( () => store.getters["product/getErrorMessage"])
const products = computed(() => {
    const ps = store.getters["product/getProducts"]
    // let cats = ps.map(p => p.categories.map(c =>  c.categoryName));
    // for (let i = 0; i < ps.length; i++) {
    //     ps[i].categories = cats[i].toString()
    // }
    return ps
})
const alert = computed(() => store.getters["product/getAlert"])


// hooks
onMounted(() => {
    store.dispatch('product/getProducts',
        {
            keyword: searchKeyword.value,
            page: 0,
            size: pageSize.value,
            sortBy: sortBy.value
        })})

onMounted(()=> {

    const myDeleteModalEl = document.getElementById('deleteProductModal')
    myDeleteModalEl.addEventListener('hide.bs.modal', () => {
        if (selectedProducts.value.length > 0)
            selectedProducts.value = []
    })

    const myDeleteSelectedModalEl = document.getElementById('deleteSelectedProductsModal')
    myDeleteSelectedModalEl.addEventListener('hide.bs.modal', () => {
        isAllSelected.value = false
    })
})


/* method */
const searchProduct = (key) =>{
    store.dispatch('product/searchProduct',
        {keyword: key, page: 0, size: pageSize.value, sortBy: 'ID_DESC'})
    searchKeyword.value = store.getters["product/getSearchKeyword"]
}

const changeSize = (newSize) => {
    pageSize.value = +newSize
    store.dispatch('product/searchProduct',
        {keyword: searchKeyword.value, page: 0, size: pageSize.value, sortBy: sortBy.value})
}

const paginate = (p) => {
    store.dispatch('product/searchProduct',
        {keyword: searchKeyword.value, page: p, size: pageSize.value, sortBy: sortBy.value})
}

const showModal = (modalId) => {
    const myModalAlternative = new bootstrap.Modal(modalId)
    myModalAlternative.show()
}

const hideModal= (modalId)=> {
    const myModalEl = document.getElementById(modalId);
    const modal = bootstrap.Modal.getInstance(myModalEl)
    modal.hide();
}


const handleEditProductBtn = (prodId) => {
    router.push({ name: 'ProductEdit', query:{ id: prodId } })
}

const handleDeleteProductBtn = (prod) => {
    tempProduct.value = prod
    showModal('#deleteProductModal')
}

const deleteProduct = ()=> {
    hideModal('deleteProductModal')
    store.dispatch('product/deleteProduct', tempProduct.value)
}

const handleViewProductBtn = (prodId) => {
    router.push({ name: 'ProductShow', query:{ id: prodId } })
}

const selectAllProducts = () => {
    selectedProducts.value.length = 0
    if (isAllSelected.value){
        for (let i = 0; i < products.value.length; i++) {
            selectedProducts.value.push(products.value[i])
        }
    }
}

const selectProduct = (prod) => {
    let index = -1
    for (let i = 0; i < selectedProducts.value.length; i++) {
        if (prod.productCode === selectedProducts.value[i].productCode){
            selectedProducts.value.splice(i, 1)
            index = i
            break
        }
    }

    if (index === -1) selectedProducts.value.push(prod)
}

const isChecked = (prod) => {
    for (let i = 0; i < selectedProducts.value.length; i++) {
        if (prod.productCode === selectedProducts.value[i].productCode) return true
    }
    return false
}

const handleDeleteSelectedProductsBtn = () => {
    showModal('#deleteSelectedProductsModal')
}

const deleteSelectedProducts = () => {
    hideModal('deleteSelectedProductsModal')
    store.dispatch('product/deleteSelectedProducts', selectedProducts.value)
    selectedProducts.value = []
}

</script>

