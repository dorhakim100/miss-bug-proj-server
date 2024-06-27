const { Link } = ReactRouterDOM
const { useState, useEffect } = React

import { BugPreview } from './BugPreview.jsx'
import { userService } from '../services/user.service.js'

export function BugList({ bugs, onRemoveBug, onEditBug }) {
  const [user, setUser] = useState(userService.getLoggedInUser())

  useEffect(() => {
    console.log(user)
  }, [])

  return (
    <ul className='bug-list'>
      {bugs.map((bug) => (
        <li className='bug-preview' key={bug._id}>
          <BugPreview bug={bug} />
          <div>
            {user && (user.isAdmin || bug.owner._id === user._id) && (
              <button
                onClick={() => {
                  onRemoveBug(bug._id)
                }}
              >
                Remove
              </button>
            )}
            {user && (user.isAdmin || bug.owner._id === user._id) && (
              <button
                onClick={() => {
                  onEditBug(bug)
                }}
              >
                Edit
              </button>
            )}
          </div>
          <Link to={`/bug/${bug._id}`}>Details</Link>
        </li>
      ))}
    </ul>
  )
}
