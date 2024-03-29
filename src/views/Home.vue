<template>
  <b-container class="home">
    <b-button @click="showIntroduction"><BIconCollectionPlay /> Show introduction tour</b-button>

    <p>Interested in growing mixtures but not sure what to expect? The crop mixtures data explorer (working title) will show you crop yields and other data from intercrop trials on commercial and research farms across Scotland.</p>
    <p>Simply type a search term into the 'Filter' box below, such as a crop species, tillage or management type that interests you. The datasets for those mixtures will be shown in the table – click on the icons in the table to find out more information for each trial.</p>
    <p>The yield data for the selected trials are also shown on the map below the table, both for the mixture and for each crop in monoculture. Trials with larger bubbles have larger values of yield.</p>
    <p>The tabs on the map allow you to switch between different views, showing which trials used different types of management.</p>
    <p>Further below you can plot measurements against each other and colour code the results by farm type, soil tillage and other management actions. Simply select a metric in the drop-down list for each dimension and choose your preferred way of colour coding them.</p>

    <Tour :steps="tourSteps" :resetOnRouterNav="true" :hideBackButton="false" ref="tour" />

    <h1 class="mt-3">Dataset table</h1>
    <SiteTable :serverData="serverData" :categories="categories" @datasets-changed="updateMap" />
    <h1 class="mt-3">Dataset map</h1>
    <p>See the trial in real time - click on the camera icon</p>
    <SiteMap :serverData="serverData" :categories="categories" ref="map" />
    <h1 class="mt-3">Scatter plot</h1>
    <SiteScatter />

    <div class="mt-5">
      <p>We hope you find this resource useful. If you would like to compare your own crop mixture trials with the ones in this database, please enter the data using this simple online form: <a href="https://docs.google.com/forms/d/e/1FAIpQLSeN78LfA9006p_fJppHWn6ROL_q2zeBpH7_7sNyOnWK-L1I8A/viewform">Google Forms</a>.</p>
      <p>If you have any question, please get in touch with <a href="mailto:ali.karley@hutton.ac.uk">Ali Karley</a>.</p>
    </div>
  </b-container>
</template>

<script>
import SiteMap from '@/components/SiteMap'
import SiteTable from '@/components/SiteTable'
import SiteScatter from '@/components/SiteScatter'
import Tour from '@/components/Tour'

import { BIconCollectionPlay } from 'bootstrap-vue'

import api from '@/mixins/api'

export default {
  name: 'Home',
  components: {
    BIconCollectionPlay,
    SiteMap,
    SiteTable,
    SiteScatter,
    Tour
  },
  data: function () {
    return {
      serverData: null,
      variables: ['tillage', 'farmManagement', 'cropPurpose', 'monoYield']
    }
  },
  computed: {
    tourSteps: function () {
      return [{
        title: () => 'Welcome',
        text: () => 'Welcome to the crop mixtures data explorer (working title) will show you crop yields and other data from intercrop trials on commercial and research farms across Scotland.',
        target: () => '#main-navigation',
        position: 'bottom'
      }, {
        title: () => 'Data table',
        text: () => 'Simply type a search term into the \'Filter\' box below, such as a crop species, tillage or management type that interests you. The datasets for those mixtures will be shown in the table – click on the icons in the table to find out more information for each trial.',
        target: () => '#search',
        position: 'auto'
      }, {
        title: () => 'Dataset map',
        text: () => 'The yield data for the selected trials are also shown on the map below the table, both for the mixture and for each crop in monoculture. Trials with larger bubbles have larger values of yield.',
        target: () => '#map',
        position: 'auto'
      }, {
        title: () => 'Scatter plot',
        text: () => 'Further below you can plot measurements against each other and colour code the results by farm type, soil tillage and other management actions. Simply select a metric in the drop-down list for each dimension and choose your preferred way of colour coding them.',
        target: () => '#scatter-section',
        position: 'auto'
      }]
    },
    categories: function () {
      const result = {}
      if (this.serverData) {
        this.variables.forEach(v => {
          const set = new Set()
          this.serverData.forEach(dp => {
            if (v === 'monoYield') {
              if (dp.components) {
                dp.components.forEach(c => set.add(c.cropName.trim()))
              }
            } else {
              if (dp[v]) {
                set.add(dp[v])
              }
            }
          })

          const cats = Array.from(set)
          cats.sort()
          result[v] = cats
        })
      }
      return result
    }
  },
  mixins: [api],
  methods: {
    showIntroduction: function () {
      this.$refs.tour.start()
    },
    updateMap: function (ids) {
      if (this.$refs.map) {
        this.$refs.map.filterDatasets(ids)
      }
    }
  },
  created: function () {
    this.apiGetDatasets()
      .then(result => {
        if (result && result.data) {
          this.serverData = result.data
        } else {
          this.serverData = null
        }
      })
  }
}
</script>
