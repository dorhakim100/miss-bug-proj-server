import { utilService } from '../services/util.service.js'

export function BugPreview({ bug }) {
  return (
    <artice>
      <h4>{bug.title}</h4>
      {bug.severity <= 3 && (
        <img className='bug-severity-img' src={`img/1.png`} alt='' />
      )}
      {bug.severity > 3 && bug.severity <= 7 && (
        <img className='bug-severity-img' src={`img/2.png`} alt='' />
      )}
      {bug.severity > 7 && (
        <img className='bug-severity-img' src={`img/3.png`} alt='' />
      )}
      <p>
        Severity: <span>{bug.severity}</span>
      </p>
    </artice>
  )
}
