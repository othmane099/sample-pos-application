<template>
    <div>
        <div>
            <button class="btn btn-danger mt-1 ms-1" @click="downloadPdf">PDF</button>
            <button class="btn btn-success mt-1 ms-1" @click="downloadExcel">EXCEL</button>
        </div>
        <div class="d-flex justify-content-center">
            <table class="table table-striped mt-2 table-bordered w-50">
                <tbody>
                <tr>
                    <td>Code Product</td>
                    <td>{{ product.productCode }}</td>
                </tr>
                <tr>
                    <td>Product</td>
                    <td>{{ product.productName }}</td>
                </tr>
                <tr>
                    <td>Quantity</td>
                    <td>{{ product.quantity }}</td>
                </tr>
                <tr>
                    <td>Categories</td>
                    <td>{{ product.categories?.map(a => ' '+a.categoryName).toString() }}</td>
                </tr>
                <tr>
                    <td>Cost</td>
                    <td>{{ product.buyingPrice }}</td>
                </tr>
                <tr>
                    <td>Price</td>
                    <td>{{ product.sellingPrice }}</td>
                </tr>
                </tbody>
            </table>
        </div>

    </div>
</template>

<script setup>

import {useRoute} from "vue-router";
import {computed, onMounted} from "vue";
import store from "@/store";

const route = useRoute()
const product = computed(() => store.getters['product/getProduct'])
onMounted(() => store.dispatch('product/getProduct', route.query.id))

const downloadExcel = () => {
    console.log('download EXCEL')
}

const downloadPdf = () => {
    console.log('download PDF')
}
</script>
