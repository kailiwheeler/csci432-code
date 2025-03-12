<script setup>
import Header from '../components/Header.vue'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { useUserStore } from '../stores/user';

const router = useRouter()
const userStore = useUserStore()

const firstName = ref("")
const lastName = ref("")
const email = ref("")
const userName = ref("")
const password = ref("")
const pass2 = ref("")
const validationAlert = ref("")

async function join (event) {
	event.preventDefault()

	validationAlert.value = ""

	//validate email
	if(email.value){
		if(!validateEmail(email.value)){
			validationAlert.value = "Email Is Not Valid"
			console.log("email not valid")
			return
		}
	}
	//validate passwords
	if(password.value && pass2.value){
		if((password.value.length < 8)||(pass2.value.length < 8)){
			validationAlert.value = "Passwords Must Be at Least 8 Characters"			
			return
		}
		if(password.value != pass2.value){
			validationAlert.value = "Passwords Must Match"			
			return
		}
	}
	//validate is not empty
	if (!firstName.value || !lastName.value || !email.value || !userName.value || !password.value || !pass2.value) {
		validationAlert.value = "All Fields Are Required"
		return
    }
	const data = {userName:userName.value, email:email.value, password:password.value, firstName:firstName.value, lastName:lastName.value }
	const url = 'https://hap-app-api.azurewebsites.net/user'
	const options = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	}
	let response = await fetch(url, options)
	console.log(response)
	if (response.status === 201) {
		const data = await response.json()
		userStore.setUser(
			firstName.value,
			lastName.value,
			userName.value,
			email.value,
			data.token
		)
		validationAlert.value = ""		
		router.push({
			name: 'main'
		})
	}
	else if (response.status === 400) {
		validationAlert.value = "Could Not Create Account"			
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
		<div class="containForm">
			<section class="container center pad">
				<form @submit="join">
					<label for="firstName">First Name:</label>
					<input type="text" id="firstName" v-model="firstName" 
					placeholder=" Enter your First Name" required>
					<br><br>
					<label for="lastName">Last Name:</label>
					<input type="text" id="lastName" v-model="lastName" 
					placeholder=" Enter your Last Name" required>
					<br><br>
					<label for="email">Email:</label>
					<input type="email" id="email" v-model="email" 
					placeholder=" Enter your Email" required>
					<br><br>
					<label for="userName">Username:</label>
					<input type="text" id="userName" v-model="userName" 
					placeholder=" Enter your Username" required>
					<br><br>
					<label for="password">Password:</label>
					<input type="password" id="password" v-model="password" 
					placeholder=" Enter your Password" required>
					<br><br>
					<label for="pass2">Confirm Password:</label>
					<input type="password" id="pass2" v-model="pass2" 
					placeholder=" Confirm your Password" required>
				</form>
			</section>
			<section class="container center pad">
				<button class="button" @click="join">Join</button>
			</section>
			<div v-if="validationAlert" role="alert" class="hiddenAlert center pad">{{ validationAlert }}</div>
		</div>
	</main>
</template>

<style scoped>
:deep(a) {
	text-decoration: none;
}
</style>