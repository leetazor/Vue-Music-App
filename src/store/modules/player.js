
// the 'Howl' object will be used to create a new audio object with methods and properties,
// we'll use it to log a new audio file and control it
// we will store it in the state under the 'sound' prop, to be able to control it (pause, play, stop)
import { Howl } from 'howler';
import timeFormatting from '@/includes/timeFormatting';

export default {
  state: {
    currentSong: {},
    sound: {},
    seek: '00:00',
    duration: '00:00',
    playerProgress: '0%',
  },
  getters: {
    // getAuthModalShow: (state) => state.authModalShow,
    playing: (state) => {
      // check if the 'playing' function is present on the sound object in the state
      // 'playing' is a function that is present on the 'Howl' object
      // if the function is present, we return the value of that function 
      if(state.sound.playing) {
        return state.sound.playing();
      } 
      // if playing() is not present, it's safe to assume that the sound is not playing and return false
      return false;
    },
  },
  mutations: {
    newSong(state, song) {
      state.currentSong = song;
      // creating a new instance of the Howl object and assigning the value that is returned to the 'sound' state
      state.sound = new Howl({
        src: [song.url],
        html5: true,
      });
    },
    updatePosition(state) {
      // the seek() function (off the Howl object) will return the current position of the audio being played
      state.seek = timeFormatting.formatTime(state.sound.seek());
      // the duration() function will behave similar to the above seek() function
      state.duration = timeFormatting.formatTime(state.sound.duration());

      state.playerProgress = `${(state.sound.seek() / state.sound.duration()) * 100}%`;
    },
  },
  actions: {
    async newSong({ commit, state, dispatch }, song) {
      if (state.sound instanceof Howl) {
        // the 'unload' function will pause the current audio.
        // It will also delete the instance and remove it from memory.
        state.sound.unload();
      }
      // commit a mutation that will create a new instance of the 'Howl' object
      // for the sond we want to play and assign it to the 'sound' property in the state
      commit('newSong', song);
      
      // play the song
      state.sound.play();
      
      // we're listening to an event 'play' emittied by Howler when sound file starts playing
      state.sound.on('play', () => {
        // requestAnimationFrame() will execute a function passed into it
        // it is similar to the setInterval() function, except the function gets called before
        // the next frame gets painted onto the screen
        requestAnimationFrame(() => {
          dispatch('progress');
        });
      });
    },
    async toggleAudio( { state } ) {
      // we're checking if the 'playing' function is defined in the state's 'sound' object
      // if is it, this means we have a Howl object and not an empty state object
      if(!state.sound.playing) {
        return;
      }
      // this conditional statement invokes the 'playing' function, 
      // which, in turn, will check if the audio is playing
      // playing(), play() and pause() are functions from the Howl object
      if(state.sound.playing()) {
        state.sound.pause();
      } else {
        state.sound.play();
      }

    },  
    // by default, Vuew will always pass the event object onto the funtion it called when an event is emitted
    updateSeek({ state, dispatch }, event ) {
      if(!state.sound.playing) {
        return;
      }
      
      // currenTarget will always return the element the event listener is added to
      // getBoundingClientRect() function will return info about the current element's coordinates and dimensions
      // we will de-structure the property 'x' from the object returned
      // the 'x' property represents the distance from the left side of the document to the left side of the player
      // we also need to pull off the 'width' of the player
      const { x, width } = event.currentTarget.getBoundingClientRect();

      // clientX is not reliable alone, because it grabs the coordinates relative to the document, not the player
      // so we need to use it with the above 
      const clickX = event.clientX - x;
      const percentage = clickX / width;
      const seconds = state.sound.duration() * percentage;

      state.sound.seek(seconds);

      // 'once' function will listen for an event
      // if the event is emitted, it will run the callback function, passed into it
      // this callback function will only run once
      // here, we're listening for the event named 'seek', Howler will emit it when the audio has oficially changed position
      state.sound.once('seek', () => {
        dispatch('progress');
      });
    },
    progress({ commit, state, dispatch }) {
      commit('updatePosition');
      // we need to recursively call the requestAnimationFrame() to dispatch the 'progress' action,
      // to keep animating the playing progress
      // first, we need to check if the sound is still playing:
      if(state.sound.playing()) {
        requestAnimationFrame(() => {
          dispatch('progress');
        });
      }      
    },
  }
}