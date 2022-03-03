<template>
  <b-container class="mt-3">
    <ScatterChart :plotData="blob" :dataColumns="columns" v-for="index in chartCount" :key="`chart-${index}`" />
    <b-button @click="chartCount++">Add</b-button>
  </b-container>
</template>

<script>
import ScatterChart from '@/components/ScatterChart'

import api from '@/mixins/api'

const d3Dsv = require('d3-dsv')

export default {
  components: {
    ScatterChart
  },
  data: function () {
    return {
      serverData: null,
      blob: null,
      columns: null,
      chartCount: 1
    }
  },
  watch: {
    serverData: function () {
      this.parseData()
    }
  },
  mixins: [api],
  methods: {
    parseData: function () {
      const reader = new FileReader()
      reader.onload = () => {
        this.blob = d3Dsv.tsvParse(reader.result)
        this.columns = this.blob.columns.concat()
      }
      reader.readAsText(this.serverData)
    }
  },
  created: function () {
    this.apiGetDatasetData()
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
</style>
