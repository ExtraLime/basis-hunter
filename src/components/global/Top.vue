<template>
  <div :class='props.isAuthenticated ? "top":"loggedout"'>
    <div class="logo">
      <img 
        src="../../assets/logo.png"
        alt=""
        width="50"
        style="{'borderRadius':'15%'}"
      />
      <h3 class="title">{{ message }}</h3>

      <ul v-if="props.isAuthenticated" class="navlinks">
        <li v-for="page in pages" :key="page.name">
          <link-item :page="page" />
        </li>
      </ul>
      <!-- <ul v-else>
      </ul> -->
    </div>
    <div>
      <div class="signIn">
        <ul v-if="props.isAuthenticated" class="signIn">
          <li>
            <link-item
              class="logout-button"
              @click="logOut"
              :page="{ path: '/#', name: 'Logout' }"
            />
          </li>
        </ul>
        <ul v-else></ul>
      </div>
    </div>
  </div>
</template>

<script>
import logo from "../../assets/logo1.png";
import { useStore } from "vuex";
import { computed } from "vue";
import LinkItem from "./LinkItem.vue";
import { getAuth, signOut } from 'firebase/auth'
import { useRouter } from "vue-router";
export default {
  components: {
    LinkItem,
  },
  props: {
    isAuthenticated: {
      type: Boolean,
    },
  },
  setup(props) {
    const router = useRouter();
    const store = useStore();
    const auth = getAuth()
    const logOut = async () => {
       signOut((auth))
        .then((res) => {
          store.dispatch("auth/logoutAction", null);
        })
        .finally(() => {
          router.push("/login");
        });
    };

    // const isAuthenticated = computed(() => {
    //   return store.state.auth.isAuthtenticated;
    // });

    const user = computed(() => {
      return store.state.auth.user;
    });

    const message = "Basis Trade";
    const pages = computed(() => {
      return store.state.layout.pages;
    });

    return { message, pages, logo, user, props, logOut };
  },
};
</script>

<style scoped>
h3{
  margin:1px;
}
.logo {
  display: flex;
  align-items: center;
  color: lightgrey;
  justify-content:center;
  text-align:center;
  margin:3px

}
.loggedout {
  background: dodgerblue;
  display: flex;
  justify-content: center;
  text-align:center;
height:6rem;
  /* align-content: center; */
  width: 100%;
}
.top {
  background: dodgerblue;
  display: flex;
  justify-content: space-evenly;

  /* align-content: center; */
  width: 100%;
}

ul {
  display: flex;
  list-style-type: none;
  justify-content: center;

  width: 100%;
}

/* .logout-button{
  float:right;
  justify-self: right;
} */
.menu {
  justify-self: center;
}
.signIn {
  display: flex;
}
</style>
