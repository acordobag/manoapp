'use strict'
import Api from '@/services/Api'

export default {
  auth: data => Api.post('/users/auth', data),
  data: () => Api.get('/users'),
  password: data => Api.patch('/users/password', data),
  create: data => Api.post('/users/create', data),
  list: () => Api.get('/users/list'),
  getAdvisers: () => Api.get('/users/advisers'),
  getLinks: (membershipId) => Api.get(`/users/links/${membershipId}`),
  getById: userId => Api.get(`/users/${userId}`),
  confirm: () => Api.patch('/users/confirm'),
  createContact: data => Api.post('/users/contact', data),
  deleteContact: id => Api.delete(`/users/contact/${id}`),
  checkUsername: username => Api.get(`/users/check/${username}`),
  username: data => Api.patch(`/users/username`, data)
}
