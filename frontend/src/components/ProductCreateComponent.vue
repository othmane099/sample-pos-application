<template>
    <h5 class="card-header">Product Form</h5>
    <div class="card-body">
        <form @submit.prevent="createOrUpdateProduct">
            <!--     Product Code   -->
            <div class="mb-3">
                <label for="productCodeField" class="form-label">Product Code *</label>
                <input id="productCodeField" type="text" class="form-control"
                       placeholder="Enter product Code" v-model="product.productCode">
                <p v-if="!validateForm && !product.productCode"
                class="text-danger ms-1">
                    Product Code is Required
                </p>
            </div>
            <!--    Product Name -->
            <div class="mb-3">
                <label for="productNameField" class="form-label">Product Name *</label>
                <input id="productNameField" type="text" class="form-control"
                       placeholder="Enter product Name" v-model="product.productName">
                <p v-if="!validateForm && !product.productName"
                   class="text-danger ms-1">
                    Product Name is Required
                </p>
            </div>
            <!--    Quantity    -->
            <div class="mb-3">
                <label for="quantityField" class="form-label">Quantity *</label>
                <input id="quantityField" type="number" class="form-control"
                       placeholder="Enter Quantity" v-model="product.quantity">
                <p v-if="!validateForm && !product.quantity"
                   class="text-danger ms-1">
                    Quantity is Required
                </p>
            </div>
            <!--    Product Buying Price    -->
            <div class="mb-3">
                <label for="buyingPriceField" class="form-label">Buying Price *</label>
                <input id="buyingPriceField" type="number" step="0.01" class="form-control"
                       placeholder="Enter Buying Price" v-model="product.buyingPrice">
                <p v-if="!validateForm && !product.buyingPrice"
                   class="text-danger ms-1">
                    Buying Price is Required
                </p>
            </div>
            <!--    Product Selling Price    -->
            <div class="mb-3">
                <label for="sellingPriceField" class="form-label">Selling Price *</label>
                <input id="sellingPriceField" type="number" step="0.01" class="form-control"
                       placeholder="Enter Selling Price" v-model="product.sellingPrice">
                <p v-if="!validateForm && !product.sellingPrice"
                   class="text-danger ms-1">
                    Selling Price is Required
                </p>
            </div>

            <!--    Product Categories    -->
            <div class="mb-3">
                <template v-for="c in categories" :key="c.id">
                    <input
                        v-model="product.categories"
                        type="checkbox"
                        :id="c.categoryCode"
                        :value="c"
                        :checked="c.categoryCode"
                    />
                    <label class="form-label me-3 ms-1" :for="c.categoryCode">
                        {{ c.categoryName }}
                    </label>
                </template>
                <p v-if="!validateForm && product.categories.length === 0"
                   class="text-danger ms-1">
                    Choose at least one category
                </p>
            </div>
            <div class="mb-3">
                <button class="btn btn-dark" type="submit">ADD</button>
            </div>
        </form>
    </div>
</template>

<script setup>

import {computed, onMounted, reactive, ref, watch, watchEffect} from "vue";
import store from "@/store";
import router from "@/router";
import {useRoute} from "vue-router";

// constants
const validateForm = ref(true)
const product = reactive({
    id: null,
    productCode: '',
    productName: '',
    quantity: 0,
    buyingPrice: 0.00,
    sellingPrice: 0.00,
    categories: []
})

// computed
const categories = computed(() => store.getters.getCategories)

// props
const route = useRoute()

// You can watch the property for triggering some other action on change
watch(() => route.query.id, () => {
    console.log(`MyCoolComponent - watch route.name changed to ${route.query.id}`);
    if (!route.query.id){
        product.id= null
        product.productCode= ''
        product.productName= ''
        product.quantity= 0
        product.buyingPrice= 0.00
        product.sellingPrice= 0.00
        product.categories= []
    }
});


// methods
const createOrUpdateProduct = () => {
    if (
        product.productCode &&
        product.productName &&
        product.quantity &&
        product.buyingPrice &&
        product.sellingPrice &&
        product.categories
    ){
        validateForm.value = true
        if (product.id === null) store.dispatch('product/storeProduct', product)
        else store.dispatch('product/updateProduct', product)

        router.push({ name: 'ProductIndex' })

    }else validateForm.value = false

}

onMounted(async () => {
    await store.dispatch('getAllCategories')
    if (route.query.id){
        await store.dispatch('product/getProduct', route.query.id)
        const tempProduct = store.getters['product/getProduct']
        product.id = tempProduct.id
        product.productCode = tempProduct.productCode
        product.productName = tempProduct.productName
        product.quantity = tempProduct.quantity
        product.buyingPrice = tempProduct.buyingPrice
        product.sellingPrice = tempProduct.sellingPrice
        product.categories = tempProduct.categories
    }
})
</script>

