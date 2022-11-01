<template>
    <table class="table table-bordered">
        <thead>
        <tr>
            <th scope="col"
                v-for="(field,i) in fields"
                :key="field"
                @click="$emit('sortByFieldEvent', i)">
                <input v-if="i === 0" type="checkbox"
                       v-model="isAllSelected"
                       @change="$emit('selectAllElementsEvent', isAllSelected)">
                <p :class="i===0 ? 'd-inline-block ms-2' : ''">{{ field }}</p>
            </th>

            <th scope="col"><p>Actions</p></th>
        </tr>
        </thead>
        <tbody>
        <!-- Loop through the list get the each student data -->
        <tr v-for="(el) in elements" :key='el'>
            <td v-for="(field, i) in fields" :key='field'>
                <input v-if="i === 0" type="checkbox"
                       :checked="isChecked( el )"
                       @change="$emit('selectElementEvent', el)">
                <p class="d-inline-block ms-2">{{ Object.values(el)[i+1] }}</p>

            </td>
            <td>
                <slot/>
            </td>
        </tr>
        </tbody>
    </table>

</template>

<script setup>

defineProps({
    fields: Array,
    elements: Array,
    isChecked: Function,
    isAllSelected: Boolean,
})

defineEmits([
    'selectAllElementsEvent',
    'selectElementEvent',
    'editElementEvent',
    'deleteElementEvent',
    'sortByFieldEvent',
])
</script>
