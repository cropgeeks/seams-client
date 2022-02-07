<template>
  <div>
    <b-table :items="serverData"
             :fields="columns"
             responsive
             striped
             hover
             class="site-table" >
      <template v-slot:cell(fertilizer)="data">
        <i :class="{ 'icon-fertilizer': true, disabled: !data.item.fertilizer }" v-b-tooltip="data.item.fertilizer" />
      </template>
      <template v-slot:cell(tillage)="data">
        <i :class="{ 'icon-tillage': true, disabled: !data.item.tillage }" v-b-tooltip="data.item.tillage" />
      </template>
      <template v-slot:cell(farmManagement)="data">
        <i :class="{ 'icon-farm-management': true, disabled: !data.item.farmManagement }" v-b-tooltip="data.item.farmManagement" />
      </template>
      <template v-slot:cell(weedCover)="data">
        <i :class="{ 'icon-weed-cover': true, disabled: !data.item.weedCover }" v-b-tooltip="data.item.weedCover" />
      </template>
      <template v-slot:cell(sowingDate)="data">
        <span class="text-nowrap" >
          <i :class="{ 'icon-sowing-date': true, disabled: !data.item.sowingDate }" />&nbsp;
          <span v-if="data.item.sowingDate">{{ new Date(data.item.sowingDate).toLocaleDateString() }}</span>
        </span>
      </template>
      <template v-slot:cell(harvestDate)="data">
        <span class="text-nowrap" >
          <i :class="{ 'icon-harvest-date': true, disabled: !data.item.harvestDate }" />&nbsp;
          <span v-if="data.item.harvestDate">{{ new Date(data.item.harvestDate).toLocaleDateString() }}</span>
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
      columns: [
        { key: 'datasetId', label: 'Dataset id' },
        { key: 'datasetName', label: 'Dataset name' },
        { key: 'siteName', label: 'Site name' },
        { key: 'latitude', label: 'Latitude', formatter: value => value !== null ? value.toFixed(2) : null, class: 'text-right' },
        { key: 'longitude', label: 'Longitude', formatter: value => value !== null ? value.toFixed(2) : null, class: 'text-right' },
        { key: 'fertilizer', label: 'Fertilizer', class: 'text-center' },
        { key: 'tillage', label: 'Tillage', class: 'text-center' },
        { key: 'farmManagement', label: 'Farm management', class: 'text-center' },
        { key: 'weedCover', label: 'Weed cover', class: 'text-center' },
        { key: 'sowingDate', label: 'Sowing date' },
        { key: 'harvestDate', label: 'Harvest date' }
      ]
    }
  },
  mixins: [api],
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
  width: 1.5em;
  height: 1.5em;
  display: inline-block;
  background-size: 1.5em 1.5em;
  background-repeat: no-repeat;
}
.site-table i.disabled {
  opacity: 0.2;
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
</style>
