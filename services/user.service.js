import fs from 'fs'
import Cryptr from 'cryptr'
import { utilService } from './util.service.js'
import { bugsService } from './bugs.service.js'

const cryptr = new Cryptr(process.env.SECRET1 || 'secret-1234')
const users = utilService.readJsonFile('data/user.json')

export const userService = {
  query,
  getById,
  remove,
  save,
  checkLogin,
  getLoginToken,
  validateToken,
}

function getLoginToken(user) {
  const str = JSON.stringify(user)
  const encryptedStr = cryptr.encrypt(str)
  return encryptedStr
}

function validateToken(token) {
  if (!token) return null
  const str = cryptr.decrypt(token)
  const user = JSON.parse(str)
  return user
}

function checkLogin({ username, password }) {
  let user = users.find((user) => user.username === username)
  if (user) {
    user = {
      _id: user._id,
      fullName: user.fullName,
      isAdmin: user.isAdmin,
    }
  }
  return Promise.resolve(user)
}

function query() {
  return Promise.resolve(users)
}

function getById(userId) {
  let user = users.find((user) => user._id === userId)
  if (!user) return Promise.reject('User not found')
  const userBugs = bugsService.getAllUserBugs(userId)

  user = {
    _id: user._id,
    username: user.username,
    fullName: user.fullName,
    userBugs: userBugs,
  }

  return Promise.resolve(user)
}

function remove(userId) {
  users = users.filter((user) => user._id !== userId)
  return _saveUsersToFile()
}

function save(user) {
  user._id = utilService.makeId()
  console.log(user)
  users.push(user)
  return _saveUsersToFile().then(() => ({
    _id: user._id,
    fullName: user.fullName,
    isAdmin: user.isAdmin,
  }))
}

function _saveUsersToFile() {
  return new Promise((resolve, reject) => {
    const usersStr = JSON.stringify(users, null, 2)
    fs.writeFile('data/user.json', usersStr, (err) => {
      if (err) {
        return console.log(err)
      }
      resolve()
    })
  })
}
