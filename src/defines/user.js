const AppID = process.env.NODE_ENV === 'production' ? 'prod_AppId' : 'own_AppId'
// 用户行为
const UserBehaviorType = {
  EnterByNavigator: 1, // 进入小程序
  Share: 4, // 点击分享
  ClickCoupon: 20 // 点击领取优惠券
}

const ConcernStatus = {
  NoConcern: 1, // 必须通过getUserInfo获取UnionID的用户
  Concern: 2 // wx.login可以获取UnionID的用户
}

const TokenStatus = {
  Valid: 1,
  InValid: 2
}

const TokenKey = {
  Admin: 'AdminToken',
  Scene: 'SceneToken',
  SystemInfo: 'SystemInfoToken',
  Assessments: 'AssessmentsToken',
}

const UserCourseSessionStatus = {
  Unlocked: 1, // 不锁
  Locked: 2
}

const Modules = {
  Assessments: 0,
  CourseSession: 1,
  ReviewingSession: 2
}

const AppSecret = ''

// 分享开关控制
const ShareNeedShare = {
  YES: 1,
  NO: 2
}

export {
  AppID,
  TokenKey,
  TokenStatus,
  ConcernStatus,
  UserBehaviorType,
  UserCourseSessionStatus,
  Modules,
  AppSecret,
  ShareNeedShare,
}
