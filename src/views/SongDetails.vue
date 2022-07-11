<template>
  <div >
    <!-- Music Header -->
    <section class="w-full mb-8 py-14 text-center text-white relative">
      <div class="absolute inset-0 w-full h-full box-border bg-contain music-bg"
        style="background-image: url(/assets/img/song-header.png)">
      </div>
      <div class="container mx-auto flex items-center">
        <!-- Play/Pause Button -->
        <button type="button" class="z-50 h-24 w-24 text-3xl bg-white text-black rounded-full
          focus:outline-none" @click.prevent="newSong(song)" >
          <i class="fas fa-play"></i>
        </button>
        <div class="z-50 text-left ml-8">
          <!-- Song Info -->
          <div class="text-3xl font-bold">{{ song.modified_name }}</div>
          <div>{{ song.genre }}</div>
        </div>
      </div>
    </section>
    <!-- Form -->
    <section class="container mx-auto mt-6">
      <div class="bg-white rounded border border-gray-200 relative flex flex-col">
        <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
          <!-- Comment Count -->
          <span class="card-title">Comments ({{ song.comment_count }})</span>
          <i class="fa fa-comments float-right text-green-400 text-2xl"></i>
        </div>
        <div class="p-6">
          <div class="text-white text-center font-bold p-5 mb-4"
            v-if="comment_show_alert" :class="comment_alert_variant">
            {{ comment_alert_msg }}
          </div>
          <VeeForm :validation-schema="valSchema"  @submit="addComment" v-if="userLoggedIn" >
            <VeeField as="textarea" name="comment"
              class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
                duration-500 focus:outline-none focus:border-black rounded mb-4"
              placeholder="Your comment here..."></VeeField>
            <ErrorMessage class="text-red-600" name="comment" />
            <button type="submit" class="py-1.5 px-3 rounded text-white bg-green-600 block"
               :disabled="comment_in_submission" >
              Submit
            </button>
          </VeeForm>
          <!-- Sort Comments -->
          <select v-model="sort"
            class="block mt-4 py-1.5 px-3 text-gray-800 border border-gray-300 transition
            duration-500 focus:outline-none focus:border-black rounded">
            <option value="1">Most Recent</option>
            <option value="2">Oldest</option>
          </select>
        </div>
      </div>
    </section>
    <!-- Comments -->
    <ul class="container mx-auto">
      <li class="p-6 bg-gray-50 border border-gray-200" v-for="comment in sortedComments"
        :key="comment.docID">
        <!-- Comment Author -->
        <div class="mb-5">
          <div class="font-bold">{{ comment.name }}</div>
          <time>{{ comment.datePosted }}</time>
        </div>
        <p>
           {{ comment.content }}
        </p>
      </li>
    </ul>
  </div>
</template>

<script>
import { songsCollection, auth, commentsCollection } from '@/includes/firebase';
import { mapState, mapActions } from 'vuex';

export default {
  name: 'SongDetails',
  data() {
    return {
    song: {},
    comments: [],
    sort: '1',
    valSchema: {
      comment: 'required|min:3|max:2000',
    },
    comment_in_submission: false,
    comment_show_alert: false,
    comment_alert_variant: 'bg-blue-500',
    comment_alert_msg: '',
    }
  },
  computed: {
    ...mapState(['userLoggedIn']),
    sortedComments() {
      // .sort() will directly change the array it's called on (stored in data()), we can't allow this to happen
      // that is why we apply .slice() first, to create a new array and sort that new one, without changing the original
      return this.comments.slice().sort((a, b) => {
        // '1' represents a descending order - newest to oldest.
        if( this.sort === '1') {
          // we're converting a string, representing Date, stored in firebase into actual date,
          // because it is not possible to store the actual Date in firebase,
          // we had to convert it into string earlier
          return new Date(b.datePosted) - new Date(a.datePosted);
        } else {
          return new Date(a.datePosted) - new Date(b.datePosted);
        }
      });
    },
  },
  methods: {
    ...mapActions(['newSong']),
    // VeeValidate passes a set of functions to our submission handler for the second argument
    // this second argument is optional. We can accept argument called context.
    // the xontext object contains methods and properties about our form, we can use it to reset the form
    // we only need the 'resetForm' function off the 'context' object, so we will de-structure it:
    async addComment(values, { resetForm }) {
        this.comment_show_alert = true;
        this.comment_in_submission = true;
        this.comment_alert_variant = 'bg-blue-500';
        this.comment_alert_msg = 'Please wait! Your comment is being submitted.';

        const comment = {
          content: values.comment,
          datePosted: new Date().toString(),
          sid: this.$route.params.id,
          name: auth.currentUser.displayName,
          uid: auth.currentUser.uid,
        }

        await commentsCollection.add(comment);

        // updating the comment_count on the 'song' item in the database
        this.song.comment_count += 1;
        await songsCollection.doc(this.$route.params.id).update({
          comment_count: this.song.comment_count,
        });

        this.getComments();
        
        this.comment_in_submission = false;
        this.comment_alert_variant = 'bg-green-500';
        this.comment_alert_msg = 'Comment added. Thank you!';

        resetForm();
    },
    async getComments() {
      const commentsSnapshots = await commentsCollection
        .where( 'sid', '==', this.$route.params.id )
        .get();

      // here, we're re-setting the comments array in data() to make sure we don't have duplicate comments
      this.comments = []; 
      
      commentsSnapshots.forEach((doc) => {
        this.comments.push({
          docID: doc.id,
          ...doc.data(),
        })
      });
    },
  },
  watch: {
    sort( newVal ) {
      if (newVal === this.$route.query.sort) {
        return;
      }
      // we are watching the 'sort' parameter in this component's data(),
      // whenever the value of 'sort' changes, we're updating the url with query parameters
      // the push() metods accepts an object with changes we'd like to make to the current route
      // it's the same object we would pass to the 'to' property of a 'router-link' component
      // in this object we can define the query property to add query parameters
      this.$router.push({
        query: {
          sort: newVal,
        }
      });
    },
  },
  async created() {
    const docSnapshot = await songsCollection.doc(this.$route.params.id).get();
    
    // firebase will continue returning snapshot of a document, even if document doesn't exist in the database
    // we need to check if the document exists, using document snapshot and .exists function
    // if the document doesn't exist, we want to navifate the user away from the page
    if(!docSnapshot.exists) {
      this.$router.push({ name: 'home' });
      return;
    }
    
    // we can use this lifecycle function to check if there is a query parameter in the url
    // if there is one, we'll apply the value to the 'sort' data() property of this component
    const { sort } = this.$route.query;

    this.sort = (sort === '1' || sort === '2') ? sort : '1';
 
    this.song = docSnapshot.data();
    this.getComments();
  }
}
</script>

