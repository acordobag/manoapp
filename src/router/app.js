'use strict'

import admin from '@/router/admin'

export default [
  { path: '/:username',
    component: () => import('@/components/layouts/App.vue'),
    meta: { isPublic: true, staffOnly: false },
    children: [
      {
        path: '/',
        name: 'home/app',
        component: () => import('@/views/app/Dashboard.vue'),
        meta: { isPublic: false, staffOnly: false },
        children: [
          {
            path: '/:username/subscription/:hash',
            name: 'subscription/detail',
            component: () => import('@/components/subscriptions/Detail.vue'),
            meta: { isPublic: false, staffOnly: false }
          },
          {
            path: '/:username/legacies/:hash/:id',
            name: 'legacy/detail',
            component: () => import('@/components/pending-legacies/Detail.vue'),
            meta: { isPublic: false, staffOnly: false }
          }
        ]
      },
      {
        path: '/:username/profile',
        name: 'profile',
        component: () => import('@/views/app/Profile.vue'),
        meta: { isPublic: false, staffOnly: false },
        children: [
          {
            path: '/:username/profile/data',
            name: 'profile/data',
            component: () => import('@/views/app/profile/Data.vue'),
            meta: { isPublic: false, staffOnly: false },
            children: [
              {
                path: '/:username/profile/data/photo',
                name: 'profile/data/photo',
                component: () => import('@/views/app/profile/ChangePhoto.vue'),
                meta: { isPublic: false, staffOnly: false }
              }
            ]
          },
          {
            path: '/:username/profile/contacts',
            name: 'profile/contacts',
            component: () => import('@/views/app/profile/Contacts.vue'),
            meta: { isPublic: false, staffOnly: false }
          },
          {
            path: '/:username/profile/settings',
            name: 'profile/settings',
            component: () => import('@/views/app/profile/Settings.vue'),
            meta: { isPublic: false, staffOnly: false },
            children: [
              {
                path: '/:username/profile/settings/change-password',
                name: 'profile/settings/changePassword',
                component: () => import('@/views/app/profile/ChangePassword.vue'),
                meta: { isPublic: false, staffOnly: false }
              },
              {
                path: '/:username/profile/settings/change-username',
                name: 'profile/settings/changeUsername',
                component: () => import('@/views/app/profile/ChangeUsername.vue'),
                meta: { isPublic: false, staffOnly: false }
              }
            ]
          }
        ]
      },
      {
        path: '/:username/annexes',
        name: 'annexes',
        component: () => import('@/views/app/Annexes.vue'),
        meta: { isPublic: false, staffOnly: false },
        children: [
          {
            path: '/:username/annexes/legacy/:hash/:id',
            name: 'annex/legacy/detail',
            component: () => import('@/components/annex/Detail.vue'),
            meta: { isPublic: false, staffOnly: false }
          }
        ]
      },
      {
        path: '/:username/documents',
        name: 'documents',
        component: () => import('@/views/app/Documents.vue'),
        meta: { isPublic: false, staffOnly: false }
      },
      {
        path: '/:username/links',
        name: 'links',
        component: () => import('@/views/app/Links.vue'),
        meta: { isPublic: false, staffOnly: false },
        children: [
          {
            path: '/:username/links/new',
            name: 'newLink',
            component: () => import('@/views/app/links/NewLink.vue'),
            meta: { isPublic: false, staffOnly: false },
          }
        ]
      },
      ...admin
    ]
  },
  {
    path: '/:username/activate',
    name: 'activate',
    component: () => import('@/views/app/Activate.vue'),
    meta: { isPublic: false, staffOnly: false }
  },
  {
    path: '/logout',
    name: 'logout',
    component: () => import('@/views/app/Logout.vue'),
    meta: { isPublic: false, staffOnly: false }
  }
]
