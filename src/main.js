import Vue from 'vue'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'
import { i18n } from '@/plugins/i18n.js'

import { Icon } from 'leaflet'

import {
  LayoutPlugin,
  ModalPlugin,
  DropdownPlugin,
  BVModalPlugin,
  NavbarPlugin,
  ImagePlugin,
  ButtonPlugin,
  ButtonGroupPlugin,
  FormPlugin,
  FormCheckboxPlugin,
  FormDatepickerPlugin,
  FormInputPlugin,
  FormGroupPlugin,
  FormRadioPlugin,
  CardPlugin,
  FormSelectPlugin,
  InputGroupPlugin,
  TooltipPlugin
} from 'bootstrap-vue'

Vue.use(LayoutPlugin)
Vue.use(ModalPlugin)
Vue.use(DropdownPlugin)
Vue.use(BVModalPlugin)
Vue.use(NavbarPlugin)
Vue.use(ImagePlugin)
Vue.use(ButtonPlugin)
Vue.use(ButtonGroupPlugin)
Vue.use(FormPlugin)
Vue.use(FormCheckboxPlugin)
Vue.use(FormDatepickerPlugin)
Vue.use(FormInputPlugin)
Vue.use(FormGroupPlugin)
Vue.use(FormRadioPlugin)
Vue.use(CardPlugin)
Vue.use(FormSelectPlugin)
Vue.use(InputGroupPlugin)
Vue.use(TooltipPlugin)

require('es6-promise/auto')

const axiosDefaults = require('axios/lib/defaults')

delete Icon.Default.prototype._getIconUrl
Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
})

// Set base URL based on environment
let baseUrl = './api/'

if (process.env.VUE_APP_BASE_URL) {
  baseUrl = process.env.VUE_APP_BASE_URL
}

axiosDefaults.baseURL = baseUrl

store.commit('ON_SERVER_URL_CHANGED', baseUrl)

Vue.use({
  install: function (Vue) {
    // Make custom plotly available
    Vue.prototype.$plotly = require('@/plugins/custom-plotly')
    window.Plotly = Vue.prototype.$plotly
  }
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
