<template>
    <div :class="classes">
        {{ alert }}
    </div>
</template>

<script setup>
defineProps({ alert: String, classes: String });

</script>

<style scoped>

</style>
