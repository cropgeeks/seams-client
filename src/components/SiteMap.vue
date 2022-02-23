<template>
  <div>
    <b-button-group class="color-options">
      <b-button :pressed="variable === 'ler'" @click="variable = 'ler'"><BIconPercent /> LER</b-button>
      <b-button :pressed="variable === 'yield'" @click="variable = 'yield'"><i class="icofont-tractor" /> Mixture yield</b-button>
      <b-button :pressed="variable === 'tillage'" @click="variable = 'tillage'"><i class="icon-tillage" /> Tillage</b-button>
      <b-button :pressed="variable === 'farmManagement'" @click="variable = 'farmManagement'"><i class="icon-farm-management" /> Farm management</b-button>
    </b-button-group>

    <LMap ref="locationMap" :bounds="bounds" @ready="loadMap" class="map">
      <LControl position="bottomleft" class="leaflet-control-layers" v-show="categories">
        <div class="p-2 legend">
          <div v-for="(category, index) in categories" :key="`color-mapping-${category}`">
            <BIconCircleFill :style="{ color: colors[index % colors.length] }" /> {{ category }}
          </div>
        </div>
      </LControl>

      <LCircleMarker v-for="location in locationData"
                     :radius="location.radius"
                     :weight="0.25"
                     :opacity="1"
                     color="#f5f6fa"
                     :fillOpacity="0.3"
                     :fillColor="location.color || '#EA2027'"
                     :tooltip="`${location.dataset.siteName}: ${location.value}`"
                     :key="`marker-${location.dataset.datasetId}`"
                     :latLng="[location.dataset.latitude, location.dataset.longitude]">
        <LPopup>
          <h3 class="d-flex justify-content-between">
            <span>{{ location.dataset.siteName }}</span>
            <span>
              <i class="icon-barley mx-1" v-if="location.dataset.componentNames && location.dataset.componentNames.includes('barley')" v-b-tooltip="'Barley'" />
              <i class="icon-beans mx-1" v-if="location.dataset.componentNames && location.dataset.componentNames.includes('beans')" v-b-tooltip="'Beans'" />
              <i class="icon-blueberry mx-1" v-if="location.dataset.componentNames && location.dataset.componentNames.includes('blueberry')" v-b-tooltip="'Blueberry'" />
              <i class="icon-clover mx-1" v-if="location.dataset.componentNames && location.dataset.componentNames.includes('clover')" v-b-tooltip="'Clover'" />
              <i class="icon-linseed mx-1" v-if="location.dataset.componentNames && location.dataset.componentNames.includes('linseed')" v-b-tooltip="'Linseed'" />
              <i class="icon-maize mx-1" v-if="location.dataset.componentNames && location.dataset.componentNames.includes('maize')" v-b-tooltip="'Maize'" />
              <i class="icon-oats mx-1" v-if="location.dataset.componentNames && location.dataset.componentNames.includes('oats')" v-b-tooltip="'Oats'" />
              <i class="icon-oilseed mx-1" v-if="location.dataset.componentNames && location.dataset.componentNames.includes('oilseed')" v-b-tooltip="'Oilseed'" />
              <i class="icon-peas mx-1" v-if="location.dataset.componentNames && location.dataset.componentNames.includes('peas')" v-b-tooltip="'Peas'" />
              <i class="icon-potato mx-1" v-if="location.dataset.componentNames && location.dataset.componentNames.includes('potato')" v-b-tooltip="'Potato'" />
              <i class="icon-raspberry mx-1" v-if="location.dataset.componentNames && location.dataset.componentNames.includes('raspberry')" v-b-tooltip="'Raspberry'" />
              <i class="icon-rye mx-1" v-if="location.dataset.componentNames && location.dataset.componentNames.includes('rye')" v-b-tooltip="'Rye'" />
              <i class="icon-strawberry mx-1" v-if="location.dataset.componentNames && location.dataset.componentNames.includes('strawberry')" v-b-tooltip="'Strawberry'" />
              <i class="icon-turnip mx-1" v-if="location.dataset.componentNames && location.dataset.componentNames.includes('turnip')" v-b-tooltip="'Turnip'" />
              <i class="icon-wheat mx-1" v-if="location.dataset.componentNames && location.dataset.componentNames.includes('wheat')" v-b-tooltip="'Wheat'" />
              <span class="icon-wheat mx-1" v-if="location.dataset.componentNames && location.dataset.componentNames.includes('vetch')" v-b-tooltip="'Vetch'">V</span>
            </span>
          </h3>

          <b-row>
            <b-col cols=12 md=4 class="mb-3">
              <b-card class="text-center h-100">
                <b-card-title><i class="icon-farm-management"/></b-card-title>
                <b-card-sub-title>Farm management</b-card-sub-title>
                <b-card-text>{{ location.dataset.farmManagement }}</b-card-text>
              </b-card>
            </b-col>
            <b-col cols=12 md=4 class="mb-3">
              <b-card class="text-center h-100">
                <b-card-title><i class="icon-tillage"/></b-card-title>
                <b-card-sub-title>Tillage</b-card-sub-title>
                <b-card-text>{{ location.dataset.tillage }}</b-card-text>
              </b-card>
            </b-col>
            <b-col cols=12 md=4 class="mb-3">
              <b-card class="text-center h-100">
                <b-card-title><i class="icon-fertilizer"/></b-card-title>
                <b-card-sub-title>Fertiliser</b-card-sub-title>
                <b-card-text>{{ location.dataset.fertilizer }}</b-card-text>
              </b-card>
            </b-col>
            <b-col cols=12 md=4 class="mb-3">
              <b-card class="text-center h-100">
                <b-card-title><i class="icon-weed-cover"/></b-card-title>
                <b-card-sub-title>Weed cover</b-card-sub-title>
                <b-card-text>{{ location.dataset.weedCover }}</b-card-text>
              </b-card>
            </b-col>
            <b-col cols=12 md=4 class="mb-3" v-if="location.dataset.sowingDate">
              <b-card class="text-center h-100">
                <b-card-title><i class="icon-sowing-date"/></b-card-title>
                <b-card-sub-title>Sowing date</b-card-sub-title>
                <b-card-text>{{ new Date(location.dataset.sowingDate).toLocaleDateString() }}</b-card-text>
              </b-card>
            </b-col>
            <b-col cols=12 md=4 class="mb-3" v-if="location.dataset.harvestDate">
              <b-card class="text-center h-100">
                <b-card-title><i class="icon-harvest-date"/></b-card-title>
                <b-card-sub-title>Harvest date</b-card-sub-title>
                <b-card-text>{{ new Date(location.dataset.harvestDate).toLocaleDateString() }}</b-card-text>
              </b-card>
            </b-col>
            <b-col cols=12 class="mb-3">
              <b-card class="text-center h-100">
                <b-card-title><i class="icon-value"/></b-card-title>
                <b-card-sub-title>{{ variable }}</b-card-sub-title>
                <b-card-text>{{ (typeof location.value === 'string') ? location.value : location.value.toFixed(2) }}</b-card-text>
              </b-card>
            </b-col>
          </b-row>
        </LPopup>
      </LCircleMarker>
    </LMap>
  </div>
