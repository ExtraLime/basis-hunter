<template>
<div class='login-container'>
  <h3>Login to your BasisTrade Account</h3>
  <p><input type="email" placeholder="Email" :name='email' v-model="email" /></p>
  <p>
    <input type="password" placeholder="Password" v-model="password" />
  </p>
  <p v-if="errMsg">{{ errMsg }}</p>
  <p><ui-button @click="loginWithFirebase"> Login </ui-button></p>
   <a href="#" @click="google">
      <img src='https://symbols.getvecta.com/stencil_3/0_google.d6f70b2986.svg' width='25' />
    </a>
    </div>
</template>

<script>
import { watch, ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router"; // import router

import {google, user, login, useLogin} from '.' 

export default {
  props: {
    loginReturnUrl: { type: String, default: "/home" },
  },
  setup(props) {
      const store = useStore();
      const router = useRouter();
      const sam = useLogin()
      console.log(sam)
  watch(
      () => user.value,
      newUser => {
        if (newUser) {
          router.push(props.loginReturnUrl);
          store.dispatch("auth/setUser",{user})
        }
      }
    );

    console.log(props)
      const  loginWithFirebase = (email,password) => {
      const user = {
        email,
        password
      }
      store.dispatch('auth/logInAction', {user})
      }
    return {
      loginWithFirebase,
      google,
      login,
      ...useLogin()      
    };
  },
};
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
</style>