const axios = require('axios').default

export default {
  methods: {
    apiGetDatasets: function () {
      return this.axios({ url: 'dataset' })
    },
    apiGetDatasetData: function () {
      return this.axios({ url: 'dataset/data', dataType: 'blob' })
    },
    /**
     * Sends an axios REST request to the server with the given parameter configuration
     * @param {String} url The remote URL (relative) to send the request to
     * @param {Object} params (Optional) Request payload in the form of a Javascript object
     * @param {String} method (Optional) REST method (default: `'get'`)
     * @returns Promise
     */
    axios: function ({ url = null, params = null, method = 'get', dataType = 'json', contentType = 'application/json; charset=utf-8' }) {
      let requestData = null
      let requestParams = null

      // Stringify the data object for non-GET requests
      if (params !== null || params !== undefined) {
        if (method === 'get') {
          requestParams = params
        } else {
          requestData = params
        }
      }

      return axios({
        url: url,
        params: requestParams,
        data: requestData,
        method: method,
        crossDomain: true,
        responseType: dataType,
        headers: {
          'Content-Type': contentType
        }
      })
    }
  }
}
