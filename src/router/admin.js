'use strict'

export default [
  {
    path: '/:username/admin',
    name: 'admin/home',
    component: () => import('@/views/admin/Home.vue'),
    meta: { isPublic: false, staffOnly: true, view: 'admin' },
    children: []
  },
]
