import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store/store';
import VeeValidatePlugin from './includes/validation';
import { auth } from './includes/firebase';
import Icon from './directives/icon';
import './assets/tailwind.css';
import './assets/main.css';
import './registerServiceWorker'
import GlobalComponents from './includes/_globals';


// we are declaring a variable before creating Vue app, it's currently empty
let app;

// we're listening to AuthStateChange
auth.onAuthStateChanged(() => {
  // when AuthState changes, if app variable is empty (has no value),
  // we're creating and mounting an app
  // we're doing this, so the app would have access to the authenticated user
  if(!app) {
    app = createApp(App);

    app.use(store);
    app.use(router);
    app.use(VeeValidatePlugin);
    app.use(GlobalComponents);
    app.directive('icon', Icon);  
    
    app.mount('#app');
  }

});

