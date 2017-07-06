import Vue from 'vue';
import VueRouter from 'vue-router';
import Hello from '~/components/Hello';
import HelloJSX from '~/components/HelloJSX';

Vue.use(VueRouter);

export default new VueRouter({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello
    },
    {
      path: '/jsx',
      name: 'HelloJSX',
      component: HelloJSX
    }
  ]
});
