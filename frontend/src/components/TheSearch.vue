<template>
    <form class="d-flex w-50 mt-1 ms-3" role="search" @submit.prevent="$emit(eventType, searchKeyword)">
        <input class="form-control me-2 w-50" type="search" placeholder="Search"
               v-model="searchKeyword" aria-label="Search">
        <button class="btn btn-outline-success" type="submit">Search</button>
    </form>
</template>

<script setup>
const props = defineProps({ searchKeyword: String, eventType: String });
    </script>

<style scoped>

</style>
