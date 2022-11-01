<template>
    <div class="card w-100" style="width: 18rem;">
        <div class="card-header">
            Menu
        </div>
        <ul class="list-group list-group-flush">

            <li v-for="m in menu" :key="m.id" class="list-group-item pointer-cursor" @click="this.$router.push({name:  m.name })">
                {{ m.label }}
            </li>

        </ul>
    </div>
</template>

<script setup>
const menu = [
    {
        id: 0,
        name: 'Dashboard',
        label: 'DASHBOARD'
    },
    {
        id: 1,
        name: 'ProductCreate',
        label: 'CREATE PRODUCT'
    },
    {
        id: 2,
        name: 'ProductIndex',
        label: 'ALL PRODUCTS'
    },
    {
        id: 3,
        name: 'CategoryIndex',
        label: 'CATEGORY'
    },
    {
        id: 4,
        name: 'SaleCreate',
        label: 'CREATE SALE'
    },
    {
        id: 5,
        name: 'SaleIndex',
        label: 'ALL SALES'
    },
    {
        id: 6,
        name: 'UserIndex',
        label: 'USERS'
    },
    {
        id: 7,
        name: 'CustomerIndex',
        label: 'CUSTOMERS'
    }]

</script>

<style scoped>

</style>