</template>

<script>
import api from '@/mixins/api'
import L from 'leaflet'
import { LMap, LCircleMarker, LControl, LPopup } from 'vue2-leaflet'
import { BIconPercent, BIconCircleFill } from 'bootstrap-vue'

import 'leaflet/dist/leaflet.css'

export default {
  components: {
    LMap,
    LCircleMarker,
    LControl,
    LPopup,
    BIconPercent,
    BIconCircleFill
  },
  data: function () {
    return {
      serverData: null,
      variable: 'ler',
      filterDatasetIds: null,
      colors: ['#00a0f1', '#5ec418', '#910080', '#222183', '#ff7c00', '#c5e000', '#c83831', '#ff007a', '#fff600'],
      categories: null
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

        let cats = []

        if (this.variable === 'tillage' || this.variable === 'farmManagement') {
          const set = new Set()
          this.serverData.filter(s => s[this.variable])
            .forEach(t => set.add(t[this.variable].trim()))

          cats = Array.from(set)
          cats.sort()
        }

        const result = this.serverData
          .filter(s => this.filterDatasetIds ? this.filterDatasetIds.includes(s.datasetId) : true) // Restrict to filtered dataset ids (if any)
          .filter(s => s.latitude >= -90 && s.latitude <= 90 && s.longitude >= -180 && s.longitude < 180) // Restrict to valid lat/lng values
          .map(s => {
            let value = null
            let color = null

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
                color = this.colors[2]
              } else {
                value = 0
              }
            } else if (this.variable === 'yield') {
              const mixYield = s.data.find(d => d.componentIds.length === s.components.length && d.traitName === 'Yield')

              if (mixYield !== undefined) {
                value = mixYield.measurement
                color = this.colors[2]
              } else {
                value = 0
              }
            } else if (this.variable === 'tillage' || this.variable === 'farmManagement') {
              // TODO
              value = s[this.variable]
              if (value) {
                color = this.colors[cats.indexOf(s[this.variable].trim()) % this.colors.length]
              }
            } else {
              value = s.componentIds ? s.componentIds.length : 0
            }

            if (value !== null && !(typeof value === 'string')) {
              min = Math.min(min, value)
              max = Math.max(max, value)
            }

            return {
              dataset: s,
              value: value,
              color: color
            }
          })

        // Normalize the values into the interval [0, 15]
        result.forEach(s => {
          if (typeof s.value === 'string') {
            s.radius = 15
          } else {
            if (s.value !== null) {
              s.radius = (s.value - min) * 15 / (max - min)
            } else {
              s.radius = 0
            }
          }
        })

        return result
          .filter(l => l.value)
      } else {
        return []
      }
    }
  },
  watch: {
    locationData: function () {
      if (this.variable === 'tillage' || this.variable === 'farmManagement') {
        const set = new Set()
        this.serverData.filter(s => s[this.variable])
          .forEach(t => set.add(t[this.variable].trim()))

        const cats = Array.from(set)
        cats.sort()
        this.categories = cats.concat()
      } else {
        this.categories = null
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
  height: 75vh;
}
</style>
<style>
.map .leaflet-popup-content-wrapper {
  border-radius: 0;
}
.map i,
.color-options i {
  width: 1.5em;
  height: 1.5em;
  display: inline-block;
  background-size: 1.5em 1.5em;
  background-repeat: no-repeat;
  vertical-align: middle;
}
.map .leaflet-popup-content {
  max-width: 60vw;
  width: 700px !important;
}

</style>
