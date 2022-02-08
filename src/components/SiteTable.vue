<template>
  <div>
    <b-input v-model="filter" />
    <b-table :items="serverData"
             :fields="columns"
             :filter="filter"
             :filter-debounce="100"
             :filter-function="filterTable"
             responsive
             striped
             hover
             class="site-table" >
      <template v-slot:cell(componentData)="data">
        <i class="icon-barley" v-if="data.item.componentNames && data.item.componentNames.includes('barley')" v-b-tooltip="'Barley'" />
        <i class="icon-bean" v-if="data.item.componentNames && data.item.componentNames.includes('beans')" v-b-tooltip="'Beans'" />
        <i class="icon-blueberry" v-if="data.item.componentNames && data.item.componentNames.includes('blueberry')" v-b-tooltip="'Blueberry'" />
        <i class="icon-clover" v-if="data.item.componentNames && data.item.componentNames.includes('clover')" v-b-tooltip="'Clover'" />
        <i class="icon-linseed" v-if="data.item.componentNames && data.item.componentNames.includes('linseed')" v-b-tooltip="'Linseed'" />
        <i class="icon-maize" v-if="data.item.componentNames && data.item.componentNames.includes('maize')" v-b-tooltip="'Maize'" />
        <i class="icon-oat" v-if="data.item.componentNames && data.item.componentNames.includes('oats')" v-b-tooltip="'Oats'" />
        <i class="icon-oilseed" v-if="data.item.componentNames && data.item.componentNames.includes('oilseed')" v-b-tooltip="'Oilseed'" />
        <i class="icon-pea" v-if="data.item.componentNames && data.item.componentNames.includes('peas')" v-b-tooltip="'Peas'" />
        <i class="icon-raspberry" v-if="data.item.componentNames && data.item.componentNames.includes('raspberry')" v-b-tooltip="'Raspberry'" />
        <i class="icon-rye" v-if="data.item.componentNames && data.item.componentNames.includes('rye')" v-b-tooltip="'Rye'" />
        <i class="icon-strawberry" v-if="data.item.componentNames && data.item.componentNames.includes('strawberry')" v-b-tooltip="'Strawberry'" />
        <i class="icon-turnip" v-if="data.item.componentNames && data.item.componentNames.includes('turnip')" v-b-tooltip="'Turnip'" />
        <i class="icon-wheat" v-if="data.item.componentNames && data.item.componentNames.includes('wheat')" v-b-tooltip="'Wheat'" />
        <span class="icon-wheat" v-if="data.item.componentNames && data.item.componentNames.includes('vetch')" v-b-tooltip="'Vetch'">V</span>
      </template>
      <template v-slot:cell(fertilizer)="data">
        <span class="text-nowrap">
          <i :class="{ 'icon-fertilizer': true, disabled: !data.item.fertilizer }" />
          <span v-if="data.item.fertilizer" class="ml-2 text-preview" v-b-tooltip="data.item.fertilizer">{{ data.item.fertilizer }}</span>
        </span>
      </template>
      <template v-slot:cell(tillage)="data">
        <span class="text-nowrap">
          <i :class="{ 'icon-tillage': true, disabled: !data.item.tillage }" />
          <span v-if="data.item.tillage" class="ml-2 text-preview" v-b-tooltip="data.item.tillage">{{ data.item.tillage }}</span>
        </span>
      </template>
      <template v-slot:cell(farmManagement)="data">
        <span class="text-nowrap">
          <i :class="{ 'icon-farm-management': true, disabled: !data.item.farmManagement }" />
          <span v-if="data.item.farmManagement" class="ml-2 text-preview" v-b-tooltip="data.item.farmManagement">{{ data.item.farmManagement }}</span>
        </span>
      </template>
      <template v-slot:cell(weedCover)="data">
        <span class="text-nowrap">
          <i :class="{ 'icon-weed-cover': true, disabled: !data.item.weedCover }" />
          <span v-if="data.item.weedCover" class="ml-2 text-preview" v-b-tooltip="data.item.weedCover">{{ data.item.weedCover }}</span>
        </span>
      </template>
      <template v-slot:cell(sowingDate)="data">
        <span class="text-nowrap">
          <i :class="{ 'icon-sowing-date': true, disabled: !data.item.sowingDate }" />
          <span v-if="data.item.sowingDate" class="ml-2 text-preview">{{ new Date(data.item.sowingDate).toLocaleDateString() }}</span>
        </span>
      </template>
      <template v-slot:cell(harvestDate)="data">
        <span class="text-nowrap">
          <i :class="{ 'icon-harvest-date': true, disabled: !data.item.harvestDate }" />
          <span v-if="data.item.harvestDate" class="ml-2 text-preview">{{ new Date(data.item.harvestDate).toLocaleDateString() }}</span>
        </span>
      </template>
    </b-table>
  </div>
