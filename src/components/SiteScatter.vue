<template>
  <div>
    <b-row>
      <b-col cols=12 sm=6>
        <b-form-select :options="variables" v-model="variableOne" />
      </b-col>
      <b-col cols=12 sm=6>
        <b-form-select :options="variables" v-model="variableTwo" />
      </b-col>
    </b-row>
    <div ref="chart" />
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
      variableTwo: null
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
        const data = [{
          x: this.plotlyUnpack(this.blob, this.variableOne),
          y: this.plotlyUnpack(this.blob, this.variableTwo),
          type: 'scatter',
          mode: 'markers'
        }]

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

<style>

</style>
