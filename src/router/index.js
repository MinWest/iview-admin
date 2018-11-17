import Vue from 'vue'
import Router from 'vue-router'
import routes from './routers'
import store from '@/store'
import iView from 'iview'
// import { setToken, getToken, canTurnTo } from '@/libs/util'
import { setToken, getToken, localSave, localRead } from '@/libs/util'
import config from '@/config'
const { homeName } = config

Vue.use(Router)
const router = new Router({
  routes,
  mode: 'history'
})
const LOGIN_PAGE_NAME = 'login'

// const turnTo = (to, access, next) => {
//   // 改为动态加载路由后不需要验证菜单权限，菜单的控制交给后端控制
//   if (canTurnTo(to.name, access, routes)) next() // 有权限，可访问
//   else next({ replace: true, name: 'error_401' }) // 无权限，重定向到401页面
// }

router.beforeEach((to, from, next) => {
  iView.LoadingBar.start()
  const token = getToken()
  
  if (!token && to.name !== LOGIN_PAGE_NAME) {
    // 未登录且要跳转的页面不是登录页
    next({
      name: LOGIN_PAGE_NAME // 跳转到登录页
    })
  } else if (!token && to.name === LOGIN_PAGE_NAME) {
    // 未登陆且要跳转的页面是登录页
    next() // 跳转
  } else if (token && to.name === LOGIN_PAGE_NAME) {
    // 已登录且要跳转的页面是登录页
    next({
      name: homeName // 跳转到homeName页
    })
  } else {
    next()
    // if(store.state.user.hasGetAccessInfo){
    //   if(!store.state.user.hasGetInfo){
    //     // 这里要重新加载用户信息
    //     // 可以存到客户端的localstorage中
    //   }
    //   store.commit('setHasGetInfo',true)
    //   console.log(store.state.user.hasGetInfo + '=' + store.state.user.hasGetAccessInfo)
    //   if (store.state.user.hasGetInfo && store.state.user.hasGetAccessInfo) {
    //     console.log('用户信息和权限已经加载过了')
    //     next()
    //     // turnTo(to, store.state.user.access, next)
    //   } else {
    //     if (getToken()) {
    //       // 已登陆用户
    //       console.log('获取到用户的token信息，直接去加载用户的权限菜单')
    //       store.dispatch('getUserAccess')
    //       next()
    //     } else {
    //       console.log('没有token信息，跳转到登录页')
    //       next({
    //         name: LOGIN_PAGE_NAME
    //       })
    //     }
    //   }
    // }else{
    //   setToken("")
    //   next({
    //     name: LOGIN_PAGE_NAME
    //   })
    // }
    
  }
})

router.afterEach(to => {
  iView.LoadingBar.finish()
  window.scrollTo(0, 0)
})

export default router
