<template>
    <h5 class="card-header">Sale Form</h5>
    <div class="card-body">
        <form @submit.prevent="createSale">
            <div>
                <label class="form-label" for="saleCustomerSelect">Customer *</label>
                <select class="form-select" id="saleCustomerSelect" v-model="sale.customer">
                    <option v-for="c in customers" :value="c">{{c?.fullName}}</option>
                </select>
                <p class="text-danger" v-if="!validateForm && !sale.customer">
                    This Field is required!
                </p>
            </div>

            <div>
                <label class="form-label" for="saleSearchProductField">Product</label>
                <input class="form-control" id="saleSearchProductField" v-model="keyword"
                       placeholder="Search product by code or name" @keyup="getProducts">

                <p class="text-danger" v-if="!validateForm && sale.soldProducts.length === 0">
                    This Field is required!
                </p>
            </div>
            <table class="table">
                <thead>
                <tr>
                    <th scope="col">Code</th>
                    <th scope="col">Name</th>
                    <th scope="col">Action</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="sp in searchedProducts">
                    <td>{{ sp.productName }}</td>
                    <td>{{ sp.productCode }}</td>
                    <td><button class="btn btn-primary" type="button"
                    @click="addToSale(sp)">ADD</button></td>
                </tr>
                </tbody>
            </table>

            <div v-if="soldProducts2.length">
                <table class="table">
                    <thead>
                    <tr>
                        <th scope="col">Code</th>
                        <th scope="col">Name</th>
                        <th scope="col">Quantity</th>
                        <th scope="col">Price</th>
                        <th scope="col">SubTotal</th>
                        <th scope="col">Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(sp, index) in soldProducts2">
                        <td>{{ sp.productCode }}</td>
                        <td>{{ sp.productName }}</td>
                        <td>
                            <button class="btn btn-sm btn-dark rounded-5"
                                    @click.prevent="decrementCurrentQuantity(sp, index)">-</button>
                            {{ sp.currentQuantity }}
                            <button class="btn btn-sm btn-dark rounded-5"
                                    @click.prevent="incrementCurrentQuantity(sp, index)">+</button>
                        </td>
                        <td>{{ sp.sellingPrice }}</td>
                        <td>{{ (sp.sellingPrice * sp.currentQuantity).toFixed(2) }}</td>
                        <td><button class="btn btn-danger" type="button"
                                    @click="removeFromSale(sp, index)">REMOVE</button>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div class="mt-1">
                <button class="btn btn-dark" type="submit">SUBMIT</button>
            </div>
        </form>
        <h1>{{ sale.totalPrice.toFixed(2) }}</h1>
    </div>
</template>

<script setup>

import {computed, onMounted, reactive, ref} from "vue";
import store from "@/store";
import {useRouter} from "vue-router";

const router = useRouter()
const validateForm = ref(true)
const keyword = ref('')
const searchedProducts = ref([])
const soldProducts2 = ref([])
const customers = computed(() => store.getters['customer/getCustomers'])
const sale = reactive({
    id: null,
    totalPrice: 0.00,
    paymentMethod: 'CASH',
    soldProducts: [],
    customer: null
})
const soldProduct = reactive({
    id: null,
    totalPrice: 0.00,
    quantityTaken: 0,
    product: null
})
onMounted(() => store.dispatch('customer/getAllCustomers'))

const getProducts = async () => {
    if (keyword.value.length > 0){
        await store.dispatch('product/getAllProductsByKeyword', keyword.value)
        searchedProducts.value = store.getters['product/getProducts']
    }else searchedProducts.value = []
}

const addToSale = (prod) => {
    const index = soldProducts2.value.findIndex((sp) => sp.id === prod.id)
    if (index === -1){
        prod.currentQuantity = 1
        sale.totalPrice =  sale.totalPrice + prod.sellingPrice
        soldProducts2.value.push(prod)
        sale.soldProducts.push({
            id:null,
            totalPrice: prod.sellingPrice,
            product: prod,
            quantityTaken: 1
        })
    }else incrementCurrentQuantity(prod, index)
}

const removeFromSale = (prod, index) => {
    sale.totalPrice = sale.totalPrice - (prod.sellingPrice  * prod.currentQuantity)
    prod.currentQuantity = 1
    soldProducts2.value.splice(index, 1)
    sale.soldProducts.splice(index, 1)

}

const incrementCurrentQuantity = (prod, index) => {
    if (prod.quantity > prod.currentQuantity){
        sale.totalPrice = sale.totalPrice + prod.sellingPrice
        prod.currentQuantity = prod.currentQuantity + 1
        sale.soldProducts[index].quantityTaken++
        sale.soldProducts[index].totalPrice += prod.sellingPrice

    }
}

const decrementCurrentQuantity = (prod, index) => {
    if (prod.currentQuantity > 0){
        sale.totalPrice = sale.totalPrice - prod.sellingPrice
        prod.currentQuantity = prod.currentQuantity - 1
        sale.soldProducts[index].quantityTaken--
        sale.soldProducts[index].totalPrice -= prod.sellingPrice
    }
}

const createSale = () => {
    if (sale.customer && sale.soldProducts.length !== 0 && sale.paymentMethod) {
        console.log(sale)
        store.dispatch('sale/storeSale', sale)
        validateForm.value = true
        router.push({ name: 'SaleIndex' })

    }else validateForm.value = false
}

</script>

<style scoped>


</style>

