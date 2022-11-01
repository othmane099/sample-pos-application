<template>
    <div>
        <div>
            <button class="btn btn-danger mt-1 ms-1">PDF</button>
            <button class="btn btn-success mt-1 ms-1">EXCEL</button>
        </div>
        <div class="card m-2 p-3">
            <h5>Sale: {{mysale?.saleCode}}</h5>
            <h5>Payment: {{mysale?.paymentMethod}}</h5>
            <h5>Date: {{mysale?.created_at}}</h5>
            <h5>Date: {{mysale?.customer.fullName}}</h5>
        </div>
        <div class="d-flex justify-content-center">
            <table class="table table-striped">
                <thead>
                <tr>
                    <th scope="col"><p>Product</p></th>
                    <th scope="col"><p>Unit Price</p></th>
                    <th scope="col"><p>Quantity</p></th>
                    <th scope="col" ><p>Subtotal</p></th>
                </tr>
                </thead>
                <tbody>
                <!-- Loop through the list get the each student data -->
                <tr v-for="p in mysale?.soldProducts" :key='p.id'>
                    <td>
                        {{ p.product.productName }}
                    </td>
                    <td>
                        {{ p.product.sellingPrice.toFixed(2)}}
                    </td>
                    <td>
                        {{ p.quantityTaken }}
                    </td>
                    <td>
                        {{ p.totalPrice.toFixed(2)}}
                    </td>
                </tr>
                </tbody>
            </table>

        </div>
        <span class="h3 m-3">Total: <span>{{ total }}</span></span>

    </div>
</template>

<script setup>
import {useRoute} from "vue-router";
import {computed, onMounted, ref} from "vue";
import store from "@/store";

const mysale = ref()
const mytotal = ref()
const route = useRoute()
const total = computed(() => mysale.value?.soldProducts.reduce((acc, item) => acc + item.totalPrice, 0))
onMounted(async () => {
    await store.dispatch('sale/getSale', route.query.id)
    mysale.value = store.getters['sale/getSale']
    mytotal.value = mysale.value.soldProducts.reduce((acc, item) => acc + item.value, 0);

})

</script>

<style scoped>

</style>
