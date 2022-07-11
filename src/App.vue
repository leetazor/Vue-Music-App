<template>
<div>
<!-- Header -->
<AppHeader />

  <!-- Router Component -->
  <router-view></router-view>


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
