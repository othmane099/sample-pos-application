<template>
    <div v-if="alert">
        <TheAlert :classes="'alert alert-success'" :alert="alert"/>
    </div>

    <h5 class="card-header">Customers</h5>

    <div class="d-flex">
        <TheSearch @search-customer="searchCustomer"
                   :searchKeyword="searchKeyword"
                   :eventType="'searchCustomer'"/>

        <div class="w-50 d-flex justify-content-end mt-1 me-3">
            <button type="button" class="btn btn-warning"
                    @click="handleFilterCustomersBtn">Filter</button>
            <button type="button" class="btn btn-danger ms-1">PDF</button>
            <button type="button" class="btn btn-success ms-1">EXCEL</button>
            <button type="button" class="btn btn-primary ms-1"
                    @click="handleCreateCustomerBtn">CREATE</button>
        </div>
    </div>

    <div class="card-body">
        <div v-if="isLoading">
            <TheLoading />
        </div>
        <div v-else>
            <div v-if="!errorMessage">
                <table class="table table-bordered">
                    <thead>
                    <tr>
                        <th scope="col" @click="sortByType(sortType.CODE)"><p>Code</p></th>
                        <th scope="col" @click="sortByType(sortType.FULL_NAME)"><p>Name</p></th>
                        <th scope="col" @click="sortByType(sortType.PHONE)"><p>Phone</p></th>
                        <th scope="col" @click="sortByType(sortType.EMAIL)"><p>Email</p></th>
                        <th scope="col"><p>Actions</p></th>
                    </tr>
                    </thead>
                    <tbody>
                    <!-- Loop through the list get the each student data -->
                    <tr v-for="c in customers" :key='c.id'>
                        <td>
                            <p>{{ c.customerCode }}</p>
                        </td>
                        <td>
                            {{ c.fullName}}
                        </td>
                        <td>
                            {{ c.phone}}
                        </td>
                        <td>
                            {{ c.email}}
                        </td>
                        <td>
                            <button type="button" class="btn btn-success me-1"
                                    @click="handleEditCustomerBtn(c)">E</button>
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

    <!-- Create User Modal -->
    <TheModal :id="'createCustomerModal'"
              :modalTitle="'Create'"
              :eventType="'createCustomerEvent'"
              @create-customer-event="createCustomer">
        <div class="row">
            <div class="col-6">
                <label for="customerFullNameField" class="form-label">Full name *</label>
                <input id="customerFullNameField" type="text" class="form-control"
                       placeholder="Enter Full name" v-model="customer.fullName">
                <p v-if="!validateForm && !customer.fullName" class="text-danger">
                    This field is required
                </p>
            </div>
            <div class="col-6">
                <label for="customerEmailField" class="form-label">Email *</label>
                <input id="customerEmailField" type="email" class="form-control"
                       placeholder="Enter Email" v-model="customer.email">
                <p v-if="!validateForm && !customer.email" class="text-danger">
                    This field is required
                </p>
            </div>
        </div>
        <div class="row mt-1">
            <div class="col-6">
                <label for="customerPhoneField" class="form-label">Phone *</label>
                <input id="customerPhoneField" type="tel" class="form-control"
                       placeholder="Enter Phone" v-model="customer.phone">
                <p v-if="!validateForm && !customer.phone" class="text-danger">
                    This field is required
                </p>
            </div>
            <div class="col-6">
                <label for="customerAddressField" class="form-label">Address *</label>
                <input id="customerAddressField" type="text" class="form-control"
                       placeholder="Enter User's username" v-model="customer.address">
                <p v-if="!validateForm && !customer.address" class="text-danger">
                    This field is required
                </p>
            </div>
        </div>

    </TheModal>

    <TheModal :id="'updateCustomerModal'"
              :modalTitle="'Update'"
              :eventType="'updateCustomerEvent'"
              @update-customer-event="updateCustomer">
        <div class="row">
            <div class="col-6">
                <label for="uCustomerFullNameField" class="form-label">Full name *</label>
                <input id="uCustomerFullNameField" type="text" class="form-control"
                       placeholder="Enter Full name" v-model="customer.fullName">
                <p v-if="!validateForm && !customer.fullName" class="text-danger">
                    This field is required
                </p>
            </div>
            <div class="col-6">
                <label for="uCustomerEmailField" class="form-label">Email *</label>
                <input id="uCustomerEmailField" type="email" class="form-control"
                       placeholder="Enter Email" v-model="customer.email">
                <p v-if="!validateForm && !customer.email" class="text-danger">
                    This field is required
                </p>
            </div>
        </div>
        <div class="row mt-1">
            <div class="col-6">
                <label for="uCustomerPhoneField" class="form-label">Phone *</label>
                <input id="uCustomerPhoneField" type="tel" class="form-control"
                       placeholder="Enter Phone" v-model="customer.phone">
                <p v-if="!validateForm && !customer.phone" class="text-danger">
                    This field is required
                </p>
            </div>
            <div class="col-6">
                <label for="uCustomerAddressField" class="form-label">Address *</label>
                <input id="uCustomerAddressField" type="text" class="form-control"
                       placeholder="Enter User's username" v-model="customer.address">
                <p v-if="!validateForm && !customer.address" class="text-danger">
                    This field is required
                </p>
            </div>
        </div>

    </TheModal>


