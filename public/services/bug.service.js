// import axios from 'axios'
import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'

// const STORAGE_KEY = 'bugDB'
const BASE_URL = '/api/bug'

export const bugService = {
  query,
  getById,
  save,
  remove,
  getDefaultFilter,
}

function query() {
  return axios.get(BASE_URL).then((res) => {
    return res.data
  })
}
function getById(bugId) {
  return axios.get(BASE_URL + '/' + bugId).then((res) => res.data)
}
function remove(bugId) {
  return axios.get(BASE_URL + '/' + bugId + '/remove').then((res) => res.data)
}
function save(bug) {
  const queryStr = `/save?title=${bug.title}&severity=${
    bug.severity
  }&description=${bug.description}&_id=${bug._id || ''}`

  return axios.get(BASE_URL + queryStr).then((res) => res.data)
}

function getDefaultFilter(filterBy = { txt: '' }) {
  // console.log(filterBy)
  return { txt: '' }
}
