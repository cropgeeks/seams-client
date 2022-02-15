<template>
  <div>
    <b-row>
      <b-col cols=12 sm=6>
        <b-form-group label="Dimension 1" label-for="variableOne">
          <b-form-select id="variableOne" :options="variables" v-model="variableOne" />
        </b-form-group>
      </b-col>
      <b-col cols=12 sm=6>
        <b-form-group label="Dimension 2" label-for="variableTwo">
          <b-form-select id="variableTwo" :options="variables" v-model="variableTwo" />
        </b-form-group>
      </b-col>
      <b-col cols=12 sm=6>
        <b-form-group label="Colour by" label-for="colorBy">
          <b-form-select id="colorBy" :options="colorByOptions" v-model="colorBy" />
        </b-form-group>
      </b-col>
    </b-row>
    <div ref="chart" class="mb-5" />
  </div>
</template>

<script>
import api from '@/mixins/api'
import plotly from '@/mixins/plotly'

const d3Dsv = require('d3-dsv')

export default {
  data: function () {
    return {
      serverData: null,
      blob: null,
      variables: null,
      variableOne: null,
      variableTwo: null,
      colorByOptions: [
        { value: null, text: 'Select colouring option' },
        { value: 'dataset_name', text: 'Dataset' },
        { value: 'site_name', text: 'Site' },
        { value: 'tillage', text: 'Tillage' },
        { value: 'dataset_name', text: 'Dataset' },
        { value: 'fertilizer', text: 'Fertilizer' },
        { value: 'farm_management', text: 'Farm Management' },
        { value: 'dataset_name', text: 'Dataset' },
        { value: 'weed_cover', text: 'Weed cover' },
        { value: 'disease', text: 'Disease' },
        { value: 'pests', text: 'Pests' },
        { value: 'dataset_name', text: 'Dataset' },
        { value: 'measurement_type', text: 'Mono/Mix' }
      ],
      colorBy: null
    }
  },
  watch: {
    serverData: function () {
      this.parseData()
    },
    variableOne: function () {
      this.redraw()
    },
    variableTwo: function () {
      this.redraw()
    },
    colorBy: function () {
      this.redraw()
    }
  },
  mixins: [api, plotly],
  methods: {
    parseData: function () {
      const reader = new FileReader()
      reader.onload = () => {
        this.blob = d3Dsv.tsvParse(reader.result)

        this.variables = [{ value: null, text: 'Select dimension' }, ...this.blob.columns]
      }
      reader.readAsText(this.serverData)
    },
    redraw: function () {
      this.$plotly.purge(this.$refs.chart)

      if (this.variableOne && this.variableTwo && this.blob) {
        let cats = []

        if (this.colorBy) {
          const categories = new Set()

          var unpacked = this.plotlyUnpack(this.blob, this.colorBy)
          for (let i = 0; i < unpacked.length; i++) {
            categories.add(unpacked[i])
          }

          cats = Array.from(categories)
          cats.sort()
        }

        let data
        if (cats.length > 0) {
          data = cats.map(c => {
            return {
              x: this.plotlyUnpackConditional(this.blob, this.variableOne, this.colorBy, c),
              y: this.plotlyUnpackConditional(this.blob, this.variableTwo, this.colorBy, c),
              type: 'scatter',
              mode: 'markers',
              name: c
            }
          })
        } else {
          data = [{
            x: this.plotlyUnpack(this.blob, this.variableOne),
            y: this.plotlyUnpack(this.blob, this.variableTwo),
            type: 'scatter',
            mode: 'markers'
          }]
        }

        const layout = {
          xaxis: {
            title: this.variableOne,
            automargin: true,
            showgrid: true
          },
          yaxis: {
            title: this.variableTwo,
            automargin: true,
            showgrid: true
          },
          hovermode: 'closest',
          legend: { orientation: 'h' }
        }

        const config = {
          responsive: true,
          displaylogo: false
        }

        this.$plotly.newPlot(this.$refs.chart, data, layout, config)
      }
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
