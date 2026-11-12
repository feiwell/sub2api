// Minimal seed resources. Full locale data will be ported from the Vue app's
// src/i18n/locales/{en,zh} in a later migration phase.
export const en = {
  translation: {
    common: { appName: 'Sub2API', loading: 'Loading...', submit: 'Submit', cancel: 'Cancel' },
    nav: { dashboard: 'Dashboard', keys: 'API Keys', usage: 'Usage', profile: 'Profile', admin: 'Admin', logout: 'Log out' },
    auth: {
      login: 'Log in',
      register: 'Create account',
      username: 'Username',
      email: 'Email',
      password: 'Password',
      loginTitle: 'Welcome back',
      loginSubtitle: 'Sign in to your Sub2API account',
      registerTitle: 'Create your account',
      noAccount: "Don't have an account?",
      haveAccount: 'Already have an account?',
    },
    dashboard: { title: 'Dashboard', welcome: 'Welcome back' },
    notFound: { title: 'Page not found', back: 'Back to home' },
  },
}

export const zh = {
  translation: {
    common: { appName: 'Sub2API', loading: '加载中...', submit: '提交', cancel: '取消' },
    nav: { dashboard: '仪表盘', keys: 'API 密钥', usage: '用量', profile: '个人资料', admin: '管理', logout: '退出登录' },
    auth: {
      login: '登录',
      register: '注册',
      username: '用户名',
      email: '邮箱',
      password: '密码',
      loginTitle: '欢迎回来',
      loginSubtitle: '登录你的 Sub2API 账户',
      registerTitle: '创建账户',
      noAccount: '还没有账户？',
      haveAccount: '已经有账户？',
    },
    dashboard: { title: '仪表盘', welcome: '欢迎回来' },
    notFound: { title: '页面不存在', back: '返回首页' },
  },
}
