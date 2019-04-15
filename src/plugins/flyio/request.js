import Vue from 'vue'
import Flyio from './interceptors'
import API from './apiUrl'
import Config from './config'
import { getFileSystemManager } from '@/utils/wxApi'

// 异常情况的错误处理
const errorFunction = (reqConfig, err) => {
  // 如果有异常需要提示
  if (!reqConfig.errorAction && reqConfig.isErrorDefaultTip) {
    if (err.status === 0 && err.message.indexOf('request:fail') > -1 && err.engine) {
      err.message = '亲，服务不给力，请稍后重试～'
    }

    if (err.status === 500) {
      err.message = '亲，服务不给力，请重试~'
    }

    Config.resError.tipShow(err)
  }
  throw (err)
}

let promises = [] // 接收接口请求的promise数组
let loadingTimer = [] // loading的定时器

// 接口请求封装函数
const handleRequest = (url = '', data = {}) => {
  if (Vue.iBox.IsMocking && data.isMocking) {
    const fileSystemManager = getFileSystemManager()
    const fileInfo = url.split('.')

    if (fileInfo.length > 0) {
      let filePath = `mock/${fileInfo[0]}/${fileInfo[1]}`

      return function () {
        return new Promise((resolve, reject) => {
          try {
            const mockData = JSON.parse(fileSystemManager.readFileSync(filePath, 'utf8'))

            if (mockData.code === Config.resSuccess.value) {
              resolve(mockData)
            } else {
              reject(mockData)
            }
          } catch (err) {
            console.log(`mock 数据读取异常：${err}`)
            reject(err)
          }
        })
      }
    }
  }

  let _url = Vue.iBox.render(API[url], data) || ''
  return (flyConfig = {}, defaultTipConfig = {}) => {
    const accessTokenCollection = Vue.iBox.getTokenSync(Vue.iBox.TokenKey.Admin)
    let flyio = Flyio.request(_url, data, {
      ...Config.flyConfig,
      ...flyConfig,
      headers: {
        'accesstoken': accessTokenCollection ? accessTokenCollection.AccessToken : 'null',
        'appkey': 'appkey',
        'appversion': 'appversion'
      }
    })
    let tipConfig = {
      ...Config.reqConfig,
      ...defaultTipConfig
    }

    // 开启loading
    clearTimeout(loadingTimer) // 多个接口时需要清除上一个loading
    loadingTimer = setTimeout(() => {
      tipConfig.isLoading && Config.loading.loadingShow()
    }, Config.loading.limitTime)

    // 计算当前的promise是否全部加载完成
    promises.push(flyio.catch(e => {}))
    Promise.all(promises).then(data => {
      if (data.length !== promises.length) return
      promises = [] // 所有请求完后清除promise数组
      clearTimeout(loadingTimer) // 当请求在xxxms内完成则直接清除loading计时器
      tipConfig.isLoading && Config.loading.loadingHide() // 当promise全部加载完成则隐藏loading
    })

    return flyio.then(res => {
      // 成功返回
      if (res[Config.resSuccess.key] === Config.resSuccess.value || url.indexOf('loginUrl') > -1) {
        return res
      }

      errorFunction(tipConfig, res)
    }).catch(err => {
      if (url.indexOf('loginUrl') > -1 && (err.status === 422 || err.status === 461)) {
        let errorData = {
          'status': err.status,
          'Message': err.response.data.Message,
          'Data': err.response.data
        }

        return errorData
      }

      errorFunction(tipConfig, err)
    })
  }
}

export default handleRequest
