//base imports
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { store } from "./store";
//chart imports
import VueApexCharts from "../node_modules/vue3-apexcharts/dist/vue3-apexcharts.common";
//balm ui imports
import  BalmUI from 'balm-ui'
import BalmUIPlus from 'balm-ui/dist/balm-ui-plus';
import "../node_modules/balm-ui/dist/balm-ui.css";
import $theme from "../node_modules/balm-ui/plugins/theme";
// import UiButton from 'balm-ui/components/button';
// import UiIcon from 'balm-ui/components/icon';
// import UiTabsComponents from 'balm-ui/components/tabs';
// import UiSelect from 'balm-ui/components/select';
// import UiSwitch from 'balm-ui/components/switch';
// import UiCollapse from 'balm-ui/components/collapse';

//firebase imports
import { getAuth,  onAuthStateChanged } from "firebase/auth"
import { initializeApp } from 'firebase/app'


const firebaseConfig = {
  apiKey: process.env.VUE_APP_FB_API_KEY,
  authDomain: process.env.VUE_APP_FB_API_AUTH_DOMAIN,
  projectId: process.VUE_APP_FB_API_PROJECT_ID,
  storageBucket: process.env.VUE_APP_FB_API_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_FB_API_MESSAGING_SENDER_ID,
  appId: process.env.VUE_APP_FB_API_APP_ID,
};
const fireBasis = initializeApp(firebaseConfig);
const auth = getAuth()
onAuthStateChanged(auth, (user) => {
  store.dispatch("auth/setUserAction", user);
});

const app = createApp(App);

app.use(store);
app.use(router);

app.use(BalmUI, {
  $theme: {
    primary: "lightgrey",
    secondary: "dodgerblue",
    background: "black",
    error: "#c80815",
    surface: "grey",
  },
  $typography: ["dodgerstyle"]
});
// app.use(UiButton)
// app.use(UiIcon)
// app.use(UiTabsComponents)
// app.use(UiSelect)
// app.use(UiSwitch)
// app.use(UiCollapse)
// app.use($theme, {
//   primary: "lightgrey",
//   secondary: "dodgerblue",
//   background: "black",
//   error: "#c80815",
//   surface: "grey"})

app.use(VueApexCharts);
app.use(BalmUIPlus);
app.mount("#app");
