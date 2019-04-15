// 进入小程序场景值
const SceneID = {
  Template: 1014 // 模版消息
}

// 拉取微信授权返回值
const GetUserInfoReturnValue = {
  Success: 'getUserInfo:ok',
  Fail: ['getUserInfo:fail auth deny']
}

// 拉取微信授权返回值
const SaveFormIDReturnValue = {
  Fail: ['the formId is a mock one']
}

export {
  SceneID,
  GetUserInfoReturnValue,
  SaveFormIDReturnValue
}
