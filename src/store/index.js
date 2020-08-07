import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    pageSize: 8,
    username: sessionStorage.getItem('username') ? sessionStorage.getItem('username') : '',
    Authorization: sessionStorage.getItem('Authorization') ? sessionStorage.getItem('Authorization') : '',
    menuIdArr: sessionStorage.getItem('menuIdArr') ? sessionStorage.getItem('menuIdArr') : [],
    menuAddressArr: sessionStorage.getItem('menuAddressArr') ? sessionStorage.getItem('menuAddressArr') : []
  },
  mutations: {
    changeUsername(state,name){
      state.username = name;
      sessionStorage.setItem('username',name);
    },
    changeLogin (state, Authorization) {
      state.Authorization = Authorization;
      sessionStorage.setItem('Authorization', Authorization);
    },
    changeMenuIdArr(state, menuIdArr){
      state.menuIdArr = menuIdArr;
      sessionStorage.setItem('menuIdArr',menuIdArr);
    },
    changemenuAddressArr(state, menuAddressArr){
      state.menuAddressArr = menuAddressArr;
      sessionStorage.setItem('menuAddressArr',menuAddressArr);
    }
  },
  actions: {},
  modules: {}
});
