<template>
  <div>
    <template v-if="serverData && categories">
      <b-button-group class="color-options flex-wrap">
        <!-- Variable options. Use object to generate a button for each key. Use component icon or class icon -->
        <b-button :pressed="variable === key" @click="variable = key" v-for="(value, key) in variables" :key="`variable-${key}`">
          <i :class="value.class" />
          {{ value.text }}
        </b-button>
      </b-button-group>

      <LMap ref="locationMap" :bounds="bounds" @ready="loadMap" class="map" id="map">
        <LControl position="bottomleft" class="leaflet-control-layers" v-if="categories && variable && categories[variable]">
          <div class="p-2 legend">
            <div v-for="(category, index) in categories[variable]" :key="`color-mapping-${category}`">
              <BIconCircleFill :style="{ color: colors[index % colors.length] }" /> {{ category }}
            </div>
          </div>
        </LControl>

        <div v-if="cameras && cameras.length > 0">
          <LMarker v-for="camera in cameras" :key="`camera-${camera.rid}`" :latLng="[camera.lat, camera.lng]" :icon="cameraIcon" :options="{ title: camera.name }" @click="showCamera(camera)" />
        </div>

        <div v-if="locationData && variable && locationData[variable]">
          <LCircleMarker v-for="location in locationData[variable]"
                        :radius="location.radius"
                        :weight="0.25"
                        :opacity="1"
                        color="#f5f6fa"
                        :fillOpacity="0.5"
                        :fillColor="location.color || '#EA2027'"
                        :tooltip="`${location.dataset.siteName}: ${location.value}`"
                        :key="`marker-${location.id}`"
                        :latLng="[location.lat, location.lng]">
            <LPopup>
              <h3 class="d-flex justify-content-between">
                <span>{{ location.dataset.siteName }}</span>
                <span v-if="location.dataset.componentNames">
                  <i :class="`icon-${component ? component.toLowerCase() : null} mx-1`" v-for="(component, ci) in location.dataset.componentNames" :key="`dataset-${location.id}-${component}-${ci}`" />
                </span>
              </h3>

              <b-row>
                <b-col cols=12 md=3 class="mb-3">
                  <b-card class="text-center h-100">
                    <b-card-title><i class="icon-farm-management"/></b-card-title>
                    <b-card-sub-title>Farm management</b-card-sub-title>
                    <b-card-text>{{ location.dataset.farmManagement }}</b-card-text>
                  </b-card>
                </b-col>
                <b-col cols=12 md=3 class="mb-3">
                  <b-card class="text-center h-100">
                    <b-card-title><i class="icon-tillage"/></b-card-title>
                    <b-card-sub-title>Tillage</b-card-sub-title>
                    <b-card-text>{{ location.dataset.tillage }}</b-card-text>
                  </b-card>
                </b-col>
                <b-col cols=12 md=3 class="mb-3">
                  <b-card class="text-center h-100">
                    <b-card-title><i class="icon-fertilizer"/></b-card-title>
                    <b-card-sub-title>Fertiliser</b-card-sub-title>
                    <b-card-text>{{ location.dataset.fertilizer }}</b-card-text>
                  </b-card>
                </b-col>
                <b-col cols=12 md=3 class="mb-3">
                  <b-card class="text-center h-100">
                    <b-card-title><i class="icon-croppurpose"/></b-card-title>
                    <b-card-sub-title>Crop purpose</b-card-sub-title>
                    <b-card-text>{{ location.dataset.cropPurpose }}</b-card-text>
                  </b-card>
                </b-col>
                <b-col cols=12 md=3 class="mb-3">
                  <b-card class="text-center h-100">
                    <b-card-title><i class="icon-weed-cover"/></b-card-title>
                    <b-card-sub-title>Weed cover</b-card-sub-title>
                    <b-card-text>{{ location.dataset.weedCover }}</b-card-text>
                  </b-card>
                </b-col>
                <b-col cols=12 md=3 class="mb-3" v-if="location.dataset.sowingDate">
                  <b-card class="text-center h-100">
                    <b-card-title><i class="icon-sowing-date"/></b-card-title>
                    <b-card-sub-title>Sowing date</b-card-sub-title>
                    <b-card-text>{{ new Date(location.dataset.sowingDate).toLocaleDateString() }}</b-card-text>
                  </b-card>
                </b-col>
                <b-col cols=12 md=3 class="mb-3" v-if="location.dataset.harvestDate">
                  <b-card class="text-center h-100">
                    <b-card-title><i class="icon-harvest-date"/></b-card-title>
                    <b-card-sub-title>Harvest date</b-card-sub-title>
                    <b-card-text>{{ new Date(location.dataset.harvestDate).toLocaleDateString() }}</b-card-text>
                  </b-card>
                </b-col>
                <b-col cols=12 md=3 class="mb-3" v-if="['ler', 'monoYield', 'mixYield'].includes(variable)">
                  <b-card class="text-center h-100">
                    <b-card-title><i class="icon-value"/></b-card-title>
                    <b-card-sub-title>{{ variables[variable].text }}</b-card-sub-title>
                    <b-card-text>{{ (typeof location.value === 'string') ? location.value : location.value.toFixed(2) }}</b-card-text>
                  </b-card>
                </b-col>
              </b-row>
            </LPopup>
          </LCircleMarker>
        </div>
        <LMarker :lat-lng="[57, -3.5]" v-else>
          <LIcon :icon-size="[400, 200]" :icon-anchor="[200, 100]">
            <div class="no-data-marker d-flex text-white justify-content-center align-items-center">
              <h1>No data found</h1>
            </div>
          </LIcon>
        </LMarker>
      </LMap>
    </template>
    <LoadingIndicator v-else />

    <b-modal size="xl" ref="cameraModal" v-if="selectedCamera" @hidden="() => { selectedCamera = null }" :title="selectedCamera.name" ok-only>
      <div class="text-center">
        <p v-if="selectedCamera.at">{{ new Date(selectedCamera.at).toLocaleString() }}</p>
        <ImageZoom :regular="cameraImageUrl" img-class="img-fluid w-100" click-zoom />
      </div>
    </b-modal>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import api from '@/mixins/api'
