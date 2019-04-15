const ButtonTxt = {
  text: 'home',
}
const ButtonCount = {
  count: 0,
}

function getCCLiveHost () {
  switch (process.env.NODE_ENV) {
    case 'development':
      return CCLiveHost.Dev
    case 'test':
      return CCLiveHost.Test
    case 'prep':
      return CCLiveHost.Prep
    case 'production':
      return CCLiveHost.Production
    default:
      return CCLiveHost.Production
  }
}


export {
  ButtonTxt,
  ButtonCount,
  getCCLiveHost
}
