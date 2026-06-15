export default defineAppConfig({
  pages: [
    'pages/home/index',
    'pages/album/index',
    'pages/score/index',
    'pages/tags/index',
    'pages/mine/index',
    'pages/recommend-detail/index',
    'pages/outfit-detail/index',
    'pages/score-result/index',
    'pages/profile-edit/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#FFF5F7',
    navigationBarTitleText: '今日穿搭',
    navigationBarTextStyle: 'black',
    backgroundColor: '#FFF5F7'
  },
  tabBar: {
    color: '#A0A0A0',
    selectedColor: '#FF8FA3',
    backgroundColor: '#FFFFFF',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '推荐'
      },
      {
        pagePath: 'pages/album/index',
        text: '相册'
      },
      {
        pagePath: 'pages/score/index',
        text: '打分'
      },
      {
        pagePath: 'pages/tags/index',
        text: '标签'
      },
      {
        pagePath: 'pages/mine/index',
        text: '我的'
      }
    ]
  }
})
