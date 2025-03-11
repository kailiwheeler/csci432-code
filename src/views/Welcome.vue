<script setup>
    import { ref } from 'vue'
    const usr = localStorage.getItem("email")
    const message = ref("")

    async function postMessage(event){
        const token = localStorage.getItem("token")
        const data = {text:message.value}
        const url = 'https://hap-app-api.azurewebsites.net/message'
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

</script>

<template>
    <main>
        <div class="infoContainer center">
            <h1 class="fs-600">Hi {{ usr }}</h1>
        </div>
        <div class="infoContainer center cnt">
            <label for="message">Message: </label>
            <input type="text" id="message" v-model="message" 
                placeholder=" Enter your message">
            <br><br>
            <a class="back-button" @click="postMessage">Post</a>
        </div>
    </main>
</template>

<style scoped>
main{
    display: inline;
    justify-content: center;
    justify-items: center;
}
.cnt{
    display: block;
    justify-content: center;
    justify-items: center;
}
</style>