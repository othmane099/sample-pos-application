<template>
    <div class="modal fade" :id="modalId" tabindex="-1" aria-labelledby="ModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="ModalLabel">{{ modalTitle }}</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <slot></slot>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" @click="$emit(eventType)">Done</button>
                </div>
            </div>
        </div>
    </div>

</template>

<script setup>

const props = defineProps({ modalTitle: String, eventType: String, modalId: String });



</script>

<style scoped>

</style>
