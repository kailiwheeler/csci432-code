<script setup>

import { ref, useTemplateRef } from 'vue';
import { onMounted } from 'vue';
import Message from '../components/Message.vue';
const items = ref([]);
const newMessages = ref([]);
const newMessagesCount = ref(0);
import Modal from '@/components/Modal.vue';
const modal = useTemplateRef('message-modal');
const message = ref("")
import { useUserStore } from '../stores/user';
const userStore = useUserStore()

onMounted(() => {
    getItems()
    console.log('Component mounted!')

    //scroll event
    const scrollEvent = document.getElementById('scroll')
    scrollEvent.addEventListener('scroll',scrollHandler)
});

function scrollHandler(event){
    const scrollContainter = event.target
    if(scrollContainter.scrollTop === 0){
        scrollTop()
        return
    }
    if(scrollContainter.scrollHeight - scrollContainter.scrollTop === scrollContainter.clientHeight){
        scrollBottom()
        return
    }
    return
}
async function postMessage(event){
    const data = {text:message.value}
    const url = 'https://hap-app-api.azurewebsites.net/message'
    console.log(data)
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${userStore.token}`,
        },
        body: JSON.stringify(data),
    }
    let response = await fetch(url, options)
    console.log(response)
    if (response.status === 201) {
        const data = await response.json()
        console.log("message created")	
    }
    else if (response.status === 400) {
        console.log("bad request")		
    }else if (response.status === 401) {
        console.log("unauthorized")		
    }else{
        console.log("Internal Server Error")	
    }
    message.value=""
    modal.value.close(event)
}
function cancel(event){
    message.value=""
    modal.value.close(event)
}

async function scrollTop(){
    console.log("at top")
    
    const afterDate = getAfterDate();
    if (!afterDate) return;

    const url = `https://hap-app-api.azurewebsites.net/messages?after=${afterDate}`;
    const options = {
        method: "GET",
        headers: {
            Authorization: `Bearer ${userStore.token}`,
        },
    };

    let response = await fetch(url,options)
    console.log(response)

    if (response.status === 200) {
        const data = await response.json();
        if (data.length > 0) {
            newMessages.value = data;
            newMessagesCount.value = data.length;
            console.log(`New messages available: ${newMessagesCount.value}`);
        } else {
            console.log("No new messages available.");
        }
        return;
    } else if (response.status === 401) {
        console.log("Unauthorized");
        return;
    } else {
        console.log("Internal server error");
        return;
    }

}
async function scrollBottom(){
    console.log("at bottom");

    const beforeDate = getBeforeDate();
    if (!beforeDate) return;

    const url = `https://hap-app-api.azurewebsites.net/messages?limit=20&before=${beforeDate}`;
    const options = {
        method: "GET",
        headers: {
            Authorization: `Bearer ${userStore.token}`,
        },
    };
    let response = await fetch(url, options);
    console.log(response)
	if (response.status === 200) {
		const data = await response.json()
        if (data.length > 0) {
            items.value = [...items.value, ...data]; // Append new messages
            console.log("Loaded more messages", data);
        } else {
            console.log("No more messages to load");
        }
        return
	}else if(response.status === 401){
		console.log("unauthorized")
        return
	} else{
        console.log("internal erver error")
        return
    }
}

function loadNewMessages(){
    if(newMessages.value.length > 0){
        items.value = [...newMessages.value,...items.value]
        newMessages.value = []
        newMessagesCount.value = 0
    }
}
function refresh(event){
    console.log("refresh")
    getItems()
    console.log("refreshed")
}

async function getItems(){
    const url = 'https://hap-app-api.azurewebsites.net/messages?limit=10'
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
        items.value = data
        console.log(data)
        console.log(items.value)
        return
	}else if(response.status === 401){
		console.log("unauthorized")
        return
	} else{
        console.log("internal erver error")
        return
    }
}
const formatDate = (dateString) => {
	return new Date(dateString).toLocaleString("en-US", { timeZone: 'America/New_York' }) + " EST"
}
function getBeforeDate(){
    if (items.value.length > 0) {
        const lastItem = items.value[items.value.length - 1];
        console.log("Before Date:", lastItem.updatedAt);
        return lastItem.updatedAt;
    }
    return null;
}
function getAfterDate(){
    if (items.value.length > 0) {
        const firstItem = items.value[0];
        console.log("After Date:", firstItem.updatedAt);
        return firstItem.updatedAt;
    }
    return null;
}
</script>

<template>
    <main>
        <div id="buttons" class="buttonsContainer center">
            <a class="back-button" @click="modal.open()">Post</a>
            <a class="back-button" @click="refresh">Refresh</a>
        </div>  
        <section id="scroll" class="scrollContainter addM">
            <div v-if="newMessagesCount > 0">
            <a class="back-button" @click="loadNewMessages">
                {{ newMessagesCount }} new messages
            </a>
        </div>
            <Message v-for="item in items" :name="item.senderName" :text="item.text" :date="formatDate(item.updatedAt)">
            </Message>
		</section>
    </main>
     
    <Modal ref="message-modal">
		<template #header>
			<h1 class="fs-primary-heading">Add Message</h1>
		</template>
		<template #main>
            <form class="addM">
                <input type="text" id="message" v-model="message" 
                    placeholder=" Enter your message">
            </form>
		</template>
		<template #footer>
			<a class="back-button" @click.stop="cancel">Cancel</a>
			<a class="back-button" @click.stop="postMessage">Post</a>
		</template>
	</Modal>
</template>

<style scoped>
a { text-decoration: none; }
a:hover { cursor: pointer; }
main{
    display: inline-block;
    justify-content: center;
    justify-items: center;
    overflow: hidden;
}
.buttonsContainer{
    border: var(--padding-200) var(--clr-accent-400) solid;
    width: 40%;
    margin: var(--padding-700);
    border-radius: var(--padding-500);
    padding: var(--padding-400);
    background-color: var(--clr-accent-400);
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
    height: 500px;
    margin: var(--padding-700);
    border-radius: var(--padding-300);
    padding: var(--padding-700);
    background-color: var(--clr-accent-400);
}
.addM{
    margin: var(--padding-500);
}
</style>