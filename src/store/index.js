import { createStore } from 'vuex'
import { live } from './live.js'
import { layout } from './layout.js'
import { charts } from './charts.js'
import { auth } from './auth.js'
import { finance } from './finance.js'
import createPersistedState from "vuex-persistedstate";


export const store = createStore({   
    
    modules:{
        live,
        layout,
        charts,
        auth,
        finance
    },
    plugins:[createPersistedState()]
})