import AboutView from '@/views/AboutView.vue';
import { shallowMount } from '@vue/test-utils';

describe('AboutView.vue', () => {
  test('renders inner text', () => {
    const wrapper = shallowMount(AboutView);

    // .text function, called on the wrapper object of the component will return all od the text inside of that component
    expect(wrapper.text()).toContain('about');
  });
});