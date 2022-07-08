<template>
  <header id="header" class="bg-gray-700">
    <nav class="container mx-auto flex justify-start items-center py-5 px-4">
      <!-- App Name -->
      <router-link class="text-white font-bold uppercase text-2xl mr-4"
        :to="{name: 'home'}" exact-active-class="no-active">
        Music
      </router-link>      

      <div class="flex flex-grow items-center">
        <!-- Primary Navigation -->
        <ul class="flex flex-row mt-1">
          <!-- Navigation Links -->
          <li>
          <router-link class="px-2 text-white" :to="{name: 'about'}">About</router-link>
          </li>
          <li v-if="!userLoggedIn">
            <a class="px-2 text-white" href="#" @click.prevent="toggleAuthModal" >Login / Register</a>
          </li>
          <template v-else>
            <li>
              <router-link class="px-2 text-white" :to="{name: 'manage'}">Manage</router-link>
            </li>
             <li>
              <a class="px-2 text-white" href="#" @click.prevent="signout">Logout</a>
            </li>
          </template>
          
        </ul>
      </div>
    </nav>
  </header>
</template>

<script>

import { mapMutations, mapState } from 'vuex';

export default {
  name: 'AppHeader',
  computed: {
    ...mapState(['userLoggedIn']), 
  },
  methods: {
    // mapMutations function will extract the toggleAuthModal function directly from the store
    // we need to use a spread operator here, since we're already inside of an object
    ...mapMutations(['toggleAuthModal']),
    
    // we're manually dispatching a 'signout' axtion from the store
      signout() {
        //instead of redirecting like below, we're passing the dispatch function an object with router

      this.$store.dispatch('signout', {
        router: this.$router,
        route: this.$route
      });

      // and then we're redirecting the user
      // we're 'pushing' a next path on top of already visited paths.
      // we're using history api (this api allows users to go back and forth between pages
      // without having to refresh them)
      // we're also checking if the route we're currently on has a 'requiresAuth' meta property (we assign it in the router)
      // if (this.$route.meta.requiresAuth) {
      //   this.$router.push({ name: 'home'});
      // }  

    },
       

    // toggleAuthModal() {
    //   // commit allows us to call a mutation from the store
    //   this.$store.commit('toggleAuthModal');
    // },
  },
};
</script>
