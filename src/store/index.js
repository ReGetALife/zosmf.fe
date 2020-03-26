import Vue from "vue";
import Vuex from "vuex";

import user from "./modules/user";
import report from "./modules/report";
import lab from "./modules/lab";

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== "production";

export default new Vuex.Store({
  modules: {
    user,
    report,
    lab
  },
  strict: debug
});
