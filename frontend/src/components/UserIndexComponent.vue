<template>
    <div v-if="alert">
        <TheAlert :classes="'alert alert-success'" :alert="alert"/>
    </div>

    <h5 class="card-header">Users</h5>
    <div class="d-flex">
        <TheSearch @search-user="searchUser"
                   :searchKeyword="searchKeyword"
                       :eventType="'searchUser'"/>

        <div class="w-50 d-flex justify-content-end mt-1 me-3">
            <button type="button" class="btn btn-warning"
            @click="handleFilterUsersBtn">Filter</button>
            <button type="button" class="btn btn-danger ms-1">PDF</button>
            <button type="button" class="btn btn-success ms-1">EXCEL</button>
            <button type="button" class="btn btn-primary ms-1"
                    @click="handleCreateUserBtn">CREATE</button>
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
                <th scope="col" @click="sortByType(sortType.USER_FULL_NAME)"><p>Full Name</p></th>
                <th scope="col" @click="sortByType(sortType.USER_USERNAME)"><p>Username</p></th>
                <th scope="col" @click="sortByType(sortType.EMAIL)"><p>Email</p></th>
                <th scope="col" @click="sortByType(sortType.PHONE)"><p>Phone</p></th>
                <th scope="col"><p>Status</p></th>
                <th scope="col"><p>Actions</p></th>
            </tr>
            </thead>
            <tbody>
            <!-- Loop through the list get the each student data -->
            <tr v-for="user in users" :key='user.id'>
                <td>
                    <p class="d-inline-block ms-2">{{ user.fullName }}</p>
                </td>
                <td>
                    {{ user.username}}
                </td>
                <td>
                    {{ user.email}}
                </td>
                <td>
                    {{ user.phone}}
                </td>
                <td> <input type="checkbox" :checked="user.status" @change="updateStatus(user)"></td>
                <td>
                    <button type="button" class="btn btn-success me-1"
                            @click="handleEditUserBtn(user)">E</button>
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
    <TheModal :id="'createUserModal'"
              :modalTitle="'Create'"
              :eventType="'createUserEvent'"
              @create-user-event="createUser">
        <div class="row">
            <div class="col-6">
                <label for="userFullNameField" class="form-label">Full name *</label>
                <input id="userFullNameField" type="text" class="form-control"
                       placeholder="Enter User's Full name" v-model="user.fullName">
                <p v-if="!validateForm && !user.fullName" class="text-danger">
                    This field is required
                </p>
            </div>
            <div class="col-6">
                <label for="userUsernameField" class="form-label">Username *</label>
                <input id="userUsernameField" type="text" class="form-control"
                       placeholder="Enter User's username" v-model="user.username">
                <p v-if="!validateForm && !user.username" class="text-danger">
                    This field is required
                </p>
            </div>
        </div>
        <div class="row mt-1">
            <div class="col-6">
                <label for="userEmailField" class="form-label">Email *</label>
                <input id="userEmailField" type="email" class="form-control"
                       placeholder="Enter User's Email" v-model="user.email">
                <p v-if="!validateForm && !user.email" class="text-danger">
                    This field is required
                </p>
            </div>
            <div class="col-6">
                <label for="userPasswordField" class="form-label">Password *</label>
                <input id="userPasswordField" type="password" class="form-control"
                       placeholder="Enter User's username" v-model="user.password">
                <p v-if="!validateForm && !user.password" class="text-danger">
                    This field is required
                </p>
            </div>
        </div>
        <div class="row mt-1">
            <div class="col-6">
                <label for="userPhoneField" class="form-label">Phone *</label>
                <input id="userPhoneField" type="tel" class="form-control"
                       placeholder="Enter User's Phone" v-model="user.phone">
                <p v-if="!validateForm && !user.phone" class="text-danger">
                    This field is required
                </p>
            </div>
            <div class="col-6">
                <h6>Roles *</h6>
                <template v-for="r in roles" :key="r.id">
                    <input
                        v-model="user.roles"
                        type="checkbox"
                        :id="r.roleName"
                        :value="r"
                        :checked="r.roleName"
                    />
                    <label class="form-label me-3 ms-1" :for="r.roleName">
                        {{ r.roleName[0]+''+r.roleName[1] }}
                    </label>
                </template>
                <p v-if="!validateForm && user.roles.length === 0"
                   class="text-danger ms-1">
                    Choose at least one role
                </p>
            </div>
        </div>

    </TheModal>

    <!-- Update User Modal -->
    <TheModal :id="'updateUserModal'"
              :modalTitle="'Update'"
              :eventType="'updateUserEvent'"
              @update-user-event="updateUser">
        <div class="row">
            <div class="col-6">
                <label for="uuserFullNameField" class="form-label">Full name *</label>
                <input id="uuserFullNameField" type="text" class="form-control"
                       placeholder="Enter User's Full name" v-model="user.fullName">
                <p v-if="!validateForm && !user.fullName" class="text-danger">
                    This field is required
                </p>
            </div>
            <div class="col-6">
                <label for="uuserUsernameField" class="form-label">Username *</label>
                <input id="uuserUsernameField" type="text" class="form-control"
                       placeholder="Enter User's username" v-model="user.username">
                <p v-if="!validateForm && !user.username" class="text-danger">
                    This field is required
                </p>
            </div>
        </div>
        <div class="row mt-1">
            <div class="col-6">
                <label for="uuserEmailField" class="form-label">Email *</label>
                <input id="uuserEmailField" type="email" class="form-control"
                       placeholder="Enter User's Email" v-model="user.email">
                <p v-if="!validateForm && !user.email" class="text-danger">
                    This field is required
                </p>
            </div>
            <div class="col-6">
                <label for="uuserPasswordField" class="form-label">Password *</label>
                <input id="uuserPasswordField" type="password" class="form-control"
                       placeholder="Enter User's username" v-model="user.password">
                <p v-if="!validateForm && !user.password" class="text-danger">
                    This field is required
                </p>
            </div>
        </div>
        <div class="row mt-1">
            <div class="col-6">
                <label for="uuserPhoneField" class="form-label">Phone *</label>
                <input id="uuserPhoneField" type="tel" class="form-control"
                       placeholder="Enter User's Phone" v-model="user.phone">
                <p v-if="!validateForm && !user.phone" class="text-danger">
                    This field is required
                </p>
            </div>
            <div class="col-6">
                <h6>Roles *</h6>
                <template v-for="r in roles" :key="r.id">
                    <input
                        v-model="user.roles"
                        type="checkbox"
                        :id="r.roleName"
                        :value="r"
                        :checked="r.roleName"
                    />
                    <label class="form-label me-3 ms-1" :for="r.roleName">
                        {{ r.roleName[0]+''+r.roleName[1] }}
                    </label>
                </template>
                <p v-if="!validateForm && user.roles.length === 0"
                   class="text-danger ms-1">
                    Choose at least one role
                </p>
            </div>
        </div>
    </TheModal>

    <!-- Filter User Modal -->
    <TheModal :id="'filterUsersModal'"
              :modalTitle="'Filter'"
              :eventType="'filterUsersEvent'"
              @filter-users-event="filterUsers">
        <div class="row">
            <div class="mt-3">
                <label for="fUserUsernameField" class="form-label">Username</label>
                <input id="fUserUsernameField" type="text" class="form-control"
                       placeholder="Search By Username" v-model="filterForm.username">
            </div>

            <div class="mt-3">
                <label for="fUserPhoneField" class="form-label">Phone</label>
                <input id="fUserPhoneField" type="text" class="form-control"
                       placeholder="Search By Phone" v-model="filterForm.phone">
            </div>

            <div class="mt-3">
                <label for="fUserEmailField" class="form-label">Email</label>
                <input id="fUserEmailField" type="text" class="form-control"
                       placeholder="Search By Email" v-model="filterForm.email">
            </div>

            <div class="mt-3">
                <label for="fUserStatusSelect" class="form-label">Status</label>
                <select id="fUserStatusSelect" class="form-control" v-model="filterForm.status">
                    <option>Any</option>
                    <option>Active</option>
                    <option>Inactive</option>
                </select>
            </div>
        </div>
    </TheModal>
