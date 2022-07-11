<template>
  <div class="border border-gray-200 p-3 mb-4 rounded">
    <div  >
      <h4 class="inline-block text-2xl font-bold">{{ song.modified_name }}</h4>
      <button class="ml-1 py-1 px-2 text-sm rounded text-white bg-red-600 float-right"
        @click.prevent="deleteSong">
        <i class="fa fa-times"></i>
      </button>
      <button class="ml-1 py-1 px-2 text-sm rounded text-white bg-blue-600 float-right"
        @click.prevent="showForm = !showForm">
        <i class="fa fa-pencil-alt"></i>
      </button>
    </div>
  
    <div v-show="showForm">
      <Transition name="fade">
      <div class="text-white text-center font-bold p-4 my-4 rounded"
        v-if="show_alert" :class="alert_variant">
        {{ alert_message }}
      </div>
      </Transition>
      <VeeForm :validation-schema="valSchema" :initial-values="song" @submit="editSong">
        <div class="mb-3">
          <label class="inline-block mb-2">Song Title</label>
          <VeeField name="modified_name" type="text"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300
            transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Enter Song Title"
            @input="updateUnsavedFlag(true)"
          />
            <ErrorMessage class="text-red-600" name="modified_name" />
        </div>
        <div class="mb-3">
          <label class="inline-block mb-2">Genre</label>
          <VeeField name="genre" type="text"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300
            transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Enter Genre"
            @input="updateUnsavedFlag(true)"
          />
            <ErrorMessage class="text-red-600" name="genre" />
        </div>
        <button type="submit" class="py-1.5 px-3 rounded text-white bg-green-600"
          :disabled="in_submission">
          Submit
        </button>
      </VeeForm>
    </div>

  </div>
</template>

<script>

import { songsCollection, storage } from '@/includes/firebase';

export default {
  name:'CompositionItem',
  props: {
    song: {
      type: Object,
      required: true,
    },
    updateSong: {
      type: Function,
      required: true,
    },
    removeSong: {
      type: Function,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
    updateUnsavedFlag: {
      type: Function,
    },
  },
  data() {
    return {
      showForm: false,
      valSchema: {
        modified_name: 'required',
        genre: 'alpha_spaces',
      },
      in_submission: false,
      show_alert: false,
      alert_variant: 'bg-blue-500',
      alert_message: '',
    };
  },
  methods: {
    // veeValidate passes the field values as an argument to the form submit function automatically:
    // 'values' object will contain the values from the fields, they will be named with the respecive names from the input fields
    async editSong(values) {
      this.in_submission = true;
      this.show_alert = true;
      this.alert_variant = 'bg-blue-500';
      this.alert_message = 'Please wait! Updating song info.';
      
      // .doc() allows us to select a document inside of a collection by its ID in firebase
      // .update() allows us to update a document in firebase.
      // We can modify single properties on an object or add new properties
      try {
        await songsCollection.doc(this.song.docID).update(values);
      } catch(error) {
        this.in_submission = false;
        this.alert_variant = 'bg-red-500';
        this.alert_message = 'Ooops. Something went wrong. Try again later.';
        return;
      }

      this.updateSong(this.index, values);
      this.updateUnsavedFlag(false);

      this.in_submission = false;
      this.alert_variant = 'bg-green-500';
      this.alert_message = 'Success! Updates have been applied.';

      setTimeout(() => {
        this.show_alert = false;
      }, 3000);

       setTimeout(() => {
        if (this.showForm == true) {
          this.showForm = false
        };
      }, 5000);
    },
    async deleteSong() {
    // reference to firebase storage
    const storageRef = storage.ref();
    // reference to the music file in the firebase storage:
    const songRef = storageRef.child(`songs/${this.song.original_name}`);

    // this will delete the entry in the database
    await songsCollection.doc(this.song.docID).delete();  

    // this will delete the music file from the firebase storage      
    await songRef.delete();


    this.removeSong(this.index);
    },
  },
};
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}


</style>
