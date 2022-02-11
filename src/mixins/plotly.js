export default {
  methods: {
    plotlyUnpack: function (rows, key) {
      return rows.map(row => this.plotlyExtractValue(row, key))
    },
    plotlyUnpackConditional: function (rows, key, referenceColumn, referenceValue) {
      return rows.filter(row => row[referenceColumn] === referenceValue)
        .map(row => this.plotlyExtractValue(row, key))
    },
    plotlyExtractValue: function (row, key) {
      const dataPoint = row[key]
      if (dataPoint === null || dataPoint === undefined || dataPoint === '') {
        return null
      } else {
        let isDate = false

        if (key === 'Date') {
          isDate = true
        } else if (dataPoint.split('-').length === 3 && !isNaN(Date.parse(dataPoint))) {
          isDate = true
        }

        if (isDate) {
          return dataPoint
        } else {
          var value = parseFloat(dataPoint)

          if (isNaN(value)) {
            return dataPoint
          } else {
            return value
          }
        }
      }
    }
  }
}
