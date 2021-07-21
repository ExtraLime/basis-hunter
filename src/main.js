import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { store } from "./store";

import VueApexCharts from "../node_modules/vue3-apexcharts/dist/vue3-apexcharts.common";

import BalmUI from "../node_modules/balm-ui/dist/balm-ui.js"; // Official Google Material Components
import BalmUIPlus from "../node_modules/balm-ui/dist/balm-ui-plus.js"; // BalmJS Team Material Components
import "../node_modules/balm-ui/dist/balm-ui.css";


import firebase from "firebase/app";
import "firebase/auth";
import $theme from '../node_modules/balm-ui/plugins/theme';
import $typography from '../node_modules/balm-ui/plugins/typography';
import VueHighcharts from 'vue3-highcharts';

// `app`: Vue app


const firebaseConfig = {
  apiKey:process.env.VUE_APP_FB_API_KEY,
  authDomain:process.env.VUE_APP_FB_API_AUTH_DOMAIN,
  projectId:process.VUE_APP_FB_API_PROJECT_ID,
  storageBucket:process.env.VUE_APP_FB_API_STORAGE_BUCKET,
  messagingSenderId:process.env.VUE_APP_FB_API_MESSAGING_SENDER_ID,
  appId:process.env.VUE_APP_FB_API_APP_ID,
};
firebase.initializeApp(firebaseConfig);
firebase.auth().onAuthStateChanged(user => {
  store.dispatch("auth/setUserAction", user);
  
});

const app = createApp(App);

app.use(store);
app.use(router);
app.use(BalmUI);
app.use(BalmUIPlus);
app.use(VueApexCharts);
app.use(VueHighcharts);
app.use($theme, {
    primary:'lightgrey',
    secondary:'dodgerblue',
    background:'black',
    error:'#c80815',
    surface:'grey',

  });
  app.use($typography, ['dodgerstyle']);
app.mount("#app");
