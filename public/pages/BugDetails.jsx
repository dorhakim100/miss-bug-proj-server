const { useState, useEffect } = React
const { Link, useParams } = ReactRouterDOM

import { bugService } from '../services/bug.service.js'
import { showErrorMsg } from '../services/event-bus.service.js'

export function BugDetails() {
  const [bug, setBug] = useState(null)
  const { bugId } = useParams()

  useEffect(() => {
    bugService
      .getById(bugId)
      .then((bug) => {
        const time = +bug.createdAt
        let date = new Date(time)
        bug.date = date.toLocaleString()

        setBug(bug)
      })
      .catch((err) => {
        showErrorMsg('Cannot load bug')
      })
  }, [])

  if (!bug) return <h1>loadings....</h1>
  return (
    <div className='bug-details-container'>
      <h3>Bug Details 🐛</h3>
      <div className='bug-details-title-container'>
        <h3>{bug.title}</h3>
        {bug.severity <= 3 && <img src={`img/1.png`} alt='' />}
        {bug.severity > 3 && bug.severity <= 7 && (
          <img src={`img/2.png`} alt='' />
        )}
        {bug.severity > 7 && <img src={`img/3.png`} alt='' />}
      </div>
      {bug.createdAt && <h4>{bug.date}</h4>}
      <h4>Severity:</h4>
      <p>{bug.severity}</p>
      <h4>Description:</h4>
      <p>{bug.description}</p>
      <h4>Labels:</h4>
      <div className='labels-container'>
        {bug.labels &&
          bug.labels.map((label) => {
            return label.isChecked && <span key={label.name}>{label.name}</span>
          })}
      </div>
      <Link to='/bug'>Back to List</Link>
    </div>
  )
}
