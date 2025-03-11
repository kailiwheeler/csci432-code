<script setup>
defineProps({
    firstName: String,
    lastName: String,
    userName: String,
    userId: String,
});

</script>

<template>
    <div class="userCard">
        <h3>{{ firstName }} {{ lastName }}</h3>
        <p>@{{ userName }}</p>
        <p>{{ userId }}</p>
        <RouterLink :to="`/user/${ userId }?name=${userName}`">Chat With User</RouterLink>
    </div>
</template>

<style scoped>
.userCard {
    background-color: var(--clr-accent-300);
    color: var(--clr-neutral-100);
    width: 100%;
    height: auto;
    display: block;
    justify-content: center;
    justify-items: center;
    margin: var(--padding-300);
    border-radius: var(--padding-400);
    padding: var(--padding-300);
}
</style>