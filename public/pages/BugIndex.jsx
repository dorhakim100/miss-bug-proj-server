// import { bugService } from '../services/bug.service.js'
import { bugService } from '../services/bug.service.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { BugList } from '../cmps/BugList.jsx'
import { UserInterface } from '../cmps/UserInterface.jsx'
import { utilService } from '../services/util.service.js'

const { useState, useEffect } = React

export function BugIndex() {
  const [bugs, setBugs] = useState([])
  const [filter, setFilter] = useState(bugService.getDefaultFilter())

  useEffect(() => {
    // loadBugs()
    filterByTxt(filter).then((bugs) => {
      console.log(bugs)
      setBugs(bugs)
    })
  }, [filter])

  function loadBugs() {
    // bugService.query().then(setBugs)
    console.log(filter)
    bugService.query().then((bugs) => {
      setBugs(bugs)
    })
  }

  function onRemoveBug(bugId) {
    bugService
      .remove(bugId)
      .then(() => {
        console.log('Deleted Succesfully!')
        setBugs((prevBugs) => prevBugs.filter((bug) => bug._id !== bugId))
        showSuccessMsg('Bug removed')
      })
      .catch((err) => {
        console.log('Error from onRemoveBug ->', err)
        showErrorMsg('Cannot remove bug')
      })
  }

  function onAddBug() {
    const bug = {}

    Swal.fire({
      title: 'Bug title?',
      input: 'text',
      icon: 'question',
    }).then((title) => {
      console.log(title)
      bug.title = title.value
      Swal.fire({
        title: 'Bug severity?',
        input: 'number',
        icon: 'warning',
      })
        .then((severity) => {
          return (severity = +severity.value)
        })
        .then((severity) => {
          bug.severity = severity
          Swal.fire({
            title: 'Bug description?',
            input: 'text',
            icon: 'info',
          }).then((description) => {
            bug.description = description.value
            console.log(bug)

            bugService
              .save(bug)
              .then((savedBug) => {
                console.log('Added Bug', savedBug)
                setBugs((prevBugs) => [...prevBugs, savedBug])
                showSuccessMsg('Bug added')
              })
              .catch((err) => {
                console.log('Error from onAddBug ->', err)
                showErrorMsg('Cannot add bug')
              })
          })
          // })
        })
    })
  }

  function onEditBug(bug) {
    let severity
    Swal.fire({
      title: 'Bug severity?',
      input: 'number',
      icon: 'warning',
    }).then((output) => {
      severity = +output.value
      const bugToSave = { ...bug, severity }
      bugService
        .save(bugToSave)
        .then((savedBug) => {
          console.log('Updated Bug:', savedBug)
          setBugs((prevBugs) =>
            prevBugs.map((currBug) =>
              currBug._id === savedBug._id ? savedBug : currBug
            )
          )
          showSuccessMsg('Bug updated')
        })
        .catch((err) => {
          console.log('Error from onEditBug ->', err)
          showErrorMsg('Cannot update bug')
        })
    })
  }

  function filterByTxt(filterBy) {
    console.log(filterBy)
    const regExp = new RegExp(filterBy.txt, 'i')

    return bugService.query(bugs).then((bugs) => {
      if (!filterBy.txt) {
        return bugs
      } else {
        return bugs.filter(
          (bug) => regExp.test(bug.title) || regExp.test(bug.description)
          // regExp.test(bug.severity)
        )
      }
    })
  }

  return (
    <main>
      <h3>Bugs App</h3>
      <main>
        <UserInterface
          onAddBug={onAddBug}
          filter={filter}
          setFilter={setFilter}
          filterByTxt={filterByTxt}
        />
        <BugList bugs={bugs} onRemoveBug={onRemoveBug} onEditBug={onEditBug} />
      </main>
    </main>
  )
}
