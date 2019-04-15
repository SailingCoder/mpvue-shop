import { getDomain, getLoginDomain } from '@/defines/request'

let API = {}
let BaseUrl = getDomain(process.env.NODE_ENV)
let LoginBaseUrl = getLoginDomain(process.env.NODE_ENV)
const modulesContext = require.context('./', true, /\.js$/)

const chunks = modulesContext.keys().reduce((modules, key) => {
  if (key !== './index.js') {
    const moduleAPI = {...modulesContext(key).default}

    for (let key in moduleAPI) {
      if (key.indexOf('loginUrl') > -1) {
        moduleAPI[key] = LoginBaseUrl + moduleAPI[key]
      } else {
        moduleAPI[key] = BaseUrl + moduleAPI[key]
      }
    }

    Object.assign(API, moduleAPI)
  }

  return API
}, {})

export default {
  ...chunks
}
