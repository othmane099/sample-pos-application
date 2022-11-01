<template>
    <section>
        <div class="row">
            <div class="col-md-3 pt-1 ">
                <the-sidebar />
            </div>
            <div class="col-md-9 pt-1">
                <div class="card w-100">
                   <RouterView />
                </div>
            </div>
        </div>
    </section>

</template>

<script>
import TheSidebar from "@/components/TheSidebar.vue";
import DashboardComponent from "@/components/DashboardComponent.vue";
export default {
    name: "MainPage",
    components: {DashboardComponent, TheSidebar}
}
</script>

<style scoped>

</style>
