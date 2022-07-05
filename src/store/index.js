import { createStore } from 'vuex';

export default createStore({
  state: {
    authModalShow: false,
  },
  getters: {
    // getAuthModalShow: (state) => state.authModalShow,
  },
  mutations: {
    toggleAuthModal: (state) => {
      state.authModalShow = !state.authModalShow;
    },
  },
  actions: {
  },
  modules: {
  },
});
