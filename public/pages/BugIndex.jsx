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
    // filterBy(filter).then((bugs) => {
    //   console.log(bugs)
    //   setBugs(bugs)
    // })
    bugService
      .query(filter)
      .then((bugs) => setBugs(bugs))
      .catch((err) => console.log('err:', err))
      .finally(console.log(bugs))
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
    const t = Date.now()
    bug.createdAt = t

    Swal.fire({
      title: 'Bug title?',
      input: 'text',
      icon: 'question',
    }).then((title) => {
      console.log(title)
      bug.title = title.value
      Swal.fire({
        title: 'Bug severity?',
        input: 'range',
        icon: 'warning',
        inputAttributes: {
          min: '0',
          max: '10',
          step: '1',
        },
        inputValue: 5,
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
            Swal.fire({
              title: 'Bug labels?',
              // input: 'checkbox',
              html:
                '<h3>critical <input type="checkbox" id="critical"  /></h3><p/>' +
                '<h3>need-CR <input type="checkbox" id="needCR"  /></h3>' +
                '<h3>dev-branch <input type="checkbox" id="devBranch"  /></h3>',
              confirmButtonText: `
                Add bug
              `,
              preConfirm: () => {
                let critical =
                  Swal.getPopup().querySelector('#critical').checked
                let needCR = Swal.getPopup().querySelector('#needCR').checked
                let devBranch =
                  Swal.getPopup().querySelector('#devBranch').checked
                bug.labels = []
                if (critical) {
                  bug.labels.push('critical')
                }
                if (needCR) {
                  bug.labels.push('needCR')
                }
                if (devBranch) {
                  bug.labels.push('devBranch')
                }
                // bug.labels = [
                //   critical && 'critical',
                //   needCR && 'needCR',
                //   devBranch && 'devBranch',
                // ]
                return {
                  critical: critical,
                  needCR: needCR,
                  devBranch: devBranch,
                }
              },
            }).then((data) => {
              console.log(data)
              console.log(bug)
              // bugService.query(filter).then((bugs) => {
              //   if (bugs.length === 6) {
              //     filter.pageIdx++
              //   }
              // })
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

  function filterBy(filterBy) {
    console.log(filterBy)
    // const regExp = new RegExp(filterBy.txt, 'i')

    return bugService.query(filterBy).then((bugs) => {
      if (!filterBy.txt && !filterBy.minSeverity) {
        return bugs
      } else {
        return bugs
        // .filter(
        // (bug) => regExp.test(bug.title) || regExp.test(bug.description)
        // )
        // .filter((bug) => bug.severity >= filterBy.minSeverity)
      }
    })
  }

  function changePage(diff) {
    if (filter.pageIdx === 0 && diff === -1) {
    }
    console.log(filter)
    const preFilter = filter
    filter.pageIdx = preFilter.pageIdx + diff
    setFilter(filter)
    bugService.query(filter).then((bugs) => {
      if (bugs.length === 0) {
        filter.pageIdx = 0
        bugService.query(filter).then((bugs) => {
          setBugs(bugs)
        })
        return
      }
      setBugs(bugs)
    })

    console.log(filter)
  }

  function filterLabels(label) {
    if (filter.labels.includes(label)) {
      const labelIdx = filter.labels.findIndex(
        (labelName) => labelName === label
      )
      filter.labels.splice(labelIdx, 1)
    } else {
      filter.labels.push(label)
    }
    bugService.query(filter).then((bugs) => {
      console.log(bugs)
      setBugs(bugs)
    })
  }

  function toggleDirectionToDown(isDown) {
    filter.severityDown = isDown
    filter.pageIdx = 0
    bugService.query(filter).then((bugs) => {
      console.log(bugs)
      setBugs(bugs)
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
          filterBy={filterBy}
          changePage={changePage}
          filterLabels={filterLabels}
          toggleDirectionToDown={toggleDirectionToDown}
        />
        <BugList bugs={bugs} onRemoveBug={onRemoveBug} onEditBug={onEditBug} />
      </main>
    </main>
  )
}
