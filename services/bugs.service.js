import { utilService } from './util.service.js'

export const bugsService = {
  query,
  getById,
  remove,
  save,
  getAllUserBugs,
}

const PAGE_SIZE = 3
let bugs = utilService.readJsonFile('./data/bug.json')

function query(
  filterBy = {
    severityDown: false,
    txt: '',
    minSeverity: 0,
    labels: [],
    pageIdx: null,
  }
) {
  console.log(filterBy)
  let filteredBugs
  // console.log(bugs)
  if (filterBy.severityDown) {
    filteredBugs = bugs.sort((a, b) => {
      if (a.severity < b.severity) return 1
      if (a.severity > b.severity) return -1
      return 0
    })
  } else {
    filteredBugs = bugs.sort((a, b) => {
      if (a.severity < b.severity) return -1
      if (a.severity > b.severity) return 1
      return 0
    })
  }

  if (filterBy.txt) {
    const regExp = new RegExp(filterBy.txt, 'i')
    filteredBugs = filteredBugs.filter(
      (bug) => regExp.test(bug.title) || regExp.test(bug.description)
    )
  }
  if (filterBy.minSeverity) {
    filteredBugs = filteredBugs.filter(
      (bug) => bug.severity >= filterBy.minSeverity
    )
  }

  console.log(filterBy.labels)

  if (filterBy.labels?.length) {
    filteredBugs = filteredBugs.filter((bug) => {
      return filterBy.labels.every((label) => {
        if (bug.labels.includes(label)) {
          return bug
        }
      })
    })
  }
  if (filterBy.pageIdx === null) {
    console.log(filteredBugs)
    return Promise.resolve(filteredBugs)
  } else {
    const startIdx = filterBy.pageIdx * PAGE_SIZE
    filteredBugs = filteredBugs.slice(startIdx, startIdx + PAGE_SIZE)
    console.log(filteredBugs)
    return Promise.resolve(filteredBugs)
  }
}

function getById(bugId) {
  const bug = bugs.find((bug) => bug._id === bugId)
  return Promise.resolve(bug)
}

function remove(bugId, loggedInUser) {
  console.log(bugs)
  const idx = bugs.findIndex((bug) => bug._id === bugId)
  if (idx === -1) return Promise.reject('No such bug')
  const bug = bugs[idx]
  if (!loggedInUser.isAdmin && bug.owner._id !== loggedInUser._id) {
    return Promise.reject('Not your bug')
  }
  bugs.splice(idx, 1)

  return _saveBugsToFile()
}

function save(bugToSave, loggedInUser) {
  // console.log('bugToSave:', bugToSave)

  if (bugToSave._id) {
    const bugToUpdate = bugs.find((currBug) => currBug._id === bugToSave._id)
    console.log('bugToUpdate: ', bugToUpdate)
    if (!loggedInUser.isAdmin && bugToUpdate.owner._id !== loggedInUser._id) {
      return Promise.reject('Not your bug')
    }

    bugToUpdate.severity = bugToSave.severity

    return _saveBugsToFile().then(() => bugToUpdate)
  } else {
    bugToSave._id = utilService.makeId()
    bugToSave.owner = loggedInUser
    bugs.push(bugToSave)
  }
  return _saveBugsToFile().then(() => bugToSave)
}

function _saveBugsToFile() {
  return utilService.writeJsonFile('./data/bug.json', bugs)
}

function getAllUserBugs(userId) {
  // console.log('allBugs:', bugs)
  const userBugs = bugs.filter((bug) => bug.owner._id === userId)
  console.log(userBugs)
  return userBugs
  // return Promise.resolve(userBugs)
}
