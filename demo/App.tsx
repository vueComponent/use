import { Component } from 'vue';
import list from './componentList';
export default {
  setup() {
    return () => (
      <>
        <div>
          {list.map(item => (
            <router-link to={'/' + item}>
              <span style="margin-right:15px">/{item}</span>
            </router-link>
          ))}
        </div>
        <hr />
        <router-view></router-view>
      </>
    );
  },
} as Component;
