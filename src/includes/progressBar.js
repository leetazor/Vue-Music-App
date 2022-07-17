import NProgress from 'nprogress';

export default (router) => {
  router.beforeEach((to, from, next) => {
    NProgress.start();
    next();
  });
  
  // we're not invoking the function here. If we do - it will be called immediately.
  // we only need it to be called when the afterEach guard runs. The Vue Router will invoke the function at the appropriate time
  // unlike the other guards, afterEach guard is not provided a next() function
  router.afterEach(NProgress.done);
};