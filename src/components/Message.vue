<script setup>

const props = defineProps({ name: String, date: String, text: String})

</script>

<template>
    <div class="card space">
        <h1 class="fs-secondary-heading ">{{ name }}</h1>
        <h1 class="fs-500 ">{{ date }}</h1>
        <h1 class="fs-secondary-heading fw-bold pad">{{ text }}</h1>
    </div>

</template>

<style scoped>

.card {
    background-color: var(--clr-accent-300);
    color: var(--clr-neutral-100);
    width: 100%;
    height: auto;
    display: block;
    justify-content: center;
    justify-items: center;
    margin: var(--padding-300);
    border-radius: var(--padding-400);
}
.space{
    padding: var(--padding-300);
}

</style>