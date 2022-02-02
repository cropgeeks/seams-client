import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

let name = process.env.VUE_APP_INSTANCE_NAME

if (!name) {
  name = 'seams-' + window.location.pathname
}

export default new Vuex.Store({
  state: {
    locale: 'en_GB',
    serverUrl: null
  },
  getters: {
    storeLocale: (state) => state.locale,
    storeServerUrl: (state) => state.serverUrl
  },
  mutations: {
    ON_LOCALE_CHANGED_MUTATION: function (state, newLocale) {
      state.locale = newLocale
    },
    ON_SERVER_URL_CHANGED: function (state, newServerUrl) {
      state.serverUrl = newServerUrl
    }
  },
  actions: {
    setLocale: function ({ commit }, locale) {
      commit('ON_LOCALE_CHANGED_MUTATION', locale)
    },
    setServerUrl: function ({ commit }, serverUrl) {
      commit('ON_SERVER_URL_CHANGED', serverUrl)
    }
  },
  modules: {
  },
  plugins: [createPersistedState({
    key: name
  })]
})
