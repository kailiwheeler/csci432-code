<script setup>
import Header from '../components/Header.vue'
</script>

<template>
  <Header>
    <nav>
      <RouterLink to="/Join">Join</RouterLink>
      <RouterLink to="/signin">Sign In</RouterLink>
    </nav>
  </Header>

  <main class="padding-block-700">
    <section class="homeContainer center vertical">
      <h1 class="fs-primary-heading">Welcome to P.A.N.D.A.S.</h1>
      <p class="fs-600">Personal Assembly of News and Data Across the States</p>
    </section>
  </main>
</template>

<style scoped>
main{
	background-color: var(--clr-accent-100);
}
:deep(a) {
  text-decoration: none;
  text-align: right;
}
</style>