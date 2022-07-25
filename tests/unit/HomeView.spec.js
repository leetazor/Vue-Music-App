import HomeView from '@/views/HomeView.vue';
import SongItem from '@/components/SongItem.vue';
import { shallowMount } from '@vue/test-utils';

jest.mock('@/includes/firebase', () => {});

describe('HomeView.vue', () => {

  test('renders list of songs', () => {
  
    const songs = [
      {}, {}, {},
    ];

    HomeView.methods.getSongs = () => false;
   
    const component = shallowMount(HomeView, {
      data() {
        return {
          songs,
        }
      }
    });

    // .findAllComponents() is similar to querySelectorAll() function,
    // it will return an array of components it finds inside the component it's being called on
    // it is specifically for selecting components, not regular HTML elements
    const items = component.findAllComponents(SongItem);

    expect(items).toHaveLength(songs.length);

    // here we're looping through the array of SongItem components to check if each sond corresponds to its index
    items.forEach((wrapper, i) => {
      expect(wrapper.props().song).toEqual(songs[i]);
    });
  });
});