</template>

<script setup>
import TheModal from "@/components/TheModal.vue";
import bootstrap from "bootstrap/dist/js/bootstrap";
import TheAlert from "@/components/TheAlert.vue";
import TheSearch from "@/components/TheSearch.vue";
import TheCreateBtn from "@/components/TheCreateBtn.vue";
import TheLoading from "@/components/TheLoading.vue";
import TheSizeRows from "@/components/TheSizeRows.vue";
import ThePagination from "@/components/ThePagination.vue";

import {computed, onMounted, reactive, readonly, ref} from "vue";
import store from "@/store";

const searchKeyword = ref('')
const sortBy = ref('ID_DESC')
const pageSize = ref(10);

const validateForm = ref(true)

const sortType = readonly({
    ID_DESC: 'ID_DESC',
    USER_FULL_NAME: 'USER_FULL_NAME',
    USER_USERNAME: 'USER_USERNAME',
    EMAIL: 'USER_EMAIL',
    PHONE: 'USER_PHONE',
})


const user = reactive({
    id: null,
    fullName: '',
    username: '',
    password: '',
    email: '',
    phone: '',
    status: false,
    roles: [],
})

const filterForm = reactive({
    username: '',
    phone: '',
    email: '',
    status: 'Any',
})


// computed
const users = computed(() => store.getters['user/getUsers'])
const errorMessage = computed(() => store.getters['user/getErrorMessage']);
const isLoading = computed(() => store.getters['user/getLoading']);
const alert = computed(() => store.getters['user/getAlert'])
const pages = computed(() => store.getters['user/getPagination'].totalPages)
const isLastPage = computed(() => store.getters['user/getPagination'].last)
const isFirstPage = computed(() => store.getters['user/getPagination'].first)
const pageNumber = computed(() => store.getters['user/getPagination'].number)
const totalElts = computed(() => store.getters['user/getPagination'].totalElements)
const numberOfElts = computed(() => store.getters['user/getPagination'].numberOfElements)
const totalAndNumberOfElts = computed(() => (pageSize.value * pageNumber.value) + 1 +' - '+ ((pageNumber.value * pageSize.value) + numberOfElts.value) +' of '+ totalElts.value )
const roles = computed(() => store.getters['role/getRoles'])