</template>

<script setup>
import {computed, onMounted, reactive, readonly, ref} from "vue";
import store from "@/store";
import TheAlert from "@/components/TheAlert.vue";
import TheSearch from "@/components/TheSearch.vue";
import TheLoading from "@/components/TheLoading.vue";
import TheSizeRows from "@/components/TheSizeRows.vue";
import ThePagination from "@/components/ThePagination.vue";
import TheModal from "@/components/TheModal.vue";
import bootstrap from "bootstrap/dist/js/bootstrap";

const searchKeyword = ref('')
const sortBy = ref('ID_DESC')
const pageSize = ref(10);

const validateForm = ref(true)


const sortType = readonly({
    ID_DESC: 'ID_DESC',
    FULL_NAME: 'CUSTOMER_FULL_NAME',
    CODE: 'CUSTOMER_CODE',
    EMAIL: 'CUSTOMER_EMAIL',
    PHONE: 'CUSTOMER_PHONE',
})

const customer = reactive({
    id: null,
    customerCode: null,
    fullName: '',
    email: '',
    phone: '',
    address: '',
})

const filterForm = reactive({
    customerCode: '',
    fullName: '',
    phone: '',
    email: ''
})


// computed
const customers = computed(() => store.getters['customer/getCustomers'])
const errorMessage = computed(() => store.getters['customer/getErrorMessage']);
const isLoading = computed(() => store.getters['customer/getLoading']);
const alert = computed(() => store.getters['customer/getAlert'])
const pages = computed(() => store.getters['customer/getPagination'].totalPages)
const isLastPage = computed(() => store.getters['customer/getPagination'].last)
const isFirstPage = computed(() => store.getters['customer/getPagination'].first)
const pageNumber = computed(() => store.getters['customer/getPagination'].number)
const totalElts = computed(() => store.getters['customer/getPagination'].totalElements)
const numberOfElts = computed(() => store.getters['customer/getPagination'].numberOfElements)
const totalAndNumberOfElts = computed(() => (pageSize.value * pageNumber.value) + 1 +' - '+ ((pageNumber.value * pageSize.value) + numberOfElts.value) +' of '+ totalElts.value )



onMounted(()=> store.dispatch('customer/getCustomers',
    {
        keyword: searchKeyword.value,
        page: 0,
        size: pageSize.value,
        sortBy: sortBy.value
    }))

const searchCustomer = (key) =>{
    store.dispatch('customer/searchCustomer',
        {keyword: key, page: 0, size: pageSize.value, sortBy: 'ID_DESC'})
    searchKeyword.value = store.getters['customer/getSearchKeyword']
}

const changeSize = (newSize) => {
    pageSize.value = +newSize
    store.dispatch('customer/searchCustomer',
        {keyword: searchKeyword.value, page: 0, size: pageSize.value, sortBy: sortBy.value})
}

const paginate = (p) => {
    store.dispatch('customer/searchCustomer',
        {keyword: searchKeyword.value, page: p, size: pageSize.value, sortBy: sortBy.value})
}

const hideModal= (modalId)=> {
    const myModalEl = document.getElementById(modalId);
    const modal = bootstrap.Modal.getInstance(myModalEl)
    modal.hide();
}
const showModal = (modalId) => {
    const myModalAlternative = new bootstrap.Modal(modalId)
    myModalAlternative.show()
}

const initCustomerProperties = (u) => {
    customer.id = u.id
    customer.customerCode = u.customerCode
    customer.fullName = u.fullName
    customer.email = u.email
    customer.phone = u.phone
    customer.address = u.address
}

const handleEditCustomerBtn = (customer) => {
    initCustomerProperties(customer)
    showModal('#updateCustomerModal')
}

const updateCustomer = () => {
    if (customer.fullName && customer.email && customer.phone && customer.address ){
        hideModal('updateCustomerModal')
        store.dispatch('customer/updateCustomer', customer)
    }else validateForm.value = false
}

const handleCreateCustomerBtn = () => {
    initCustomerProperties({
        id: null,
        customerCode: null,
        fullName: '',
        email: '',
        phone: '',
        address: '',
    })
    showModal('#createCustomerModal')
}


const createCustomer = ()=> {

    if (customer.fullName && customer.email && customer.phone && customer.address ){
        hideModal('createCustomerModal')
        store.dispatch('customer/storeCustomer', customer)
    } else validateForm.value = false
}


const sortByType = (sort) => {
    setSortByValue(sort)
    store.dispatch('customer/getCustomers',
        {keyword: searchKeyword.value, page: pageNumber.value, size: pageSize.value, sortBy: sortBy.value})
}

const setSortByValue = (fieldName) => {
    if (sortBy.value === `${fieldName}_ASC`)
        return sortBy.value = `${fieldName}_DESC`
    return sortBy.value = `${fieldName}_ASC`
}

const handleFilterCustomersBtn = () => {
    showModal('#filterCustomersModal')
}

const filterCustomers = () => {

}


</script>

