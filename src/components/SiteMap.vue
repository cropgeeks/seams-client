<template>
  <div>
    <b-button-group>
      <b-button :pressed="variable === 'ler'" @click="variable = 'ler'"><BIconPercent /> LER</b-button>
      <b-button :pressed="variable === 'yield'" @click="variable = 'yield'"><i class="icofont-tractor" /> Yield</b-button>
      <b-button :pressed="variable === 'sowingRate'" @click="variable = 'sowingRate'"><i class="icofont-cement-mix" /> Sowing rate</b-button>
    </b-button-group>

    <LMap ref="locationMap" :bounds="bounds" @ready="loadMap" class="map">
      <LCircleMarker v-for="location in locationData"
                     :radius="location.radius"
                     :weight="0.25"
                     :opacity="1"
                     color="white"
                     :fillOpacity="0.3"
                     fillColor="#EA2027"
                     :key="`marker-${location.dataset.datasetId}`"
                     :latLng="[location.dataset.latitude, location.dataset.longitude]">
        <LPopup>
          <p>{{ location.dataset.siteName }}</p>
          <p>{{ variable }}: {{ location.value.toFixed(2) }}</p>
        </LPopup>
      </LCircleMarker>
    </LMap>
  </div>
</template>

<script>
import api from '@/mixins/api'
import L from 'leaflet'
import { LMap, LCircleMarker, LPopup } from 'vue2-leaflet'
import { BIconPercent } from 'bootstrap-vue'

import 'leaflet/dist/leaflet.css'

export default {
  components: {
    LMap,
    LCircleMarker,
    LPopup,
    BIconPercent
  },
  data: function () {
    return {
      serverData: null,
      variable: 'ler',
      filterDatasetIds: null
    }
  },
  computed: {
    bounds: function () {
      const b = L.latLngBounds()

      this.locationData.forEach(l => b.extend([l.dataset.latitude, l.dataset.longitude]))

      if (b.isValid()) {
        return b.pad(0.1)
      } else {
        return null
      }
    },
    locationData: function () {
      if (this.serverData) {
        let max = 0
        let min = 0
        const result = this.serverData
          .filter(s => this.filterDatasetIds ? this.filterDatasetIds.includes(s.datasetId) : true) // Restrict to filtered dataset ids (if any)
          .filter(s => s.latitude >= -90 && s.latitude <= 90 && s.longitude >= -180 && s.longitude < 180) // Restrict to valid lat/lng values
          .map(s => {
            let value = null

            if (this.variable === 'ler') {
              // Calculate the LER
              if (s.data && s.components) {
                // Reduce across all components by summing up
                value = s.components.map(c => {
                  // Get their yield inside the monoculture and mixture
                  const monoYield = s.data.find(d => d.componentIds && d.componentIds.length === 1 && d.componentIds.includes(c.id) && d.measurementType === 'mono' && d.traitName === 'Yield')
                  const mixYield = s.data.find(d => d.componentIds && d.componentIds.length === 1 && d.componentIds.includes(c.id) && d.measurementType === 'mix' && d.traitName === 'Yield')

                  if (monoYield !== undefined && mixYield !== undefined) {
                    // If both are defined, return the ratio
                    return mixYield.measurement / monoYield.measurement
                  } else {
                    return null
                  }
                })
                  .filter(a => a !== null)
                  .reduce((a, b) => a + b, 0)
              } else {
                value = 0
              }
            } else if (this.variable === 'yield') {
              // TODO
              value = 100
            } else if (this.variable === 'sowingRate') {
              // TODO
              value = 100
            } else {
              value = s.componentIds ? s.componentIds.length : 0
            }

            if (value !== null) {
              min = Math.min(min, value)
              max = Math.max(max, value)
            }

            return {
              dataset: s,
              value: value
            }
          })

        // Normalize the values into the interval [0, 20]
        result.forEach(s => {
          if (s.value !== null) {
            s.radius = (s.value - min) * 20 / (max - min)
          } else {
            s.radius = 0
          }
        })

        return result
          .filter(l => l.value > 0)
      } else {
        return []
      }
    }
  },
  mixins: [api],
  methods: {
    filterDatasets: function (datasetIds) {
      this.filterDatasetIds = datasetIds
    },
    loadMap: function () {
      // Add OSM as the default
      const openstreetmap = L.tileLayer('//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        id: 'OpenStreetMap',
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        subdomains: ['a', 'b', 'c'],
        maxZoom: 14,
        maxNativeZoom: 18
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
