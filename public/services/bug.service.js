// import axios from 'axios'
import axios from 'axios'
import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'

const BUG_KEY = 'bugDB'
const BASE_URL = '/api/bug'

export const bugService = {
  query,
  getById,
  save,
  remove,
  getDefaultFilter,
  getAllOwnersBugs,
}

function query(filterBy = {}) {
  console.log(filterBy)
  return axios.get(BASE_URL, { params: filterBy }).then((res) => res.data)
}

function getAllOwnersBugs(userId) {
  return axios.get(BASE_URL).then((res) => {
    let bugs = res.data
    console.log(bugs)
    bugs = bugs.filter((bug) => bug.owner._id === userId)
    console.log(bugs)
    return bugs
  })
}

function getById(bugId) {
  return axios.get(BASE_URL + '/' + bugId).then((res) => res.data)
  return axios.get(BASE_URL + '/' + bugId).then((res) => res.data)
}
function remove(bugId) {
  return axios.delete(BASE_URL + '/' + bugId).then((res) => res.data)
  return axios.get(BASE_URL + '/' + bugId + '/remove').then((res) => res.data)
}
function save(bug) {
  console.log('blablabla')
  console.log('bugId:', bug)
  const queryStr = `/save?title=${bug.title}&severity=${
    bug.severity
  }&description=${bug.description}&labels=${JSON.stringify(
    bug.labels
  )}&createdAt=${bug.createdAt}&_id=${bug._id || ''}`

  const method = bug._id ? 'put' : 'post'

  console.log('works')
  if (method === 'put') {
    return axios.put(`${BASE_URL}/${bug._id}`, bug).then((res) => res.data)
  } else if (method === 'post') {
    return axios.post(BASE_URL, bug).then((res) => res.data)
  }

  // return axios[method](BASE_URL, bug).then((res) => res.data)

  // return axios.get(BASE_URL + queryStr).then((res) => res.data)
}

function getDefaultFilter(
  filterBy = {
    txt: '',
    minSeverity: '',
    severityDown: false,
    labels: [],
    pageIdx: 0,
  }
) {
  // console.log(filterBy)
  return filterBy
}
