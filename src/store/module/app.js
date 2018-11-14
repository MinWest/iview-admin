import {
  getBreadCrumbList,
  setTagNavListInLocalstorage,
  getMenuByRouter,
  getTagNavListFromLocalstorage,
  getHomeRoute,
  getNextRoute,
  routeHasExist,
  routeEqual,
  getRouteTitleHandled,
  localSave,
  localRead,
  getToken,
  initDynamicRouter
} from '@/libs/util'
import beforeClose from '@/router/before-close'
import { saveErrorLogger } from '@/api/data'
import router from '@/router'
import routers from '@/router/routers'
import config from '@/config'
import { getUserAccessInfo } from '@/api/user'
const { homeName } = config

const closePage = (state, route) => {
  const nextRoute = getNextRoute(state.tagNavList, route)
  state.tagNavList = state.tagNavList.filter(item => {
    return !routeEqual(item, route)
  })
  router.push(nextRoute)
}

export default {
  // namespaced: true,
  state: {
    userMenuList: [],
    breadCrumbList: [],
    tagNavList: [],
    homeRoute: {},
    local: localRead('local'),
    errorList: [],
    hasReadErrorPage: false
  },
  getters: {
    menuList: (state, getters, rootState) => {
      let allRouters = state.userMenuList.concat(routers)
      // console.log('-------------')
      // console.log(allRouters)
      // console.log(routers)
      // console.log(state.userMenuList)
      // console.log('-------------')
      return getMenuByRouter(allRouters, rootState.user.access)
    },
    errorCount: state => state.errorList.length
  },
  mutations: {
    initRouters (state, routers) {
      initDynamicRouter(routers)
      console.log('initRouters...')
      console.log(routers)
      router.addRoutes(routers)
      state.userMenuList = routers
    },
    setBreadCrumb (state, route) {
      state.breadCrumbList = getBreadCrumbList(route, state.homeRoute)
    },
    setHomeRoute (state, routes) {
      state.homeRoute = getHomeRoute(routes, homeName)
    },
    setTagNavList (state, list) {
      let tagList = []
      if (list) {
        tagList = [...list]
      } else tagList = getTagNavListFromLocalstorage() || []
      if (tagList[0] && tagList[0].name !== homeName) tagList.shift()
      let homeTagIndex = tagList.findIndex(item => item.name === homeName)
      if (homeTagIndex > 0) {
        let homeTag = tagList.splice(homeTagIndex, 1)[0]
        tagList.unshift(homeTag)
      }
      state.tagNavList = tagList
      setTagNavListInLocalstorage([...tagList])
    },
    closeTag (state, route) {
      let tag = state.tagNavList.filter(item => routeEqual(item, route))
      route = tag[0] ? tag[0] : null
      if (!route) return
      if (route.meta && route.meta.beforeCloseName && route.meta.beforeCloseName in beforeClose) {
        new Promise(beforeClose[route.meta.beforeCloseName]).then(close => {
          if (close) {
            closePage(state, route)
          }
        })
      } else {
        closePage(state, route)
      }
    },
    addTag (state, { route, type = 'unshift' }) {
      let router = getRouteTitleHandled(route)
      if (!routeHasExist(state.tagNavList, router)) {
        if (type === 'push') state.tagNavList.push(router)
        else {
          if (router.name === homeName) state.tagNavList.unshift(router)
          else state.tagNavList.splice(1, 0, router)
        }
        setTagNavListInLocalstorage([...state.tagNavList])
      }
    },
    setLocal (state, lang) {
      localSave('local', lang)
      state.local = lang
    },
    addError (state, error) {
      state.errorList.push(error)
    },
    setHasReadErrorLoggerStatus (state, status = true) {
      state.hasReadErrorPage = status
    }
  },
  actions: {
    addErrorLog ({ commit, rootState }, info) {
      if (!window.location.href.includes('error_logger_page')) commit('setHasReadErrorLoggerStatus', false)
      const { user: { token, userId, userName } } = rootState
      let data = {
        ...info,
        time: Date.parse(new Date()),
        token,
        userId,
        userName
      }
      saveErrorLogger(info).then(() => {
        commit('addError', data)
      })
    },
    initRoutersAction ({ commit, rootState }, array) {
      commit('initRouters', array)
      dispatch('setTagNavList')
      dispatch('setHomeRoute', routers)
      commit('addTag', {
        route: this.$store.state.app.homeRoute
      })
      commit('setBreadCrumb', router)
      // // 重新拉取菜单信息
      // let token = getToken()
      // getUserAccessInfo(token).then((rs) => {
      //   if (rs.data.data && rs.data.data.length > 0) {
      //     console.log('接口返回菜单权限数据')
      //     commit('initRouters', rs.data.data)
      //     dispatch('setTagNavList')
      //     dispatch('setHomeRoute', routers)
      //     commit('addTag', {
      //       route: this.$store.state.app.homeRoute
      //     })
      //     commit('setBreadCrumb', router)
      //   } else {
      //     console.log(rs)
      //     console.log('接口返回菜单权限数据weikong')
      //   }
      // }).catch(rs => {

      // })
    }
  }
}
