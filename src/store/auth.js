export const auth = {
  namespaced: true,

  state() {
    return {
      isAuthenticated: false,
      user: {},
    };
  },
  getters: {
    getUser(state) {
      return state.user;
    },
    getAuth(state) {
      return state.isAuthenticated;
    },
  },
  mutations: {
    setIsAuthenticated(state, data) {
      state.user.isAuthenticated = data.isAuthenticated;
      state.user.data = data;
    },
    setUser(state, data) {
      if (data) {
        state.user.email = data.email ? data.email : null;
        state.user.displayName = data.displayName ? data.displayName : null;
        state.user.lastLogin = data.metadata.lastSignInTime
          ? data.metadata.lastSignInTime
          : "none";
        state.isAuthenticated = data ? true : false;
      } else {
        state.user = {};
        state.isAuthenticated = false;
      }
    },
    logoutUser(state) {
      state.user = {};
      state.isAuthenticated = false;
    },
  },
  actions: {
    setUserAction(ctx, data) {
      ctx.commit("setUser", data);
    },
    logoutAction(ctx) {
      ctx.commit("logoutUser");
    },
  },
};
