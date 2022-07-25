// it is recommended to create a fresh store instance for each test
// we don't have to mount a component to run a test - store can be tested in isolation
import { createStore } from 'vuex';
import auth from '@/store/modules/auth';
import player from '@/store/modules/player';
import { cloneDeep } from 'lodash';

jest.mock('@/includes/firebase', () => ({
  auth: {
    // here we're mocking firebase's signInWithEmailAndPassword, which returns a promise
    // we need to mock this promise:
    signInWithEmailAndPassword: () => Promise.resolve(),
  }
}));

describe('Vuex Store', () => {
  test('toggleAuth mutation sets userLoggedIn to true', () => {
    // we're cloning the auth module to have a fresh copy for this test and to keep it separate from other tests:
    const clonedAuth = cloneDeep(auth);

    const store = createStore({
      modules: {
        auth: clonedAuth,
      }
    });

    // this checks the default state of auth in the store
    expect(store.state.auth.userLoggedIn).not.toBe(true);
    // commit the mutation on the store
    store.commit('toggleAuth');
    // this checks the state after applying the above mutation
    expect(store.state.auth.userLoggedIn).toBe(true);
  });

  test('login action sets userLoggedIn to true', async () => {
    expect.assertions(2);

    const clonedAuth = cloneDeep(auth);

    const store = createStore({
      modules: {
        auth: clonedAuth,
      }
    });

    // this checks the default state of auth in the store
    expect(store.state.auth.userLoggedIn).toBe(false);
    // dispatching login action
    await store.dispatch('login', { email: '', password: ''});
    expect(store.state.auth.userLoggedIn).toBe(true);

  });

  // testing the 'playing' getter function
  test('playing retuns true if audio is playing', () => {
      // getters return value, we can easily mock the state to test the getter
      // the 'playing' getter returns the value of the state.sound.playing() fnction (which is either 'true' or 'false')
    const state = {
      sound: {
        playing: () => true,
      },
    };

    // we're passing our mocked state into the real getter from the 'player' module we've imported
    // we're assigning the value received from our getter to the 'result' variable
    const result = player.getters.playing(state);
    expect(result).toEqual(true);
  });
});