</template>

<script>
import api from '@/mixins/api'

export default {
  data: function () {
    return {
      serverData: null,
      filter: null,
      columns: [
        { key: 'datasetId', label: 'Dataset id', sortable: true },
        { key: 'datasetName', label: 'Dataset name', sortable: true },
        { key: 'siteName', label: 'Site name', sortable: true },
        { key: 'latitude', label: 'Latitude', formatter: value => value !== null ? value.toFixed(2) : null, class: 'text-right', sortable: true },
        { key: 'longitude', label: 'Longitude', formatter: value => value !== null ? value.toFixed(2) : null, class: 'text-right', sortable: true },
        { key: 'componentData', labels: 'Components' },
        { key: 'fertilizer', label: 'Fertilizer' },
        { key: 'tillage', label: 'Tillage' },
        { key: 'farmManagement', label: 'Farm management' },
        { key: 'weedCover', label: 'Weed cover' },
        { key: 'sowingDate', label: 'Sowing date', sortable: true },
        { key: 'harvestDate', label: 'Harvest date', sortable: true }
      ]
    }
  },
  mixins: [api],
  methods: {
    filterTable: function (row, filter) {
      if (filter === undefined || filter === null || filter === '') {
        return true
      }

      return Object.keys(row).filter(k => {
        const value = row[k]

        if (value === undefined || value === null) {
          return false
        }

        if (typeof value === 'number') {
          if (isNaN(filter)) {
            return value === filter
          } else {
            return value === +filter
          }
        } else if (typeof value === 'string') {
          return value.toLowerCase().includes(filter.toLowerCase())
        } else if (k === 'componentData' && row.componentNames) {
          return row.componentNames.filter(c => c.includes(filter.toLowerCase())).length > 0
        }
      }).length > 0
    }
  },
  created: function () {
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
.site-table i {
  width: 1.6em;
  height: 1.6em;
  display: inline-block;
  background-size: 1.6em 1.6em;
  background-repeat: no-repeat;
}
.site-table i.disabled {
  opacity: 0.2;
}
.text-preview {
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 12ch;
}
i.icon-fertilizer {
  background-image: url("~@/assets/img/fertilizer.svg");
}
i.icon-tillage {
  background-image: url("~@/assets/img/tillage.svg");
}
i.icon-farm-management {
  background-image: url("~@/assets/img/farm-management.svg");
}
i.icon-weed-cover {
  background-image: url("~@/assets/img/weed-cover.svg");
}
i.icon-sowing-date {
  background-image: url("~@/assets/img/sowing-date.svg");
}
i.icon-harvest-date {
  background-image: url("~@/assets/img/harvest-date.svg");
}
i.icon-barley {
  background-image: url("~@/assets/img/crops/barley.svg");
}
i.icon-bean {
  background-image: url("~@/assets/img/crops/bean.svg");
}
i.icon-blueberry {
  background-image: url("~@/assets/img/crops/blueberry.svg");
}
i.icon-clover {
  background-image: url("~@/assets/img/crops/clover.svg");
}
i.icon-linseed {
  background-image: url("~@/assets/img/crops/flax.svg");
}
i.icon-maize {
  background-image: url("~@/assets/img/crops/maize.svg");
}
i.icon-oat {
  background-image: url("~@/assets/img/crops/oat.svg");
}
i.icon-oilseed {
  background-image: url("~@/assets/img/crops/canola.svg");
}
i.icon-pea {
  background-image: url("~@/assets/img/crops/pea.svg");
}
i.icon-raspberry {
  background-image: url("~@/assets/img/crops/raspberry.svg");
}
i.icon-rye {
  background-image: url("~@/assets/img/crops/rye.svg");
}
i.icon-strawberry {
  background-image: url("~@/assets/img/crops/strawberry.svg");
}
i.icon-turnip {
  background-image: url("~@/assets/img/crops/turnip.svg");
}
i.icon-wheat {
  background-image: url("~@/assets/img/crops/wheat.svg");
}
</style>
