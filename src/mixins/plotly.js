export default {
  methods: {
    plotlyUnpack: function (rows, key, type) {
      return rows.map(row => this.plotlyExtractValue(row, key, type))
    },
    plotlyUnpackConditional: function (rows, key, referenceColumn, referenceValue, type) {
      return rows.filter(row => row[referenceColumn] === referenceValue)
        .map(row => this.plotlyExtractValue(row, key, type))
    },
    plotlyExtractValue: function (row, key, type) {
      const dataPoint = row[key]

      if (type === 'yesNo') {
        return dataPoint !== null && dataPoint !== undefined && dataPoint !== ''
      } else if (type === 'categorical') {
        return dataPoint
      }

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
          const value = parseFloat(dataPoint)

          if (isNaN(value)) {
            return dataPoint.trim()
          } else {
            return value
          }
        }
      }
    }
  }
}
