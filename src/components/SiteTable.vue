<template>
  <div>
    <template v-if="serverData && categories">
      <b-form-group label="Filter" label-for="search" class="mb-0">
        <b-input-group class="site-table-filter">
          <b-input id="search" type="search" :debounce="100" placeholder="Search (e.g. 'barley', 'legumes', 'plough' or 'organic')" v-model="filter" />
          <b-input-group-append is-text>
            <b-form-checkbox v-b-tooltip="'\'All\' requires ALL words in the search to occur in a dataset while \'Some\' requires at least one.'" switch v-model="isAnd">{{ isAnd ? 'All' : 'Some' }}</b-form-checkbox>
          </b-input-group-append>
        </b-input-group>
      </b-form-group>
      <b-table id="dataset-table"
              :items="serverData"
              :fields="columns"
              :filter="filter"
              :filter-function="filterTable"
              :per-page="perPage"
              :current-page="currentPage"
              @filtered="updateItemCount"
              table-class="position-relative"
              head-variant="dark"
              primary-key="datasetId"
              show-empty
              sort-null-last
              :sort-compare-options="{ numeric: true, ignorePunctuation: true }"
              responsive
              striped
              hover
              class="site-table" >
        <template #cell(location)="data">
          <BIconGeoAltFill v-b-tooltip="`${data.item.latitude.toFixed(2)}, ${data.item.longitude.toFixed(2)}`" v-if="data.item.latitude && data.item.longitude"/>
        </template>
        <template #cell(components)="data">
          <div class="d-flex justify-content-start align-items-start">
            <b-button size="sm" :variant="data.item.components ? 'primary' : 'secondary'" class="mr-2" @click="data.toggleDetails" :disabled="!data.item.components">
              <i class="icon-mixture" />
            </b-button>
            <div v-if="data.item.componentNames" class="component-icons">
              <i :class="`icon-${component ? component.toLowerCase() : null} mx-1 mb-1`" v-for="component in data.item.componentNames" :key="`row-${data.index}-${component}`" v-b-tooltip="component" />
            </div>
          </div>
        </template>
        <template #cell(fertilizer)="data">
          <span class="text-nowrap">
            <i :class="{ 'icon-fertilizer': true, disabled: !data.item.fertilizer }" />
            <span v-if="data.item.fertilizer" class="ml-2 text-preview" v-b-tooltip="data.item.fertilizer">{{ data.item.fertilizer }}</span>
          </span>
        </template>
        <template #cell(herbicide)="data">
          <span class="text-nowrap">
            <i :class="{ 'icon-herbicide': true, disabled: !data.item.herbicide }" />
            <span v-if="data.item.herbicide" class="ml-2 text-preview" v-b-tooltip="data.item.herbicide">{{ data.item.herbicide }}</span>
          </span>
        </template>
        <template #cell(pests)="data">
          <span class="text-nowrap">
            <i :class="{ 'icon-pests': true, disabled: !data.item.pests }" />
            <span v-if="data.item.pests" class="ml-2 text-preview" v-b-tooltip="data.item.pests">{{ data.item.pests }}</span>
          </span>
        </template>
        <template #cell(tillage)="data">
          <span class="text-nowrap">
            <i :class="{ 'icon-tillage': true, disabled: !data.item.tillage }" :style="{ backgroundColor: colors[categories.tillage.indexOf(data.item.tillage) % colors.length] }" />
            <span v-if="data.item.tillage" class="ml-2 text-preview" v-b-tooltip="data.item.tillage">{{ data.item.tillage }}</span>
          </span>
        </template>
        <template #cell(farmManagement)="data">
          <span class="text-nowrap">
            <i :class="{ 'icon-farm-management': true, disabled: !data.item.farmManagement }" :style="{ backgroundColor: colors[categories.farmManagement.indexOf(data.item.farmManagement) % colors.length] }" />
            <span v-if="data.item.farmManagement" class="ml-2 text-preview" v-b-tooltip="data.item.farmManagement">{{ data.item.farmManagement }}</span>
          </span>
        </template>
        <template #cell(cropPurpose)="data">
          <span class="text-nowrap">
            <i :class="{ 'icon-croppurpose': true, disabled: !data.item.cropPurpose }" :style="{ backgroundColor: colors[categories.cropPurpose.indexOf(data.item.cropPurpose) % colors.length] }" />
            <span v-if="data.item.cropPurpose" class="ml-2 text-preview" v-b-tooltip="data.item.cropPurpose">{{ data.item.cropPurpose }}</span>
          </span>
        </template>
        <template #cell(weedCover)="data">
          <span class="text-nowrap">
            <i :class="{ 'icon-weed-cover': true, disabled: !data.item.weedCover }" />
            <span v-if="data.item.weedCover" class="ml-2 text-preview" v-b-tooltip="data.item.weedCover">{{ data.item.weedCover }}</span>
          </span>
        </template>
        <template #cell(sowingDate)="data">
          <span class="text-nowrap">
            <i :class="{ 'icon-sowing-date': true, disabled: !data.item.sowingDate }" />
            <span v-if="data.item.sowingDate" class="ml-2 text-preview">{{ new Date(data.item.sowingDate).toLocaleDateString() }}</span>
          </span>
        </template>
        <template #cell(harvestDate)="data">
          <span class="text-nowrap">
            <i :class="{ 'icon-harvest-date': true, disabled: !data.item.harvestDate }" />
            <span v-if="data.item.harvestDate" class="ml-2 text-preview">{{ new Date(data.item.harvestDate).toLocaleDateString() }}</span>
          </span>
        </template>

        <template #row-details="data">
          <b-row>
            <b-col cols=12 sm=6 md=4 v-for="component in data.item.components" :key="`ds-${data.item.datasetId}-comp-${component.id}`">
              <b-card class="mb-3">
                <b-card-title>
                  <i :class="`icon-${component.cropName.toLowerCase()}`" /> {{ component.cropName }} - {{ component.varietyName }}
                </b-card-title>
                <ul>
                  <li v-for="datum in data.item.data.filter(d => d.componentIds && d.componentIds.length === 1 && d.componentIds.includes(component.id))" :key="`measurement-${datum.measurementId}`">
                    {{ datum.traitName }} - {{ datum.measurementType }}: {{ datum.measurement }} {{ datum.traitUnitName }}
                  </li>
                </ul>
              </b-card>
            </b-col>
          </b-row>
        </template>
      </b-table>

      <b-pagination
        v-model="currentPage"
        :total-rows="itemCount"
        :per-page="perPage"
        aria-controls="dataset-table"
      ></b-pagination>

      <div class="text-center">
        <b-button variant="primary" @click="$emit('datasets-changed', filteredDatasetIds)"><BIconArrowDownSquareFill /> Update map using filter</b-button>
      </div>
    </template>
    <LoadingIndicator v-else />
  </div>
