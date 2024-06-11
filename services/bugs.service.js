import { utilService } from './util.service.js'

export const bugService = {
  query,
  getById,
  remove,
  save,
}

let bugs = utilService.readJsonFile('./data/bugs.json')

function query() {
  return Promise.resolve(bugs)
}

function getById(bugId) {
  const bug = bugs.find((bug) => bug._id === bugId)
  return Promise.resolve(bug)
}

function remove(bugId) {
  const idx = bugs.findIdx((bug) => bug._id === bugId)
  bugs.splice(idx, 1)

  return _saveBugsToFile()
}

function save(bugToSave) {
  if (bugToSave._id) {
    const idx = bugs.findIndex((bug) => bug._id === bugToSave._id)
    bugs.splice(idx, 1, bugToSave)
  } else {
    bugToSave._id = utilService.makeId()
    bugs.push(bugToSave)
  }
  return _saveCarsToFile().then(() => carToSave)
}

function _saveBugsToFile() {
  return utilService.writeJsonFile('./data/bug.json', bugs)
}
