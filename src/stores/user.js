const SESSION_USER = "zosmf_user";

let username = "ST013";
try {
  username = JSON.parse(sessionStorage.getItem(SESSION_USER)).account;
} catch (error) {
  // ignore error
}

const state = {
  username
};

const getters = {
  isLogin(state) {
    return !!state.username;
  }
};

const mutations = {
  SET_USER(state, user) {
    sessionStorage.setItem(SESSION_USER, JSON.stringify(user));
    state.username = user.account;
  }
};

const actions = {
  login({ commit }, user) {
    commit("SET_USER", user);
  },

  logout({ commit }) {
    commit("SET_USER", {});
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
