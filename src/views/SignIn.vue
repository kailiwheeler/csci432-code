<script setup>
import Header from '../components/Header.vue'
import { useRouter } from 'vue-router'
import { ref } from 'vue'

const router = useRouter()

const email = ref("")
const password = ref("")
const validationAlert = ref("")

async function signIn (event) {
	event.preventDefault()

	validationAlert.value = ""

	//validate email
	if(email.value){
		if(!validateEmail(email.value)){
			validationAlert.value = "Email Is Not Valid"
			return
		}
	}
	//validate password length
	if(password.value.length < 8){
		validationAlert.value = "Passwords Must Be at Least 8 Characters"
		return
	}
	//validate is not empty
	if(!email.value || !password.value){
		validationAlert.value = "All Fields Are Required"
		return
	}
	const data = { email: email.value, password:password.value }
	const url = 'https://hap-app-api.azurewebsites.net/user/login'
	const options = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	}
	let response = await fetch(url, options)
	if (response.status === 200) {
		const data = await response.json()
		localStorage.setItem("token", data.token)
		localStorage.setItem("email", email.value)
		validationAlert.value = ""
		router.push({
			name: 'main'
		})
	} else if (response.status === 400) {
		validationAlert.value = "Invalid Email or Password"		
	}
}
function validateEmail(email) {
	const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailPattern.test(email);
}

</script>

<template>
	<Header>
		<nav>
			<RouterLink to="/">Home</RouterLink>
		</nav>
	</Header>
	<main class="padding-block-700">
		<div id="contF" class="containForm">
			<section class="container center pad">
				<form @submit="signIn">
					<label for="email">Email: </label>
					<input type="email" id="email" v-model="email"
					placeholder=" Enter your Email" required >
					<br><br>
					<label for="password">Password: </label>
					<input type="password" id="password" v-model="password" 
					placeholder=" Enter your Password" required>
				</form>
			</section>
			<section class="container center pad">
				<button class="button" @click="signIn">Sign In</button>
			</section>
			<div v-if="validationAlert" role="alert" class="hiddenAlert center pad">{{ validationAlert }}</div>
		</div>
	</main>
</template>

<style scoped>
main{
	background-color: var(--clr-accent-100);
}
:deep(a) {
	text-decoration: none;
}
</style>