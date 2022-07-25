import SongItem from '@/components/SongItem.vue';
import { shallowMount, RouterLinkStub } from '@vue/test-utils';

describe('SongItem.vue', () => {

  // tesing the component
  test('renders song.display_name', () => {

    // mock data object that we will pass down to the shallowMounted testing component
    const song = {
      display_name: 'test',
    };

    //second argument of the shallowMount function is an options object for the component
    // this argument will allow us to pass down data to the component
    const wrapper = shallowMount(SongItem, {
      propsData: {
        song,
      },
      // global property allows us to register global components, plugins and mixins
      global: {
        //we're registering a component by adding a 'components' object:
        components: {
          'router-link': RouterLinkStub,
        }
      },
    });
    const compositionAuhor = wrapper.find('.text-gray-500');
  
    expect(compositionAuhor.text()).toBe(song.display_name);
  });

  // testing the attribute
  test('renders song.docID in id attribute', () => {

    // mock data object that we will pass down to the shallowMounted testing component
    const song = {
      docID: 'abc',
    };

    // it is considered a safer practice to mount component in each test separately
    const wrapper = shallowMount(SongItem, {
      propsData: {
        song,
      },
      // global property allows us to register global components, plugins and mixins
      global: {
        //we're registering a component by adding a 'components' object:
        components: {
          'router-link': RouterLinkStub,
        }
      },
    });
    
    // the .attributes() function returns an object of attributes in the component
    // we can access any of the attributes in the object by their name
    expect(wrapper.attributes().id).toBe(`song-id-${song.docID}`);

    // testing 'class' attribute using .classes():
    // classes can be accessed through .attributes(), but they would be returned as a string
    // .classes() returnes a list of classes as an array
    expect(wrapper.classes()).toContain(`song-class-${song.docID}`);
  });
});