const { useState, useEffect } = React
const { Link } = ReactRouterDOM
import { userService } from '../services/user.service.js'
import { bugService } from '../services/bug.service.js'

import { BugList } from './BugList.jsx'

export function UserDetails() {
  const [user, setUser] = useState(userService.getLoggedInUser())
  const [userBugs, setUserBugs] = useState([])

  useEffect(() => {
    console.log(user)
    const userId = user._id

    userService.get(userId).then((user) => {
      console.log(user)
      console.log(user.userBugs)
      setUserBugs(user.userBugs)
    })
  }, [])

  return (
    <div className='user-details-container'>
      <h2>Hello {user.fullName}</h2>
      <h3>User Id: {user._id}</h3>
      {user.isAdmin && <h4>User is admin</h4>}
      <lorem>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam iusto
        ducimus quam veniam sunt dolor ipsum fugit eum delectus consequatur,
        assumenda, repellat ratione maiores, molestias laborum similique
        asperiores quibusdam temporibus.
      </lorem>
      <h3>User's bugs:</h3>
      <div className='users-bugs-container'>
        {userBugs.map((bug) => {
          return (
            <div className='users-bug'>
              <h3>{bug.title}</h3>
              <p>{bug.description}</p>
              <button>
                <Link to={`/bug/${bug._id}`}>Details</Link>
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
