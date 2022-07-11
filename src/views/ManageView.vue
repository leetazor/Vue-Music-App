<template>
  <!-- Main Content -->
  <section class="container mx-auto mt-6">
    <div class="md:grid md:grid-cols-3 md:gap-4">
      <div class="col-span-1">
         <!-- Upload -->
         <UploadVue
           :addSong="addSong"
         />
      </div>
      <div class="col-span-2">
        <div class="bg-white rounded border border-gray-200 relative flex flex-col">
          <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
            <span class="card-title">My Songs</span>
            <i class="fa fa-compact-disc float-right text-green-400 text-2xl"></i>
          </div>
          <div class="p-6">
            <!-- Composition Items -->
            <CompositionItem v-for="(song, i) in songs"
              :key="song.docID"
              :song="song"
              :updateSong="updateSong"
              :removeSong="removeSong"
              :updateUnsavedFlag="updateUnsavedFlag"
              :index="i"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
// import store from '@/store/store';
import UploadVue from '@/components/UploadVue.vue';
import CompositionItem from '@/components/CompositionItem.vue';
import { songsCollection, auth } from '@/includes/firebase';

export default {
  name: 'ManageView',
  components: {
    UploadVue,
    CompositionItem,
  },
  data() {
    return {
      songs: [],
      unsavedFlag: false,
    }
  },
  async created() {
    // 'where' is a firebase method to create a query to the database with a filter
    // "currentUser" is a property on firebase.auth method, to obtain the currently logged in user
    // we also need to initiate the query after creating it, we can do so with a .get() function
    const snapshot = await songsCollection
      .where('uid', '==', auth.currentUser.uid)
      .get();  
     
    snapshot.forEach(this.addSong);
  },
  methods: {
    addSong(songSnapshot) {
      const song = {
        ...songSnapshot.data(),
        docID: songSnapshot.id
      };
      this.songs.push(song);
    },
    updateSong(i, values) {
      this.songs[i].modified_name = values.modified_name;
      this.songs[i].genre = values.genre;
    },
    removeSong(i) {
      this.songs.splice(i, 1);
    },
    updateUnsavedFlag(value) {
      this.unsavedFlag = value;
    },
  },
  beforeRouteLeave(to, from, next) {
    if(!this.unsavedFlag) {
      next();
    } else {
      const leave = confirm('You have unsaved changes. Are you sure you want to leave?');
      next(leave);
    }

  }
  // below we are calling child component's method with a reference 
  // instead, we are doing this through lifecycle method in UploadVue child component
  // beforeRouteLeave(to, from, next) {
  //   this.$refs.upload.cancelUploads();
  //   next();
  // }
  // below we are restricting users from visiting this page if they are not authenticated.
  // we are doing this in the router with meta info instead
  // beforeRouteEnter(to, from, next) {
  //   if (store.state.userLoggedIn) {
  //     next();
  //   } else {
  //     next({ name: 'home' });
  //   }   
  // },
};
</script>
