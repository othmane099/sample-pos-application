<template>
    <h5 class="card-header">Sales</h5>
    <div class="d-flex">
        <TheSearch @search-category="searchSale"
                   :searchKeyword="searchKeyword"
                   :eventType="'searchSale'"/>
        <TheCreateBtn :eventType="'createSaleBtn'"
                      @create-sale-btn="handleCreateSaleBtn"/>
    </div>

    <div class="card-body">
        <table class="table table-bordered">
            <thead>
            <tr>
                <th scope="col"><p>Date</p></th>
                <th scope="col"><p>Code</p></th>
                <th scope="col"><p>Customer</p></th>
                <th scope="col" ><p>Total Price</p></th>
                <th scope="col"><p>Actions</p></th>
            </tr>
            </thead>
            <tbody>
            <!-- Loop through the list get the each student data -->
            <tr v-for="s in sales" :key='s.id'>
                <td>
                    {{ s.created_at }}
                </td>
                <td>
                    {{ s.saleCode}}
                </td>
                <td>
                    {{ s.customer?.fullName}}
                </td>
                <td>
                    {{ s.totalPrice.toFixed(2)}}
                </td>
                <td>
                    <button type="button" class="btn btn-dark me-1"
                    @click="handleViewSaleBtn(s.id)">V</button>
                    <button type="button" class="btn btn-success me-1">E</button>
                    <button type="button" class="btn btn-danger me-1">D</button>
                </td>
            </tr>
            </tbody>
        </table>

    </div>
</template>

<script setup>
import TheSearch from "@/components/TheSearch.vue";
import TheCreateBtn from "@/components/TheCreateBtn.vue";

import {computed, onMounted, ref} from "vue";
import store from "@/store";
import {useRouter} from "vue-router";


const pageSize = ref(10)
const searchKeyword = ref('')
const sortBy = ref('ID_DESC')

const router = useRouter()

/* computed */
const pages = computed(() => store.getters["sale/getPagination"].totalPages)
const isLastPage = computed(() => store.getters["sale/getPagination"].last)
const isFirstPage = computed(() => store.getters["sale/getPagination"].first)
const pageNumber = computed(() => store.getters["sale/getPagination"].number)
const totalElts = computed(() => store.getters["sale/getPagination"].totalElements)
const numberOfElts = computed(() => store.getters["sale/getPagination"].numberOfElements)
const totalAndNumberOfElts = computed(() => (pageSize.value * pageNumber.value) + 1 +' - '+ ((pageNumber.value * pageSize.value) + numberOfElts.value) +' of '+ totalElts.value )
const isLoading = computed( () => store.getters["sale/getLoading"])
const errorMessage = computed( () => store.getters["sale/getErrorMessage"])
const sales = computed(() => store.getters["sale/getSales"])
const alert = computed(() => store.getters["product/getAlert"])

onMounted(() => store.dispatch('sale/getSales', {
    keyword: searchKeyword.value,
    page: 0,
    size: pageSize.value,
    sortBy: sortBy.value
}))

const searchSale = () => {
    console.log('SearchSale')
}

const handleCreateSaleBtn = () => {
    router.push({name: 'SaleCreate'})
}

const handleViewSaleBtn = (saleId) => {
    router.push({ name: 'SaleShow', query:{ id: saleId } })
}
</script>
