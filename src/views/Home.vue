<template>
  <div class="home">
    <h1 class="mt-3">Dataset table</h1>
    <SiteTable :serverData="serverData" :categories="categories" @datasets-changed="updateMap" />
    <h1 class="mt-3">Dataset map</h1>
    <SiteMap :serverData="serverData" :categories="categories" ref="map" />
    <h1 class="mt-3">Scatter plot</h1>
    <SiteScatter />
  </div>
</template>

<script>
import SiteMap from '@/components/SiteMap'
import SiteTable from '@/components/SiteTable'
import SiteScatter from '@/components/SiteScatter'

import api from '@/mixins/api'

export default {
  name: 'Home',
  components: {
    SiteMap,
    SiteTable,
    SiteScatter
  },
  data: function () {
    return {
      serverData: null,
      variables: ['tillage', 'farmManagement', 'cropPurpose', 'monoYield']
    }
  },
  computed: {
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
