import { createStore } from 'vuex'
import { table } from './table.js'
import { layout } from './layout.js'
import { charts } from './charts.js'



export const store = createStore({   
    
    modules:{
        table,
        layout,
        charts
    }
})