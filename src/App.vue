<template>
<div>
<!-- Header -->
<AppHeader />

  <!-- Router Component -->
  <!-- We want to apply transition between components being swapped by vue -->
  <!-- For that, we are de-structuring the slot properties for an object called compomnent -->
  <!--The reason we are grabbing the slot property is because we need access to the components that are being swapped -->
  <!-- <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component :is="Component"></component>
    </transition>    
  </router-view> -->

  <router-view>   
  </router-view>

  <!-- Player -->
  <SoundPlayer />

  <!-- Auth Modal -->
   <UserAuth />

  </div>
</template>

<script>
import AppHeader from './components/AppHeader.vue';
import UserAuth from './components/UserAuth.vue';
import SoundPlayer from './components/SoundPlayer.vue';

export default {
  name: 'App',
  components: {
    AppHeader,
    UserAuth,
    SoundPlayer,
  },
  created() {
    this.$store.dispatch('init_login');
  },
};
</script>

<style>
.fade-enter-from {
  opacity: 0;
}

.fade-enter-active {
  transition: all 0.5s linear;
}

.fade-leave-to {
  transition: all 0.5s linear;
  opacity: 0;
}
</style>