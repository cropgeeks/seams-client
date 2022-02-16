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

export default {
  props: {
    plotData: {
      type: Array,
      default: null
    },
    dataColumns: {
      type: Array,
      default: null
    }
  },
  data: function () {
    return {
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
  computed: {
    variables: function () {
      let result = [{ value: null, text: 'Select dimension' }]

      if (this.dataColumns) {
        result = result.concat(this.dataColumns)
      }

      return result
    }
  },
  watch: {
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
    redraw: function () {
      this.$plotly.purge(this.$refs.chart)

      if (this.variableOne && this.variableTwo && this.plotData) {
        let cats = []

        if (this.colorBy) {
          const categories = new Set()

          var unpacked = this.plotlyUnpack(this.plotData, this.colorBy)
          for (let i = 0; i < unpacked.length; i++) {
            categories.add(unpacked[i].trim())
          }

          cats = Array.from(categories)
          cats.sort()
        }

        let data
        if (cats.length > 0) {
          data = cats.map(c => {
            return {
              x: this.plotlyUnpackConditional(this.plotData, this.variableOne, this.colorBy, c),
              y: this.plotlyUnpackConditional(this.plotData, this.variableTwo, this.colorBy, c),
              type: 'scatter',
              mode: 'markers',
              name: c
            }
          })
        } else {
          data = [{
            x: this.plotlyUnpack(this.plotData, this.variableOne),
            y: this.plotlyUnpack(this.plotData, this.variableTwo),
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
  }
}
</script>

<style scoped>
</style>
