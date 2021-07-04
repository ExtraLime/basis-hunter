import { createRouter, createWebHistory } from "vue-router";
import BasisApp from '../BasisApp.vue';
import LiveView from '../views/LiveView.vue';
import AnalyzeView from '../views/AnalyzeView.vue';
import FinanceView from '../views/FinanceView.vue';
import AboutView from '../views/AboutView.vue';



 const routes = [
        {
            path:'/',
            component: BasisApp,
            children:[
                { 
                    path: '/about',
                    component: AboutView,
                }, 
                { 
                  path: '/live',
                  component: LiveView,
                },
                { 
                    path: '/analyze',
                    component: AnalyzeView,
                },
                { 
                    path: '/finance',
                    component: FinanceView,
                },


            ]
        }
    ]
    const router = createRouter({
        history: createWebHistory(),
        routes,
      });
export default router 