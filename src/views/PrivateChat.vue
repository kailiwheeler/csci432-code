<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Message from '../components/Message.vue'
const items = ref([])
const message = ref("")
const hasMessage = ref(false)
const router = useRoute()
const userId = ref(router.params.userId)

onMounted(() => {
    getMessageHistory()
    console.log(userId.value)
    console.log('Component mounted!')
});
async function getMessageHistory(){
    const token = localStorage.getItem("token")
    
    const url = `https://hap-app-api.azurewebsites.net/messages/${userId.value}`
    const options = {
		method: "GET",
		headers: {
			Authorization: `Bearer ${token}`,
		},
	}
	let response = await fetch(url, options);
    console.log(response)
	if (response.status === 200) {
		const data = await response.json()
        items.value = data
        console.log(data)
        console.log(items.value)
        hasMessage.value=true
        return
	}else if(response.status === 401){
		console.log("unauthorized")
        return
	} else{
        console.log("internal erver error")
        return
    }
}
    async function postPrivateMessage(event){
        const token = localStorage.getItem("token")
        const data = {text:message.value}
        console.log(userId.value)
        const url = `https://hap-app-api.azurewebsites.net/message/${userId.value}`
        console.log(url)
        console.log(data)
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        }
        let response = await fetch(url, options)
        console.log(response)
        if (response.status === 201) {
            const data = await response.json()
            console.log("message created")
            hasMessage.value=true
            getMessageHistory()	
        }
        else if (response.status === 400) {
            console.log("bad request")		
        }else if (response.status === 401) {
            console.log("unauthorized")		
        }else{
            console.log("Internal Server Error")	
        }
        message.value=""
    }
const formatDate = (dateString) => {
	return new Date(dateString).toLocaleString("en-US", { timeZone: 'America/New_York' }) + " EST"
}
</script>

<template>
    <main>
        <span class="fs-primary-heading">Chat with User</span>
        <div v-if="hasMessage == false" class="infoContainer center">
            You and user do not have any message
        </div>
        <section v-if="hasMessage == true" id="scroll" class="scrollContainter addM">
            <span>Chat</span>
            <Message v-for="item in items" :name="item.senderName" :text="item.text" :date="formatDate(item.updatedAt)">
            </Message>
		</section>
        <div class="infoContainer center line">
            <label for="message">Send a Message</label>
            <input type="text" id="message" v-model="message" 
                placeholder=" Enter your message">
            <br><br>
            <a class="back-button" @click="postPrivateMessage">Post</a>
        </div>
    </main>
</template>

<style scoped>
main{
    display: inline;
    justify-content: center;
    justify-items: center;
}
.scrollContainter{
    display: flex;
    flex-direction: column;
    overflow-y: scroll;
    overflow-x: hidden;
    gap: 5px;
    align-items: center;
    border: var(--padding-200) var(--clr-accent-400) solid;
    width: 90%;
    height: 450px;
    margin: var(--padding-700);
    border-radius: var(--padding-300);
    padding: var(--padding-700);
    background-color: var(--clr-accent-400);
}
.addM{
    margin: var(--padding-500);
}
.line{
    display: block;
}
</style>