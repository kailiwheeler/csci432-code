<script setup>
import Header from '../components/Header.vue'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { RouterView } from 'vue-router';


const router = useRouter()

const dropdownIsVisible = ref(false)

async function signOut(event) {
	const token = localStorage.getItem("token")
	const url = 'https://hap-app-api.azurewebsites.net/user/logout'
	const options = {
		method: "POST",
		headers: {
			Authorization: `Bearer ${token}`,
		},
	}
	let response = await fetch(url, options);
	if (response.ok) {
		if (response.status === 200) {
			localStorage.removeItem("email")
			localStorage.removeItem("token")
			router.push({
				name: 'home'
			})
		}
	} else {
		console.log("HTTP-Error: " + response.status)
	}
}

async function deleteAccount(event) {
	const token = localStorage.getItem("token")
	const url = 'https://hap-app-api.azurewebsites.net/user'
	const options = {
		method: "DELETE",
		headers: {
			Authorization: `Bearer ${token}`,
		},
	}
	let response = await fetch(url, options);
	if (response.status === 200) {
		localStorage.removeItem("email")
		localStorage.removeItem("token")
		router.push({
			name: 'home'
		})
	}else {
		console.log("HTTP-Error: " + response.status)
	}
	
}

function toggleDropdown(){
	dropdownIsVisible.value = !dropdownIsVisible.value
}

function confirmDelete(event){
	if(confirm("Are you sure you want to delete account?")){
		deleteAccount(event)
		return
	}else{
		return
	}
}

</script>

<template>
	<div class="view">
		<Header>
			<nav>
				<a @click="toggleDropdown" class="menu-button">Menu</a>
				<div class="dropdownOptions" v-if="dropdownIsVisible">
					<RouterLink to="/main"><a>Home</a></RouterLink>
					<RouterLink to="/profile"><a>Profile</a></RouterLink>
					<a @click="confirmDelete">Delete Account</a>
					<a @click="signOut">Sign Out</a>
				</div>
			</nav>
		</Header>
		<main class="padding-block-700 grids">
			<RouterView name="leftSidebar" class="grid-panel"></RouterView>
			<RouterView name="focus" class="grid-panel vline"></RouterView>
			<RouterView name="rightSidebar" class="grid-panel vline"></RouterView>
		</main>
	</div>
</template>

<style scoped>
a { text-decoration: none; }
a:hover { cursor: pointer; }
.grids{
	display: gird;
	grid-template-columns: 25% auto 20%;
}
.view {
	display: grid;
	grid-template-columns: 1fr;
	grid-template-rows: auto 1fr auto;
	height: 100%;
}

.grid-panel {
	padding: var(--size-300);
	margin: var(--size-300);
}
@media (min-width: 50em) {
	main {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		grid-template-rows: 1fr;
	}

	.vline {
		border-left: 1px lightgrey solid;		
	}
}
</style>