import { utilService } from './util.service.js'

export const bugsService = {
  query,
  getById,
  remove,
  save,
}

const PAGE_SIZE = 3
let bugs = utilService.readJsonFile('./data/bug.json')

function query(filterBy) {
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

  const startIdx = filterBy.pageIdx * PAGE_SIZE
  filteredBugs = filteredBugs.slice(startIdx, startIdx + PAGE_SIZE)
  console.log(filteredBugs)
  return Promise.resolve(filteredBugs)
}

function getById(bugId) {
  const bug = bugs.find((bug) => bug._id === bugId)
  return Promise.resolve(bug)
}

function remove(bugId) {
  console.log(bugs)
  const idx = bugs.findIndex((bug) => bug._id === bugId)
  bugs.splice(idx, 1)

  return _saveBugsToFile()
}

function save(bugToSave) {
  console.log(bugToSave)
  if (bugToSave._id) {
    const idx = bugs.findIndex((bug) => bug._id === bugToSave._id)
    bugs.splice(idx, 1, bugToSave)
  } else {
    bugToSave._id = utilService.makeId()
    bugs.push(bugToSave)
  }
  return _saveBugsToFile().then(() => bugToSave)
}

function _saveBugsToFile() {
  return utilService.writeJsonFile('./data/bug.json', bugs)
}
