import axios from 'axios'

const STORAGE_KEY_LOGGEDIN_USER = 'loggedInUser'
const BASE_URL = '/api/user'

export const userService = {
  login,
  signup,
  logout,
  get,
  getLoggedInUser,
  getEmptyCredentials,
  getAllUsers,
}

function get(userId) {
  return axios.get(BASE_URL + '/' + userId).then((res) => res.data)
}

function getAllUsers() {
  const user = getLoggedInUser()
  if (!user.isAdmin) return
  return axios.get(BASE_URL).then((res) => res.data)
}

function getLoggedInUser() {
  return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER))
}

function login({ username, password }) {
  return axios
    .post('/api/auth/login', { username, password })
    .then((res) => res.data)
    .then((user) => {
      sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user))
      return user
    })
}

function signup({ username, password, fullName }) {
  console.log(fullName)
  return axios
    .post('/api/auth/signup', { username, password, fullName })
    .then((res) => res.data)
    .then((user) => {
      sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user))
      return user
    })
}

function logout() {
  return axios.post('/api/auth/logout').then(() => {
    sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
  })
}

function getEmptyCredentials() {
  return {
    username: '',
    password: '',
    fullname: '',
  }
}
