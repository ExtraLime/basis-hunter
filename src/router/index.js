import { createRouter, createWebHistory } from "vue-router";
import BasisApp from "../BasisApp.vue";
import LiveView from "../views/LiveView.vue";
import AnalyzeView from "../views/AnalyzeView.vue";
import FinanceView from "../views/FinanceView.vue";
import LearnView from "../views/LearnView.vue";
import HomeView from "../views/HomeView.vue";

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
        path: "/learn",
        component: LearnView,
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
