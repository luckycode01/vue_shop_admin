import { login, logout, getInfo } from "@/api/userManage/user";
import {
  getToken,
  setToken,
  removeToken,
  setUsername,
  getUsername,
  removeUsername
} from "@/utils/auth";
import { resetRouter } from "@/router";
import router from "@/router";

const getDefaultState = () => {
  return {
    token: getToken(),
    name: "",
    avatar: "",
    routes: []
  };
};

const state = getDefaultState();

const mutations = {
  RESET_STATE: state => {
    Object.assign(state, getDefaultState());
  },
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_NAME: (state, name) => {
    state.name = name;
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar;
  }
};

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo;
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password })
        .then(response => {
          if (response.meta.status != 200) reject(response);
          else {
            const { data } = response;
            commit("SET_TOKEN", data.token);
            commit("SET_NAME", data.username);
            setToken(data.token);
            setUsername(data.username);
            resolve(response);
          }
        })
        .catch(error => {
          reject(error);
        });
    });
  },

  // // get user info
  // getInfo({ commit, state }) {
  //   return new Promise((resolve, reject) => {
  //     getInfo(state.token)
  //       .then(response => {
  //         const { data } = response;

  //         if (!data) {
  //           return reject("Verification failed, please Login again.");
  //         }

  //         const { name, avatar } = data;

  //         commit("SET_NAME", name);
  //         commit("SET_AVATAR", avatar);
  //         resolve(data);
  //       })
  //       .catch(error => {
  //         reject(error);
  //       });
  //   });
  // },

  // // user logout
  // logout({ commit, state }) {
  //   return new Promise((resolve, reject) => {
  //     logout(state.token)
  //       .then(() => {
  //         removeToken(); // must remove  token  first
  //         resetRouter();
  //         commit("RESET_STATE");
  //         resolve();
  //       })
  //       .catch(error => {
  //         reject(error);
  //       });
  //   });
  // },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken(); // must remove  token  first
      commit("RESET_STATE");
      resolve();
    });
  },
  resetUsername({ commit }) {
    return new Promise(resolve => {
      removeUsername(); //移除本地存储用户信息
      commit("SET_NAME");
      resolve();
    });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
