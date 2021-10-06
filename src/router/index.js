import { createRouter, createWebHistory } from "vue-router";
import BasisApp from "../BasisApp.vue";
import HomeView from "../views/HomeView.vue";
import LearnView from "../views/LearnView.vue";
import LiveView from "../views/LiveView.vue";
import AnalyzeView from "../views/AnalyzeView.vue";
import FinanceView from "../views/FinanceView.vue";

const routes = [
  {
    path: "/login",
    component: HomeView,
  },
  {
    path: "/",
    name: "Home",
    component: BasisApp ,
    children: [
      {
        path: "/learn",
        name: 'Learn',
        component: () =>
        import(/* webpackChunkName: "learn" */ "../views/LearnView.vue"),
      },
      {
        path: "/live",
        name: "Live",
        component: () =>
        import(/* webpackChunkName: "live" */ "../views/LiveView.vue"),
      },
      {
        path: "/analyze",
        name:'Analyze',
        component: () =>
        import(/* webpackChunkName: "analyze" */ "../views/AnalyzeView.vue")
      },
      {
        path: "/finance",
        name:'Finance',
        component: () =>
        import(/* webpackChunkName: "finance" */ "../views/FinanceView.vue")
      },

    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
