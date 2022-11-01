<template>
    <div class="w-50 d-flex justify-content-end mt-1 me-3">
        <button type="button" class="btn btn-primary"
                @click="$emit(eventType)">create</button>
    </div>
</template>

<script setup>
const props = defineProps({ eventType: String})
</script>

<style scoped>

</style>
