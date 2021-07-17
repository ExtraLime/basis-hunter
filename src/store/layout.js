export const layout = {
  namespaced: true,

  state() {
    return {
        pages: [
                    {
                        name: 'About',
                        path:'/about',
                        description:'Learn about basis trading and discover different ways you can earn passive income with crypto'
                    },
                    {
                        name: 'Live',
                        path:'/live',
                        description:'watch live market data, with basis rates and funding rates.'
                    },
                    {
                        name: 'Analyze',
                        path:'/analyze',
                        description:'Analyze recent data by coin'
                    },
                    {
                        name: 'Finance',
                        path:'/finance',
                        description:'find the best staking rates available for your coin'
                    },

                ],
        

    };
  },

};
