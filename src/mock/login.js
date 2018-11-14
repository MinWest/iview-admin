import { getParams } from '@/libs/util'
const USER_MAP = {
  super_admin: {
    name: 'super_admin',
    user_id: '1',
    access: ['super_admin', 'admin'],
    token: 'super_admin',
    avator: 'https://file.iviewui.com/dist/a0e88e83800f138b94d2414621bd9704.png'
  },
  admin: {
    name: 'admin',
    user_id: '2',
    access: ['admin'],
    token: 'admin',
    avator: 'https://avatars0.githubusercontent.com/u/20942571?s=460&v=4'
  }
}

export const login = req => {
  req = JSON.parse(req.body)
  return { token: USER_MAP[req.userName].token }
}

export const getUserInfo = req => {
  const params = getParams(req.url)
  return USER_MAP[params.token]
}
export const getUserAccessInfo = req => {
  const params = getParams(req.url)
  console.log(params)
  console.log('获取用户的访问权限（菜单列表）')
  return {
    state: 1,
    data: [
      {
        path: '/excel',
        name: 'excel',
        meta: {
          icon: 'ios-stats',
          title: 'EXCEL导入导出'
        },
        component: 'main',
        children: [
          {
            path: 'upload-excel',
            name: 'upload-excel',
            meta: {
              icon: 'md-add',
              title: '导入EXCEL'
            },
            component: 'excel/upload-excel'
          },
          {
            path: 'export-excel',
            name: 'export-excel',
            meta: {
              icon: 'md-download',
              title: '导出EXCEL'
            },
            component: 'excel/export-excel'
          }
        ]
      },
      {
        path: '/update',
        name: 'update',
        meta: {
          icon: 'md-cloud-upload',
          title: '数据上传'
        },
        component: 'main',
        children: [
          {
            path: 'update_table_page',
            name: 'update_table_page',
            meta: {
              icon: 'ios-document',
              title: '上传Csv'
            },
            component: 'update/update-table'
          },
          {
            path: 'update_paste_page',
            name: 'update_paste_page',
            meta: {
              icon: 'md-clipboard',
              title: '粘贴表格数据'
            },
            component: 'update/update-paste'
          }
        ]
      }
    ]
  }
}

export const logout = req => {
  return null
}