</template>

<script>
import { BIconArrowDownSquareFill, BIconGeoAltFill } from 'bootstrap-vue'

import LoadingIndicator from '@/components/LoadingIndicator'

export default {
  components: {
    BIconArrowDownSquareFill,
    BIconGeoAltFill,
    LoadingIndicator
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
      currentPage: 1,
      perPage: 10,
      itemCount: 0,
      filteredItems: null,
      filter: null,
      isAnd: true,
      families: {
        legumes: ['peas', 'beans', 'clover', 'lentil'],
        cereals: ['barley', 'wheat', 'maize', 'oats', 'rye'],
        oilseeds: ['linseed', 'turnip', 'oilseed', 'rape'],
        other: ['plantain']
      },
      columns: [
        // { key: 'datasetId', label: 'Dataset id', sortable: true },
        { key: 'datasetName', label: 'Dataset name', sortable: true },
        { key: 'siteName', label: 'Site name', sortable: true },
        { key: 'location', label: 'Location', sortable: false },
        // { key: 'latitude', label: 'Latitude', formatter: value => value !== null ? value.toFixed(2) : null, class: 'text-right', sortable: true },
        // { key: 'longitude', label: 'Longitude', formatter: value => value !== null ? value.toFixed(2) : null, class: 'text-right', sortable: true },
        { key: 'components', labels: 'Components' },
        { key: 'fertilizer', label: 'Fertilizer', sortable: true },
        { key: 'herbicide', label: 'Herbicide', sortable: true },
        { key: 'tillage', label: 'Tillage', sortable: true },
        { key: 'farmManagement', label: 'Farm management', sortable: true },
        { key: 'cropPurpose', label: 'Crop purpose', sortable: true },
        { key: 'weedCover', label: 'Weed cover', sortable: true },
        { key: 'sowingDate', label: 'Sowing date', sortable: true },
        { key: 'harvestDate', label: 'Harvest date', sortable: true }
      ]
    }
  },
  watch: {
    serverData: function (newValue) {
      if (newValue) {
        this.itemCount = newValue.length
      } else {
        this.itemCount = 0
      }
    }
  },
  methods: {
    updateItemCount: function (rows) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.itemCount = rows.length
      this.currentPage = 1
      this.filteredDatasetIds = rows.map(r => r.datasetId)
    },
    filterTable: function (row, filter) {
      if (filter === undefined || filter === null || filter === '') {
        return true
      }

      const parts = filter.split(' ').map(p => p.trim().toLowerCase()).filter(p => p !== '')

      const matches = parts.filter(p => {
        return Object.keys(row).filter(k => {
          const value = row[k]

          // If there's no value, it's not a match
          if (value === undefined || value === null) {
            return false
          }

          if (typeof value === 'number') {
            if (isNaN(p)) {
              return value === p
            } else {
              return value === +p
            }
          } else if (typeof value === 'string') {
            return value.toLowerCase().includes(p)
          } else if (k === 'components' && row.componentNames) {
            const family = this.families[p]

            if (family) {
              return row.componentNames.some(c => family.includes(c))
            } else {
              return row.componentNames.some(c => c.includes(p))
            }
          } else {
            return false
          }
        }).length > 0
      }).length

      if (this.isAnd) {
        return matches === parts.length
      } else {
        return matches > 0
      }
    }
  },
  created: function () {
    if (this.serverData) {
      this.itemCount = this.serverData.length
    } else {
      this.itemCount = 0
    }
  }
}
</script>

<style scoped>
.site-table-filter input,
.site-table-filter .input-group-text {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

.site-table i {
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
.site-table i.disabled {
  opacity: 0.2;
}
.site-table .component-icons {
  min-width: 110px;
}
.text-preview {
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 12ch;
}
</style>
<style>
.site-table .b-table-details .row {
  max-width: 97.5vw;
}
</style>
