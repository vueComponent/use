import { createRouter, createWebHashHistory } from "vue-router";
import list from "./compoentList";
export default createRouter({
    history: createWebHashHistory(),
    strict: true,
    routes: [{ path: '/home', redirect: '/' },
    ...list.map((componentName) => {
        return {
            path: `/${componentName}`,
            component: () => import(`../packages/${componentName}/__demo__/index.tsx`),
        }
    }
    )
    ]
})