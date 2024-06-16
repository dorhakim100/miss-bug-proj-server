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
        <h4>{bug.title}</h4>
        {bug.severity <= 3 && <img src={`img/1.png`} alt='' />}
        {bug.severity > 3 && bug.severity <= 7 && (
          <img src={`img/2.png`} alt='' />
        )}
        {bug.severity > 7 && <img src={`img/3.png`} alt='' />}
      </div>
      <p>
        Severity: <span>{bug.severity}</span>
      </p>
      <p>Description: {bug.description}</p>
      <Link to='/bug'>Back to List</Link>
    </div>
  )
}
