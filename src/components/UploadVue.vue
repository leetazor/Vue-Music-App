<template>
  <div class="bg-white rounded border border-gray-200 relative flex flex-col">
    <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
      <span class="card-title">Upload</span>
      <i class="fas fa-upload float-right text-green-400 text-2xl"></i>
    </div>
    <div class="p-6">
      <!-- Upload Dropbox -->
      <div
        class="w-full px-10 py-20 rounded text-center cursor-pointer border border-dashed
          border-gray-400 text-gray-400 transition duration-500 hover:text-white
          hover:bg-green-400 hover:border-green-400 hover:border-solid"
          :class="{ 'bg-green-400 border-green-400 border-solid' : is_dragover }"
          @drag.prevent.stop=""
          @dragstart.prevent.stop=""
          @dragend.prevent.stop="is_dragover = false"
          @dragover.prevent.stop="is_dragover = true"
          @dragenter.prevent.stop="is_dragover = true"
          @dragleave.prevent.stop="is_dragover = false"
          @drop.prevent.stop="upload($event)"
          >
        <h5>Drop your files here</h5>
      </div>
      <input type="file" multiple @change="upload($event)" />
      <hr class="my-6" />
      <!-- Progess Bars -->
      <div class="mb-4" v-for="upload in uploads" :key="upload.name">
        <!-- File Name -->
        <div class="font-bold text-sm" :class="upload.text_class">
          <i :class="upload.icon"></i>{{ upload.name }}
        </div>
        <div class="flex h-4 overflow-hidden bg-gray-200 rounded">
          <!-- Inner Progress Bar -->
          <div class="transition-all progress-bar"
            :class="upload.variant"
            :style="{ width: upload.current_progress + '%' }"></div>
        </div>
      </div>  
    </div>
  </div>
</template>

<script>
import { storage, auth, songsCollection } from '@/includes/firebase';

export default {
  name: 'UploadVue',
   props: {
    addSong: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      is_dragover: false,
      uploads: [],
    };
  },
  methods: {
    upload($event) {
      this.is_dragover = false;
      // below we are converting 'files' Object found inside the drop 'event' payload into an array:
      // we are getting the object and spreading it inside of an array 
      const  files = $event.dataTransfer ?
        [...$event.dataTransfer.files] : 
        [...$event.target.files];

    files.forEach((file) => {
      if(file.type !== 'audio/mpeg') {
        return;
      }

      let randomNumber = Math.floor(Math.random() * (100000 - 10000 + 1)) + 10000;

      const storageRef = storage.ref(); // StorageBucket, e.g. "vue-music-app-38d35.appspot.com"
      const songsRef = storageRef.child(`songs/${auth.currentUser.uid}-${randomNumber}-${file.name}`); // e.g. "vue-music-app-38d35.appspot.com/songs/example.mp3"
      // the 'put' method we called to initiate upload will return an object
      // this object will emit events we can listen to during the upload
      // we need to asign the returned object to a variable:
      const task = songsRef.put(file);

     
      // here we are pushing a new upload object into the 'uploads' array in this component's data
      // we are getting and saving the 'index' by assigning the value returned from the push method to a variable
      // the 'push' function will return the length of the array after the object has been pushed into it
      // the object will be inserted as the last item in the array
      // we can subtract 1 from the length of the array to get the index for that latest item in the array
      const uploadIndex = this.uploads.push({
        task,
        current_progress: 0,
        name: file.name,
        variant: 'bg-blue-400',
        icon: 'fas fa-spinner fa-spin',
        text_class: '',
      }) -1 ;
  
      // after creating the 'task' variable, we're going to call the 'on' function from it
      // this function will let us listen to events on the object
      // the name of the event we want to listen to is called 'state_changed'
      // this even will get emitted on 3 occasions: progress of the upload, if upload failed or succeeded
      // the callback functions below must be arrow functions, to get access to the 'this' keyword to access this component's data()
      task.on('state_changed', (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100; // calculates how many % have been loaded so far
          this.uploads[uploadIndex].current_progress = progress;
        }, (error) => {
          this.uploads[uploadIndex].variant = 'bg-red-400';
          this.uploads[uploadIndex].icon = 'fas fa-times';
          this.uploads[uploadIndex].text_class = 'text-red-400';
          console.log(error);
        }, async () => {
          const song = {
            uid: auth.currentUser.uid,
            display_name: auth.currentUser.displayName,
            original_name: task.snapshot.ref.name,
            modified_name: file.name,
            genre: '',
            comment_count: 0,
          }

          song.url = await task.snapshot.ref.getDownloadURL();
          // this will create a song reference for us
          const songRef = await songsCollection.add(song);
          // this will create a song snapshot out of the reference,
          // so we could pass it to the 'addSong' function,
          // which is expecting a snapshot
          const songSnapshot = await songRef.get();

          this.addSong(songSnapshot);

          this.uploads[uploadIndex].variant = 'bg-green-400';
          this.uploads[uploadIndex].icon = 'fas fa-check';
          this.uploads[uploadIndex].text_class = 'text-green-400';
      });
    }); 
    },
    cancelUploads() {
      this.uploads.forEach ((upload) => {
      upload.task.cancel();
    });
    }
  },
  beforeUnmount() {
    this.uploads.forEach ((upload) => {
      upload.task.cancel();
    });
  },
};
</script>
