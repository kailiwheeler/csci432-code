<script setup>
import { ref } from 'vue'

const showModal = ref(false)

defineExpose({
    open, close
})

function open() {
    showModal.value = true
}

function close(e) {
    showModal.value = false
}

</script>

<template>
    <div v-show="showModal" class="modal-backdrop" @click.self="close">
        <div class="modal">
            <header>
                <slot name="header"></slot>
                <img src="/X.png"
                    class="modal-button" @click.stop="close" />
            </header>
            <main>
                <slot name="main"></slot>
            </main>
            <footer>
                <slot name="footer"></slot>
            </footer>
        </div>
    </div>
</template>

<style scoped>
.modal-backdrop {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: var(--clr-accent-300);
    backdrop-filter: blur(10px);
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal {
    background-color: var(--clr-accent-400);
    padding: var(--padding-900);
    border-radius: var(--padding-500);
}

.modal-button{
    cursor: pointer;
    text-decoration: none;
    border-radius: 100vmax;
    padding: 1em 2em;
    font-weight: var(--fw-bold);
    line-height: 1;
    color: var(--clr-neutral-500);
    background-color: var(--clr-accent-300);
    width: 90px;
    box-shadow: 0 1.125em 1em -1em var(--clr-accent-500);

}

.modal-button:hover {
    background-color: var(--clr-accent-200);
}

header {
    display: flex;
    margin-bottom: var(--size-100);
    justify-content: space-between;
}

header > img {
    margin-left: var(--size-500);
}

footer {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: var(--size-400);
}

.highlight {
    background-color: yellow;
}
</style>