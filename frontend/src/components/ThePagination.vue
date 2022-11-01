<template>
    <div class="mt-2 me-2">
        <span>{{ totalAndNumberOfElts }}</span>
    </div>
    <nav aria-label="Page navigation example">
        <ul class="pagination justify-content-end">
            <li class="page-item">
                <button type="button" class="page-link" @click="$emit('paginate-event', pageNumber-1)"
                        :class="isFirstPage ? 'disabled': ''">Previous</button>
            </li>
            <li v-for="(p,i) in pages" class="page-item" :class="(i) === pageNumber ? 'active' : ''">
                <button type="button" class="page-link" @click="$emit('paginate-event', i)">{{ p }}</button>
            </li>
            <li class="page-item">
                <button type="button" class="page-link" @click="$emit('paginate-event', pageNumber+1)"
                        :class="isLastPage ? 'disabled': ''">Next</button>
            </li>
        </ul>
    </nav>
</template>

<script setup>
defineProps({ totalAndNumberOfElts: String, isFirstPage: Boolean, isLastPage: Boolean, pageNumber: Number, pages: Number})
defineEmits(['paginate-event'])
</script>
<style scoped>

</style>
