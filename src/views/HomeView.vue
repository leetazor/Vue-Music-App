<template>
  <main>    
    <!-- Introduction -->
    <section class="mb-8 py-20 text-white text-center relative">
      <div class="absolute inset-0 w-full h-full bg-contain introduction-bg"
        style="background-image: url(assets/img/header.png)"></div>
      <div class="container mx-auto">
        <div class="text-white main-header-content">
          <h1 class="font-bold text-5xl mb-5">Listen to Great Music!</h1>
          <p class="w-full md:w-8/12 mx-auto">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Phasellus et dolor mollis, congue augue non, venenatis elit.
            Nunc justo eros, suscipit ac aliquet imperdiet, venenatis et
            sapien. Duis sed magna pulvinar, fringilla lorem eget,
            ullamcorper urna.
          </p>
        </div>
      </div>

      <img alt="" class="relative block mx-auto mt-5 -mb-20 w-auto max-w-full"
        src="assets/img/introduction-music.png" />
    </section>

    <!-- Main Content -->
    <section class="container mx-auto">
      <div class="bg-white rounded border border-gray-200 relative flex flex-col">
        <!-- <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200" v-icon.right="'headphones-alt'"> -->
        <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200" v-icon-secondary="{ icon: 'headphones-alt', right:true }" >
          <span class="card-title">Songs</span>
          <!-- Icon -->
         
        </div>
        <!-- Playlist -->
        <ol id="playlist">
          <SongItem v-for="song in songs" :key="song.docID"
            :song="song" />
        </ol>
        <!-- .. end Playlist -->
      </div>
    </section>

 </main>
</template>

<script>
// @ is an alias to /src
import SongItem from '@/components/SongItem.vue';
import { songsCollection } from '@/includes/firebase';
import IconSecondary from '@/directives/icon-secondary';

export default {
  name: 'HomeView',
  data() {
    return {
      songs: [],
      maxPerPage: 10,
      pendingRequest: false,
    };
  },
  components: {
    SongItem,
  },
  directives: {
    'icon-secondary': IconSecondary,
  },
  async created() {   
    this.getSongs();

    window.addEventListener('scroll', this.handleScroll);
  },
  methods: {
    handleScroll() {
      // 'Infinite Scroll'
      // we need to calculate when to request more data from the server, to avoid fetching the whole songs database

      // we're de-sctructuring scrollTop & offsetHeight off the browser's documents element
      const { scrollTop, offsetHeight } = document.documentElement;
      // we're de-sctructuring innerHeight off the window object
      const { innerHeight } = window;
      
      const bottomOfWindow = Math.round(scrollTop) + innerHeight === offsetHeight;

      if (bottomOfWindow) {
        this.getSongs();
      }
    },
    async getSongs() {

      if (this.pendingRequest) {
        return;
      }
      
      // this will prevent users from making additional query requests when one is already happening
      this.pendingRequest = true;

      let docSnapshots;

      if (this.songs.length) {
          const lastDoc = await songsCollection
          .doc(this.songs[this.songs.length -1].docID)
          .get();

          docSnapshots = await songsCollection
          .orderBy('modified_name')
          .startAfter(lastDoc)
          .limit(this.maxPerPage)
          .get();
      } else {
          docSnapshots = await songsCollection
          .orderBy('modified_name')
          .limit(this.maxPerPage)
          .get();
      }
      

      docSnapshots.forEach((document) => {
        this.songs.push({
          docID: document.id,
          ...document.data(),

        });
      });

      this.pendingRequest = false;
    },
  },
  beforeUnmount() {
    // we need to remove ebent listener before component unmounts, to avoid memory leaks
    window.removeEventListener('scroll', this.handleScroll);
  },
};
</script>
