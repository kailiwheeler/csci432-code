<script setup>
import { ref } from 'vue';
import { reactive } from 'vue';
import UserCard from '@/components/UserCard.vue';
import { useRouter } from 'vue-router';

const searchQuery = ref('');
const users = ref([]);
const searchFilters = reactive({
    sortBy: 'FirstName:asc',
    limit: 10
})


async function searchUsers() {
    const token = localStorage.getItem("token");
    const url = `https://hap-app-api.azurewebsites.net/users?search=firstName|lastName|userName:${searchQuery.value}&sortBy=${searchFilters.sortBy}&limit=${searchFilters.limit}`;
    const options = {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    
    let response = await fetch(url, options);
    console.log(response)
    if (response.status === 200) {
        const data = await response.json()
        users.value = data;
        console.log(data)
        console.log(users.value)
        return
    } else {
        console.log("error")
        return
    }
    
}

</script>

<template>
    <main>
        <div class="searchContainer">
            <input v-model="searchQuery" type="text" placeholder="Search users" />
            <div class="addm">
                <label for="sortBy">Sort By </label>
                <select id="sortBy" v-model="searchFilters.sortBy">
                    <option value="userName:asc">Username (A-Z)</option>
                    <option value="userName:desc">Username (Z-A)</option>
                </select>
            </div>
            <div class="addm">
                <label for="limit">Limit </label>
                <select id="limit" v-model="searchFilters.limit">
                    <option value="5">5 users</option>
                    <option value="3">3 users</option>
                </select>
            </div>
            <br>
            <a class="back-button" @click="searchUsers">Search</a>
        </div>
        
        <div class="scrollContainter">
            <UserCard v-for="user in users"
            :key="user._id"
            :firstName="user.firstName"
            :lastName="user.lastName"
            :userName="user.userName"
            :userId="user._id"></UserCard>
        </div>
    </main>
</template>

<style scoped>
main{
    display: inline;
}
.searchContainer {
    border: var(--padding-200) var(--clr-accent-400) solid;
    width: 100%;
    height: 25%;
    border-radius: var(--padding-500);
    padding: var(--padding-400) var(--padding-300);
    background-color: var(--clr-accent-400);
    display: inline-block;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: var(--padding-500);

}
.searchInput {
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #ccc;
}
.scrollContainter{
    display: flex;
    flex-direction: column;
    overflow-y: scroll;
    overflow-x: hidden;
    gap: 5px;
    align-items: center;
    border: var(--padding-200) var(--clr-accent-400) solid;
    width: 100%;
    height: 500px;
    border-radius: var(--padding-300);
    padding: var(--padding-700);
    background-color: var(--clr-accent-400);
}
.addm{
    padding: var(--padding-200);
}

</style>
