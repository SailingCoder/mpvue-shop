module.exports = [
  {
    path: 'pages/index',
    config: {
      navigationBarTitleText: 'home'
    }
  },
  {
    root: 'subPackage1',
    subPackage: true,
    path: 'subPackage1/pages/subPackage1-1',
    config: {
      navigationBarTitleText: 'subPackage1-1'
    }
  },
  {
    root: 'subPackage1',
    subPackage: true,
    path: 'subPackage1/pages/subPackage1-2',
    config: {
      navigationBarTitleText: 'subPackage1-2'
    }
  },
  {
    root: 'subPackage2',
    subPackage: true,
    path: 'subPackage2/pages/subPackage2-1',
    config: {
      navigationBarTitleText: 'subPackage2-1'
    }
  }
]