import L from 'leaflet'
import { LMap, LCircleMarker, LControl, LPopup, LIcon, LMarker } from 'vue2-leaflet'
import { BIconCircleFill } from 'bootstrap-vue'
import LoadingIndicator from '@/components/LoadingIndicator'
import 'leaflet/dist/leaflet.css'
import ImageZoom from 'vue-image-zoomer'

export default {
  components: {
    LMap,
    LCircleMarker,
    LControl,
    LIcon,
    LMarker,
    LPopup,
    BIconCircleFill,
    LoadingIndicator,
    ImageZoom
  },
  props: {
    serverData: {
      type: Array,
      default: () => null
    },
    categories: {
      type: Object,
      default: () => {}
    }
  },
  data: function () {
    return {
      noDataOptions: {
        html: "<a href='#'>TEST</a>"
      },
      variable: 'mixYield',
      filterDatasetIds: null,
      locationData: null,
      cameras: [],
      selectedCamera: null,
      variables: {
        ler: { text: 'LER', class: 'icon-ler' },
        mixYield: { text: 'Mixture yield', class: 'icon-mixture' },
        monoYield: { text: 'Monoculture yield', class: 'icon-monoculture' },
        tillage: { text: 'Tillage', class: 'icon-tillage' },
        farmManagement: { text: 'Farm management', class: 'icon-farm-management' },
        cropPurpose: { text: 'Crop purpose', class: 'icon-croppurpose' }
      },
      cameraIcon: L.divIcon({
        html: '<span class="camera-icon"><svg style="width:24px;height:24px" viewBox="0 0 24 24"><path fill="currentColor" d="M12,10.8A3.2,3.2 0 0,1 15.2,14A3.2,3.2 0 0,1 12,17.2A3.2,3.2 0 0,1 8.8,14A3.2,3.2 0 0,1 12,10.8M16,3.33V2A6,6 0 0,1 22,8H20.67C20.67,5.42 18.58,3.33 16,3.33M16,6V4.67C17.84,4.67 19.33,6.16 19.33,8H18C18,6.89 17.11,6 16,6M17,9H22V20A2,2 0 0,1 20,22H4A2,2 0 0,1 2,20V8A2,2 0 0,1 4,6H7.17L9,4H15V7C16.11,7 17,7.89 17,9M12,19A5,5 0 0,0 17,14A5,5 0 0,0 12,9A5,5 0 0,0 7,14A5,5 0 0,0 12,19Z" /></svg></span>',
        iconSize: [24, 24],
        iconAnchor: [12, 24]
      })
    }
  },
  computed: {
    ...mapGetters([
      'storeServerUrl'
    ]),
    cameraImageUrl: function () {
      if (this.selectedCamera) {
        return `${this.storeServerUrl}camera/${encodeURIComponent(this.selectedCamera.rid)}/img/${this.selectedCamera.imgSrc}`
      } else {
        return null
      }
    },
    bounds: function () {
      const b = L.latLngBounds()

      if (this.locationData && this.variable && this.locationData[this.variable]) {
        this.locationData[this.variable].forEach(l => b.extend([l.dataset.latitude, l.dataset.longitude]))
      }

      if (b.isValid()) {
        return b.pad(0.1)
      } else {
        b.extend([54.604746, -7.671065])
        b.extend([60.863213, -7.671065])
        b.extend([54.604746, -0.733540])
        b.extend([60.863213, -0.733540])
        return b.pad(0.1)
      }
    }
  },
  watch: {
    serverData: function () {
      this.update()
    },
    filterDatasetIds: function () {
      this.update()
    }
  },
  mixins: [api],
  methods: {
    showCamera: function (camera) {
      this.selectedCamera = camera

      this.$nextTick(() => this.$refs.cameraModal.show())
    },
    update: function () {
      if (this.serverData && this.categories) {
        const mapping = {}
        Object.keys(this.variables).forEach(variableKey => {
          let max = 0
          let min = 0

          const filteredData = this.serverData
            .filter(s => this.filterDatasetIds ? this.filterDatasetIds.includes(s.datasetId) : true) // Restrict to filtered dataset ids (if any)
            .filter(s => s.latitude >= -90 && s.latitude <= 90 && s.longitude >= -180 && s.longitude < 180) // Restrict to valid lat/lng values

          let result = []

          filteredData.forEach(s => {
            const addValue = (value, color, dataset, lat, lng) => {
              result.push({
                lat: lat,
                lng: lng,
                dataset: dataset,
                value: value,
                color: color,
                id: this.uuidv4()
              })

              if (value !== null && !(typeof value === 'string')) {
                min = Math.min(min, value)
                max = Math.max(max, value)
              }
            }

            if (variableKey === 'ler') {
              // Calculate the LER
              if (s.data && s.components) {
                // Reduce across all components by summing up
                const value = s.components.map(c => {
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

                addValue(value, this.colors[2], s, s.latitude, s.longitude)
              } else {
                addValue(0, null, s, s.latitude, s.longitude)
              }
            } else if (variableKey === 'mixYield') {
              const mixYield = s.data.find(d => d.componentIds.length === s.components.length && d.traitName === 'Yield')

              if (mixYield !== undefined) {
                addValue(mixYield.measurement, this.colors[2], s, s.latitude, s.longitude)
              } else {
                addValue(null, null, s, s.latitude, s.longitude)
              }
            } else if (variableKey === 'monoYield') {
              if (s.data && s.components) {
                const dataPoints = s.components.map(c => {
                  return s.data.find(d => d.componentIds && d.componentIds.length === 1 && d.componentIds.includes(c.id) && d.measurementType === 'mono' && d.traitName === 'Yield')
                }).filter(c => c !== undefined && c !== null)

                if (dataPoints && dataPoints.length > 0) {
                  const coords = this.getCoordinatesOnCircle({
                    latitude: s.latitude,
                    longitude: s.longitude
                  }, 250, dataPoints.length)

                  dataPoints.forEach((dp, index) => {
                    addValue(dp.measurement, this.colors[this.categories.monoYield.indexOf(s.components.find(c => c.id === dp.componentIds[0]).cropName.trim()) % this.colors.length], s, coords[index].latitude, coords[index].longitude)
                  })
                }
              }
            } else if (variableKey === 'tillage' || variableKey === 'farmManagement' || variableKey === 'cropPurpose') {
              const value = s[variableKey]
              if (value) {
                addValue(value, this.colors[this.categories[variableKey].indexOf(s[variableKey].trim()) % this.colors.length], s, s.latitude, s.longitude)
              } else {
                addValue(value, null, s, s.latitude, s.longitude)
              }
            } else {
              addValue(s.componentIds ? s.componentIds.length : 0, null, s, s.latitude, s.longitude)
            }
          })

          // Normalize the values into the interval [10, 25]
          result.forEach(s => {
            if (typeof s.value === 'string') {
              s.radius = 25
            } else {
              if (s.value !== null) {
                s.radius = 10 + (s.value - min) * (25 - 10) / (max - min)
              } else {
                s.radius = 0
              }
            }
          })

          result = result.filter(l => l.value)
          Object.freeze(result)
          mapping[variableKey] = result
        })

        Object.freeze(mapping)
        this.locationData = mapping
      } else {
        return {}
      }
    },
    /**
     * Generates a v4 UUID
     */
    uuidv4: function () {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0
        const v = c === 'x' ? r : (r & 0x3 | 0x8)
        return v.toString(16)
      })
    },
    getCoordinatesOnCircle: function (center, radius, count) {
      const latRadian = center.latitude * Math.PI / 180
      const lngRadian = center.longitude * Math.PI / 180

      const distance = (radius / 1000) / 6371 // km

      return Array(count).fill(0).map((n, i) => this.getCoordinate(latRadian, lngRadian, 360.0 / count * i * Math.PI / 180.0, distance))
    },
    getCoordinate: function (latitude, longitude, bearing, distance) {
      const lat2 = Math.asin(Math.sin(latitude) * Math.cos(distance) + Math.cos(latitude) * Math.sin(distance) * Math.cos(bearing))
      let lon2 = longitude + Math.atan2(Math.sin(bearing) * Math.sin(distance) * Math.cos(latitude), Math.cos(distance) - Math.sin(latitude) * Math.sin(lat2))
      lon2 = (lon2 + 3 * Math.PI) % (2 * Math.PI) - Math.PI // Normalize to -180...+180
      return {
        latitude: lat2 * (180.0 / Math.PI),
        longitude: lon2 * (180.0 / Math.PI)
      }
    },
    filterDatasets: function (datasetIds) {
      this.filterDatasetIds = datasetIds
    },
    loadMap: function () {
      // Add OSM as the default
      const openstreetmap = L.tileLayer('//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        id: 'OpenStreetMap',
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        subdomains: ['a', 'b', 'c'],
        maxZoom: 16,
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

      // Disable zoom until focus gained, disable when blur
      map.scrollWheelZoom.disable()
      map.on('focus', () => map.scrollWheelZoom.enable())
      map.on('blur', () => map.scrollWheelZoom.disable())
    }
  },
  created: function () {
    this.apiGetCameras()
      .then(result => {
        if (result && result.data) {
          this.cameras = result.data
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
.leaflet-div-icon {
  background: transparent;
  border: 0;
}
.map .leaflet-popup-content-wrapper {
  border-radius: 0;
}
.map i,
.color-options i {
  width: 1.7em;
  height: 1.7em;
  display: inline-block;
  background-size: 1.7em 1.7em;
  background-repeat: no-repeat;
  vertical-align: top;
  -webkit-mask-size: 1.6em 1.6em;
  mask-size: 1.6em 1.6em;
  background-color: black;
}
.map .leaflet-popup-content {
  max-width: 60vw;
  width: 700px !important;
}
.map .no-data-marker {
  height: 200px;
  width: 400px;
  background-color: rgba(55, 58, 60, .75);
}
</style>
