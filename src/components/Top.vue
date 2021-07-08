<template>
<div>{{message}}</div>

</template>

<script>
import { useStore } from 'vuex'
import{ computed } from 'vue'
export default {

    setup(){
        const store = useStore()
        const message = "Basis Hunter"
        const pages = computed(() => {
            return store.state.layout.pages
        })
        console.log(message)
        return {message,
        pages}
    }
}


</script>

<style scoped>



</style>
