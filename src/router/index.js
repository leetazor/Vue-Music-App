import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import AboutView from '@/views/AboutView.vue';
import ManageView from '@/views/ManageView.vue';
import SongDetails from '@/views/SongDetails.vue';
import store from '@/store/store';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/about',
    name: 'about',
    component: AboutView,
  },
  {
    path: '/manage-music',
    name: 'manage',
    // alias: '/manage',
    meta: {
      requiresAuth: true,
    },
    component: ManageView,
    // beforeEnter: (to, from, next) => {
    //   console.log('Manage Route Guard');
    //   next();
    // },
  },
  // path redirection (better for SEO, than alias)
  {
    path: '/manage',
    redirect: { name: 'manage' },  
  },
  {
    path: '/song/:id',
    name: 'song',
    component: SongDetails,
  },
  //redirecting all paths that do not exist to the home page
  {
    path: '/:catchAll(.*)*',
    redirect: { name: 'home' }
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkExactActiveClass: 'text-yellow-500',
});

// route guard - prevents users from accessing a page if they don't have a persmission:
// the beforeEach moethod accepts 3 arguments - 'to, from, next'
// 'to' is an object that containt the info about where the user is navigating to
// 'from' is an object that containt the info about where the user is navigating from
// 'next' is a function. the router is not going to render the component until we've called this function
router.beforeEach((to, from, next) => {
 // console.log(to.matched);

  if (!to.matched.some((record) => record.meta.requiresAuth )) {
    next();
    return;
  }

  if (store.state.userLoggedIn) {
    next();
  } else {
    next({ name: 'home' });
  }

});

export default router;
