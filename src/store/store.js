import { createStore } from 'vuex';
import { auth, usersCollection } from '@/includes/firebase';

export default createStore({
  state: {
    authModalShow: false,
    userLoggedIn: false,
  },
  getters: {
    // getAuthModalShow: (state) => state.authModalShow,
  },
  mutations: {
    toggleAuthModal: (state) => {
      state.authModalShow = !state.authModalShow;
    },
    toggleAuth(state) {
      state.userLoggedIn = !state.userLoggedIn;
    }
  },
  actions: {
    // Register action (async)
    async register({ commit }, values) {
      const userCred = await auth.createUserWithEmailAndPassword(
        values.email, values.password
      );

      await usersCollection.doc(userCred.user.uid).set({
        name: values.name,
        email: values.email,
        age: values.age,
        country: values.country,
        });

      await userCred.user.updateProfile({
        displayName: values.name,
      });

      // we've de-structured {commit} off ctx (context) passed to this action 
      // ctx is the store object  
      // this.$store.commit('toggleAuth');
      commit('toggleAuth');        
    },
    async login({ commit }, values) {
      await auth.signInWithEmailAndPassword(
        values.email, values.password);
        commit('toggleAuth'); 
    },
    // Initialize User Login
    init_login({ commit }) {
      const user = auth.currentUser;
      if (user) {
        commit('toggleAuth');
      }
    },
    async signout({commit}, routerInfo) {
      await auth.signOut();
      commit('toggleAuth');

      if (routerInfo.route.meta.requiresAuth) {
        routerInfo.router.push({ name: 'home'});
      }  
    },
  },
  modules: {
  },
});
