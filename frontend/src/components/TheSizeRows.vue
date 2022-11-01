<template>
    <label for="rpp">Rows per page:</label>
    <select name="sizes" id="rpp" v-model="pageSize" @change="$emit('changeSizeEvent', pageSize)" >
        <option>1</option>
        <option>5</option>
        <option>10</option>
        <option>20</option>
        <option>30</option>
        <option>40</option>
        <option>50</option>
    </select>
</template>

<script setup>
defineProps({ eventType: String, pageSize: Number})
defineEmits(['changeSizeEvent'])

</script>

