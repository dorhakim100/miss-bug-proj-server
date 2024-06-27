const { useState, useEffect } = React
import { userService } from '../services/user.service.js'

export function UserDetails() {
  const [user, setUser] = useState(userService.getLoggedInUser())

  useEffect(() => {
    console.log(user)
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
    </div>
  )
}
