<script setup>
    import { RouterLink } from 'vue-router';
    import Logo from './Logo.vue'
</script>

<template>
    <header>
        <div class="headContainer">
            <Logo />
            <slot></slot>
        </div>
    </header>
</template>

<style scoped>
.headContainer {
  display: flex;
  padding: var(--padding-300) var(--padding-1000);
  background-color: var(--clr-accent-500);
  justify-content: space-between;
  align-items: center;
}

:slotted(*) {
    font-size: var(--fs-600);
    padding: 10px;
    color: white;
}

</style>