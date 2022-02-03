<template>
  <div>
    <LMap :zoom="3" ref="locationMap" @ready="loadMap" class="map">
      <LCircleMarker v-for="location in locationData"
                     :radius="location.value"
                     :stroke="false"
                     :opacity="1"
                     :fillOpacity="0.5"
                     fillColor="fuchsia"
                     :key="`marker-${location.dataset.datasetId}`"
                     :latLng="[location.dataset.latitude, location.dataset.longitude]">
        <LPopup>
          {{ location.dataset.siteName }}
        </LPopup>
      </LCircleMarker>
    </LMap>
  </div>
</template>

<script>
import api from '@/mixins/api'
import L from 'leaflet'
import { LMap, LCircleMarker, LPopup } from 'vue2-leaflet'

import 'leaflet/dist/leaflet.css'

export default {
  components: {
    LMap,
    LCircleMarker,
    LPopup
  },
  data: function () {
    return {
      serverData: null,
      cropName: 'Maize'
    }
  },
  computed: {
    locationData: function () {
      if (this.serverData) {
        return this.serverData.filter(s => this.cropName === null || (s.componentData && s.componentData.some(c => c.component.cropName === this.cropName)))
          .map(s => {
            return {
              dataset: s,
              value: s.componentIds ? s.componentIds.length : 0
            }
          })
      } else {
        return []
      }
    }
  },
  mixins: [api],
  methods: {
    loadMap: function () {
      // Add OSM as the default
      const openstreetmap = L.tileLayer('//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        id: 'OpenStreetMap',
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        subdomains: ['a', 'b', 'c'],
        maxZoom: 21,
        maxNativeZoom: 19
      })

      const map = this.$refs.locationMap.mapObject
      map.addLayer(openstreetmap)

      // Add an additional satellite layer
      const satellite = L.tileLayer('//server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        id: 'Esri WorldImagery',
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
        maxZoom: 21,
        maxNativeZoom: 19
      })

      const baseMaps = {
        OpenStreetMap: openstreetmap,
        'Esri WorldImagery': satellite
      }

      L.control.layers(baseMaps).addTo(map)
    }
  },
  mounted: function () {
    this.apiGetData()
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

<style scoped>
.map {
  height: 500px;
}
</style>
<style>
.map .leaflet-popup-content-wrapper {
  border-radius: 0;
}
</style>
