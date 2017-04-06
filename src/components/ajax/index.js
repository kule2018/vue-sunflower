/**
 *  ajax全局设置
 */
import axios from 'axios'
import { assignIn } from 'lodash'

axios.interceptors.request.use(config => {
  return config
}, error => {
  return Promise.reject(error)
})

axios.interceptors.response.use(response => response, error => Promise.resolve(error.response))

const globalOptions = {
  baseURL: '',
  timeout: 60000
};

function checkStatus(response) {
  if (response.status === 200 || response.status === 304) {
    return response
  }
  return {
    data: {
      code: -404,
      message: response.statusText,
      data: response.statusText,
    }
  }
}

function checkCode(res) {
  if (res.data.code === -404) {
    alert(res.data.message)
  }
  return res
}

export default {
  post (url, data, config) {
    let options = {};
    if (typeof config !== 'undefined') {
      options = assignIn(globalOptions, config);
    }else{
      options = globalOptions;
    }
    return axios.post(url, data, options).then(checkStatus).then(checkCode)
  },
  get (url, params, config) {
    let options = {};
    if (typeof config !== 'undefined') {
      options = assignIn(globalOptions, {params: params}, config)
    }else{
      options = assignIn(globalOptions, {params: params});
    }
    return axios.get(url, options).then(checkStatus).then(checkCode)
  }
}

