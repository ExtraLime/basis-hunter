import { createApp } from 'vue'
import App from './App.vue'
import router from "./router";
import {store} from "./store";
import VueApexCharts from "../node_modules/vue3-apexcharts/dist/vue3-apexcharts.common";


const app = createApp(App)

app.use(store)
app.use(router)

app.use(VueApexCharts)

app.mount('#app')