onMounted(()=> store.dispatch('user/getUsers',
    {
        keyword: searchKeyword.value,
        page: 0,
        size: pageSize.value,
        sortBy: sortBy.value
    }))

onMounted(() => store.dispatch('role/getAllRoles'))

const searchUser = (key) =>{
    store.dispatch('user/searchUser',
        {keyword: key, page: 0, size: pageSize.value, sortBy: 'ID_DESC'})
    searchKeyword.value = store.getters['user/getSearchKeyword']
}

const changeSize = (newSize) => {
    pageSize.value = +newSize
    store.dispatch('user/searchUser',
        {keyword: searchKeyword.value, page: 0, size: pageSize.value, sortBy: sortBy.value})
}

const paginate = (p) => {
    store.dispatch('user/searchUser',
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

const initUserProperties = (u) => {
    user.id = u.id
    user.fullName = u.fullName
    user.username = u.username
    user.password = u.password
    user.email = u.email
    user.phone = u.phone
    user.status = u.status
    user.roles = u.roles
}

const handleEditUserBtn = (user) => {
    initUserProperties(user)
    showModal('#updateUserModal')
}

const updateUser = () => {
    if (user.id && user.fullName && user.username && user.password &&
        user.email && user.phone && user.roles ){
        hideModal('updateUserModal')
        store.dispatch('user/updateUser', user)
        initUserProperties({
            id: null,
            fullName: '',
            username: '',
            password: '',
            email: '',
            phone: '',
            status: false,
            roles: []
        })
    }else validateForm.value = false
}

const handleCreateUserBtn = () => {
    showModal('#createUserModal')
}


const createUser = ()=> {

    if (user.fullName && user.username && user.password &&
        user.email && user.phone  && user.roles.length !== 0 ){
        hideModal('createUserModal')
        store.dispatch('user/storeUser', user)
        initUserProperties({
            id: null,
            fullName: '',
            username: '',
            password: '',
            email: '',
            phone: '',
            status: false,
            roles: []
        })
    } else validateForm.value = false
}

const updateStatus = (u) => {
    u.status = !u.status
    store.dispatch('user/updateUser', u)
}

const sortByType = (sort) => {
    setSortByValue(sort)
    store.dispatch('user/getUsers',
        {keyword: searchKeyword.value, page: pageNumber.value, size: pageSize.value, sortBy: sortBy.value})
}

const setSortByValue = (fieldName) => {
    if (sortBy.value === `${fieldName}_ASC`)
        return sortBy.value = `${fieldName}_DESC`
    return sortBy.value = `${fieldName}_ASC`
}

const handleFilterUsersBtn = () => {
    showModal('#filterUsersModal')
}

const filterUsers = () => {

}

</script>


