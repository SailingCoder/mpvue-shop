import utils from '@/utils/index'

function getTokenSync (tokenKey) {
  try {
    return wx.getStorageSync(tokenKey)
  } catch (e) {
    console.log(`getTokenError: ${e}`)
  }
}

function setTokenSync (tokenKey, value) {
  try {
    wx.setStorageSync(tokenKey, value)
  } catch (e) {
    console.log(`setTokenError: ${e}`)
  }
}

function removeTokenSync (tokenKey) {
  try {
    wx.removeStorageSync(tokenKey)
  } catch (e) {
    console.log(`removeTokenError: ${e}`)
  }
}

// 检查用户网络情况
async function getNetworkType () {
  return new Promise((resolve, reject) => {
    wx.getNetworkType({
      success: function (res) {
        if (res.networkType === 'none') {
          reject(res)
        } else {
          resolve(res)
        }
      },
      fail: function (res) {
        reject(res)
      }
    })
  })
}

// 小程序版本更新检测
async function updateManager () {
  return new Promise((resolve, reject) => {
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function () {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: function (res) {
                if (res.confirm) {
                  // 调用 applyUpdate 应用新版本并重启
                  updateManager.applyUpdate()
                  reject(res)
                } else {
                  resolve(res)
                }
              }
            })
          })
          updateManager.onUpdateFailed(function () {
            // 新的版本下载失败
            wx.showModal({
              title: '已经有新版本了哟~',
              content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
              complete: function (res) {
                resolve(res)
              }
            })
          })
        } else {
          resolve(res)
        }
      })
    }
  })
}

// 下载资源
function downloadFile (sourceUrl, successFunc) {
  try {
    wx.downloadFile({
      url: sourceUrl,
      success (res) {
        if (res.statusCode === 200) {
          if (typeof successFunc === 'function') {
            successFunc(res)
          }
        }
      },
      fail (res) {
        console.log(`downloadFileFail: ${res}`)
      },
      complete (res) {
        console.log(`downloadFileCompelte: ${res}`)
      }
    })
  } catch (e) {
    console.log(`downloadFileError: ${e}`)
  }
}

function navigateTo (url) {
  try {
    utils.debounce(function () {
      wx.navigateTo({
        url,
        fail: function () {
          wx.reLaunch({
            url: url
          })
        }
      })
    }, 100)()
  } catch (e) {
    console.log(e)
  }
}

function redirectTo (url) {
  wx.redirectTo({
    url,
    fail: function () {
      wx.reLaunch({
        url: url
      })
    }
  })
}

function reLaunch (url) {
  wx.reLaunch({
    url,
    fail: function () {
      wx.redirectTo({
        url: url
      })
    }
  })
}

function getSystemInfoSync (succFunc) {
  try {
    const res = wx.getSystemInfoSync()

    return res
  } catch (e) {
    console.log(`getSystemInfo: ${e}`)
  }
}

function getFileSystemManager () {
  return wx.getFileSystemManager()
}

function setNavigationBarTitle (title) {
  try {
    wx.setNavigationBarTitle({
      title
    })
  } catch (e) {
    console.log(`动态设置当前页面的标题: ${e}`)
  }
}

function pageScrollTo (scrollTop, duration) {
  try {
    wx.pageScrollTo({
      scrollTop,
      duration
    })
  } catch (e) {
    console.log(`将页面滚动到目标位置: ${e}`)
  }
}

export {
  getTokenSync,
  setTokenSync,
  removeTokenSync,
  updateManager,
  getNetworkType,
  downloadFile,
  navigateTo,
  redirectTo,
  reLaunch,
  getSystemInfoSync,
  getFileSystemManager,
  setNavigationBarTitle,
  pageScrollTo
}
