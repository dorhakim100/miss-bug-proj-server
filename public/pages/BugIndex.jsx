// import { bugService } from '../services/bug.service.js'
import { bugService } from '../services/bug.service.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { BugList } from '../cmps/BugList.jsx'

const { useState, useEffect } = React

export function BugIndex() {
  const [bugs, setBugs] = useState([])

  useEffect(() => {
    console.log('works')
    loadBugs()
  }, [])

  function loadBugs() {
    // bugService.query().then(setBugs)
    console.log('works')
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

  return (
    <main>
      <h3>Bugs App</h3>
      <main>
        <div className='add-btn-container'>
          <button className='add-btn' onClick={onAddBug}>
            Add Bug ⛐
          </button>
        </div>
        <BugList bugs={bugs} onRemoveBug={onRemoveBug} onEditBug={onEditBug} />
      </main>
    </main>
  )
}
