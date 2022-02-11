<template>
  <div class="home">
    <h1 class="mt-3">Dataset table</h1>
    <SiteTable @datasets-changed="updateMap" />
    <h1 class="mt-3">Dataset map</h1>
    <SiteMap ref="map" />
    <h1 class="mt-3">Scatter plot</h1>
    <SiteScatter />
  </div>
</template>

<script>
import SiteMap from '@/components/SiteMap'
import SiteTable from '@/components/SiteTable'
import SiteScatter from '@/components/SiteScatter'

export default {
  name: 'Home',
  components: {
    SiteMap,
    SiteTable,
    SiteScatter
  },
  methods: {
    updateMap: function (ids) {
      if (this.$refs.map) {
        this.$refs.map.filterDatasets(ids)
      }
    }
  }
}
</script>
