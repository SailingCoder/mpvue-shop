const LoginDomain = {
  Dev: 'https://dev-proxy.dg.cn',
  Test: 'https://test-proxy.dg.cn',
  Prep: 'https://prep-proxy.dg.com',
  Production: 'https://proxy.dg.com'
}

const Domain = {
  Dev: 'https://dev-appft.dg.cn',
  Test: 'https://test-appft.dg.cn',
  Prep: 'https://prep-appft.dg.com',
  Production: 'https://appft.dg.com'
}

function getLoginDomain (env) {
  switch (env) {
    case 'development':
      return LoginDomain.Dev
    case 'test':
      return LoginDomain.Test
    case 'prep':
      return LoginDomain.Prep
    case 'production':
      return LoginDomain.Production
    default:
      return LoginDomain.Production
  }
}

function getDomain (env) {
  switch (env) {
    case 'development':
      return Domain.Dev
    case 'test':
      return Domain.Test
    case 'prep':
      return Domain.Prep
    case 'production':
      return Domain.Production
    default:
      return Domain.Production
  }
}

let IsMocking = process.env.NODE_ENV === 'development'

export {
  getDomain,
  getLoginDomain,
  IsMocking
}
