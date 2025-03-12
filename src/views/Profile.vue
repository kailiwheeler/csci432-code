<script setup>
import { useRouter } from 'vue-router'
const router = useRouter() 
import { ref, useTemplateRef } from 'vue'
const firstName = ref("")
const lastName = ref("")
const email = ref("")
const userName = ref("")
const validationAlert = ref("")
import { onMounted } from 'vue';
import Modal from '@/components/Modal.vue';
import { useUserStore } from '../stores/user';
const userStore = useUserStore()


async function getData (){
    const url = 'https://hap-app-api.azurewebsites.net/user'
    const options = {
		method: "GET",
		headers: {
			Authorization: `Bearer ${userStore.token}`,
		},
	}
	let response = await fetch(url, options);
    console.log(response)
	if (response.status === 200) {
		const data = await response.json()
        console.log(data)
        firstName.value = data.firstName
        lastName.value = data.lastName
        email.value = data.email
        userName.value = data.userName
        
        return
	}else if(response.status === 401){
		console.log("unauthorized")
        return
	} else{
        console.log("internal erver error")
        return
    }
}

onMounted(() => {
  getData()
  console.log('Component mounted!'); 
});

const modal = useTemplateRef('name-modal')

function cancel(e) {
	newFirstName.value = ''
    newLastName.value = ''
    newEmail.value = ''
    newUserName.value = ''
    newPassword.value = ''
	modal.value.close(e)
}

async function save(e) {
    if(newEmail.value){
		if(!validateEmail(newEmail.value)){
			validationAlert.value = "Email Is Not Valid"
			console.log("email not valid")
			return
		}
	}
    if(newPassword.value != 0 & newPassword.value.length < 8){
		validationAlert.value = "Password Must Be at Least 8 Characters"			
		return
	}
    const data = {}
    if (newUserName.value) data.userName = newUserName.value;
    if (newEmail.value) data.email = newEmail.value;
    if (newFirstName.value) data.firstName = newFirstName.value;
    if (newLastName.value) data.lastName = newLastName.value;
    if (newPassword.value) data.password = newPassword.value;
	const url = 'https://hap-app-api.azurewebsites.net/user'
    console.log(data)
	const options = {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
            "Authorization": `Bearer ${userStore.token}`,
		},
		body: JSON.stringify(data),
	}
	let response = await fetch(url, options)
	console.log(response)
	if (response.status === 200) {
		const data = await response.json()
		console.log(data)
        console.log("ok")
        userStore.setUser(
			data.firstName ?? '', 
			data.lastName ?? '', 
			data.userName ?? '', 
			email.value, 
			data.token ?? ''
		)	
		await getData()
	}
	else if (response.status === 400) {
		console.log("bad request")		
	}else{
        console.log("Internal Server Error")	
    }
	newFirstName.value = ''
    newLastName.value = ''
    newEmail.value = ''
    newUserName.value = ''
	modal.value.close(e)
}

function validateEmail(email) {
	const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailPattern.test(email);
}

const newFirstName = ref("")
const newLastName = ref("")
const newEmail = ref("")
const newUserName = ref("")
const newPassword = ref("")

</script>

<template>
    <main>
        <div class="infoContainer center line">
            <div class="addM">
                <span>First Name: {{ firstName }}</span><br>
                <span>Last Name: {{ lastName }}</span><br>
                <span>Username: {{ userName }}</span><br>
                <span>Email: {{ email }}</span><br><br>
            </div>
            <div id="buttons" class="addM">
                <a class="back-button" @click="router.back()">Back</a>
                <a class="back-button" @click="modal.open()">Edit</a>
            </div> 
        </div>
    </main>

    <Modal ref="name-modal">
		<template #header>
			<h1 class="fs-primary-heading">Edit Profile</h1>
		</template>
		<template #main>
            <form class="addM">
                <label for="newFirstName">New First Name:</label>
                <input type="text" id="newFirstName" v-model="newFirstName" 
                    placeholder=" Enter your new First Name">
                <br><br>
                <label for="newLastName">New Last Name:</label>
                <input type="text" id="newLastName" v-model="newLastName" 
                    placeholder=" Enter your new Last Name">
                <br><br>
                <label for="newEmail">New Email:</label>
                <input type="email" id="newEmail" v-model="newEmail" 
                    placeholder=" Enter your new Email">
                <br><br>
                <label for="newUserName">New Username:</label>
                <input type="text" id="newUserName" v-model="newUserName" 
                    placeholder=" Enter your new Username">
                <br><br>
                <label for="newPassword">New Password:</label>
			    <input type="password" id="newPassword" v-model="newPassword" 
					placeholder=" Enter your new Password">
            </form>
            <div v-if="validationAlert" role="alert" class="hiddenAlert center pad">{{ validationAlert }}</div>
		</template>
		<template #footer>
			<a class="back-button" @click.stop="cancel">Cancel</a>
			<a class="back-button" @click.stop="save">Save</a>
		</template>
	</Modal>

</template>

<style scoped>
a { text-decoration: none; }
a:hover { cursor: pointer; }
.addM{
    margin: var(--padding-500);
}

.line{
    display: inline-block;
}
</style>