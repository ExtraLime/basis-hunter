import { createRouter, createWebHistory } from "vue-router";
import BasisApp from "../BasisApp.vue";
import LiveView from "../views/LiveView.vue";
import AnalyzeView from "../views/AnalyzeView.vue";
import FinanceView from "../views/FinanceView.vue";
import AboutView from "../views/AboutView.vue";
import HomeView from "../views/HomeView.vue";
import firebase from "firebase/app";
import { useStore } from "vuex";
import { store } from "../store";

const routes = [
  // { path: "/",
  //   component: HomeView,
  //   meta:{
  //     public:true
  //   }
  // },
  {
    path: "/login",
    component: HomeView,
  },
  {
    path: "/",
    name: "Home",
    component: BasisApp,
    children: [
      {
        path: "/about",
        component: AboutView,
      },
      {
        path: "/live",
        name: "Live",
        component: LiveView,
      },
      {
        path: "/analyze",
        component: AnalyzeView,
      },
      {
        path: "/finance",
        component: FinanceView,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// router.beforeEach((to, from, next) => {
//  if (store.state.auth.isAuthenticated){
//    next()
//  }else {
//    next('/home')
//  }

// });

export default router;
