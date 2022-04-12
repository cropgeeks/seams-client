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
      variableTypes: {
        fertilizer: 'yesNo',
        herbicide: 'yesNo',
        weed_cover: 'categorical'
      },
      colorByOptions: [
        { value: null, text: 'Select colouring option' },
        { value: 'dataset_name', text: 'Dataset' },
        { value: 'site_name', text: 'Site' },
        { value: 'tillage', text: 'Tillage' },
        { value: 'dataset_name', text: 'Dataset' },
        { value: 'fertilizer', text: 'Fertilizer' },
        { value: 'herbicide', text: 'Herbicide' },
        { value: 'farm_management', text: 'Farm Management' },
        { value: 'dataset_name', text: 'Dataset' },
        { value: 'weed_cover', text: 'Weed cover' },
        { value: 'disease', text: 'Disease' },
        { value: 'crop_purpose', text: 'Crop purpose' },
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
        const vOneType = this.variableTypes[this.variableOne] || null
        const vTwoType = this.variableTypes[this.variableTwo] || null
        const vCatType = this.variableTypes[this.colorBy] || null

        let cats = []

        if (this.colorBy) {
          const categories = new Set()

          const unpacked = this.plotlyUnpack(this.plotData, this.colorBy, vCatType)
          for (let i = 0; i < unpacked.length; i++) {
            if (unpacked[i] !== undefined && unpacked[i] !== null) {
              if (typeof unpacked[i] === 'string') {
                categories.add(unpacked[i].trim())
              } else {
                categories.add(unpacked[i])
              }
            }
          }

          cats = Array.from(categories)
          cats.sort()
        }

        let data
        if (cats.length > 0) {
          data = cats.map(c => {
            const realX = this.plotlyUnpackConditional(this.plotData, this.variableOne, this.colorBy, c, null)
            const realY = this.plotlyUnpackConditional(this.plotData, this.variableTwo, this.colorBy, c, null)
            const siteName = this.plotlyUnpackConditional(this.plotData, 'site_name', this.colorBy, c, null)
            const components = this.plotlyUnpackConditional(this.plotData, 'components', this.colorBy, c, null)
            const text = realX.map((x, i) => `${siteName[i]}: ${components[i] ? JSON.parse(components[i]).join(', ') : ''}<br>${realX[i]} - ${realY[i]}`)
            return {
              x: this.plotlyUnpackConditional(this.plotData, this.variableOne, this.colorBy, c, vOneType),
              y: this.plotlyUnpackConditional(this.plotData, this.variableTwo, this.colorBy, c, vTwoType),
              text: text,
              type: 'scatter',
              mode: 'markers',
              name: c,
              hovertemplate:
                '<b>%{text}</b><br><br>' +
                '%{yaxis.title.text}: %{y}<br>' +
                '%{xaxis.title.text}: %{x}<br>'
            }
          }).filter(d => d.x.length > 0 && d.y.length > 0 && d.x.some(x => x !== null) && d.y.some(y => y !== null))
        } else {
          const realX = this.plotlyUnpack(this.plotData, this.variableOne, null)
          const realY = this.plotlyUnpack(this.plotData, this.variableTwo, null)
          const siteName = this.plotlyUnpack(this.plotData, 'site_name', null)
          const components = this.plotlyUnpack(this.plotData, 'components', null)
          const text = realX.map((x, i) => `${siteName[i]}: ${components[i] ? JSON.parse(components[i]).join(', ') : ''}<br>${realX[i]} - ${realY[i]}`)
          data = [{
            x: this.plotlyUnpack(this.plotData, this.variableOne, vOneType),
            y: this.plotlyUnpack(this.plotData, this.variableTwo, vTwoType),
            text: text,
            type: 'scatter',
            mode: 'markers',
            hovertemplate:
              '<b>%{text}</b><br><br>' +
              '%{yaxis.title.text}: %{y}<br>' +
              '%{xaxis.title.text}: %{x}<br>' +
              '<extra></extra>'
          }].filter(d => d.x.length > 0 && d.y.length > 0 && d.x.some(x => x !== null) && d.y.some(y => y !== null))
        }

        const layout = {
          height: 500,
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
          legend: {
            xanchor: 'left',
            yanchor: 'bottom',
            y: 1,
            x: 0,
            orientation: 'h'
          }
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
