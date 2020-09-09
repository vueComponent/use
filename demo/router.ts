import { createRouter, createWebHashHistory } from 'vue-router';
import list from './componentList';
export default createRouter({
  history: createWebHashHistory(),
  strict: true,
  routes: [
    { path: '/home', redirect: '/' },
    ...list.map(componentName => {
      return {
        path: `/${componentName}`,
        component: () => import(`../src/${componentName}/__demo__/index.tsx`),
      };
    }),
  ],
});
