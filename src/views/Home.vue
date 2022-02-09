<template>
  <div class="home">
    <SiteTable @datasets-changed="updateMap" />
    <SiteMap ref="map" />
  </div>
</template>

<script>
import SiteMap from '@/components/SiteMap'
import SiteTable from '@/components/SiteTable'

export default {
  name: 'Home',
  components: {
    SiteMap,
    SiteTable
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
