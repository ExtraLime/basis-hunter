<template>
<div class='login-container'>
  <h3>Login to your BasisTrade Account</h3>
  <p v-if="errMsg">{{errMsg}}</p>
  <p><input type="email" placeholder="Email" :name='email' v-model="email" /></p>
  <p>
    <input type="password" placeholder="Password" v-model="password" />
  </p>

  <p><ui-button class='loginBtn' @click="signIn"> Login </ui-button></p>
   <a href="#" @click="google">
      <img src='https://symbols.getvecta.com/stencil_3/0_google.d6f70b2986.svg' width='25' />
    </a>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import firebase from 'firebase/app'
import { useRouter } from 'vue-router' // import router
import { useStore } from 'vuex'

const email = ref('')
const password = ref('')
const errMsg =ref(null)
const router = useRouter() // get a reference to our vue router
const store = useStore()
const signIn = async () => { // we also renamed this method 
await
firebase
    .auth()
    .signInWithEmailAndPassword(email.value, password.value) // THIS LINE CHANGED
    .then((data) => {
      console.log('Successfully logged in!');
      store.dispatch('auth/setUserAction',{data})
      router.push('/about') // redirect to the feed
    })
        .catch((error) => {
      switch (error.code) {
        case "auth/invalid-email":
          errMsg.value = "Invalid email";
          break;
        case "auth/user-not-found":
          errMsg.value = "No account with that email was found";
          break;
        case "auth/wrong-password":
          errMsg.value = "Incorrect password";
          break;
        default:
          errMsg.value = "Email or password was incorrect";
          break;
      }
    });
}
const google = async () => {
  await firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider()).then((data) => {
    console.log('via google',data.user)
  store.dispatch('auth/setUserAction',data.user)
    router.push('/about')

  });
}
</script>
<style scoped>
.login-container{
  display: grid;
  justify-content: center;
  align-content: center;
  text-align: center;
}
.ui-button :hover{
  color:white;
}
.ui-textfield {
  background-color:black}
.loginBtn{
  color:dodgerblue;
}
input{
  background-color:black; 
  border-radius: 2%;
  opacity:120%;
  color:white
}
</style>