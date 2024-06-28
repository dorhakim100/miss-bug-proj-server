const { useState, useEffect } = React

import { userService } from '../services/user.service.js'

export function UserIndex() {
  const [user, setUser] = useState(userService.getLoggedInUser())

  const [users, setUsers] = useState([])

  useEffect(() => {
    userService.getAllUsers().then((users) => {
      console.log(users)
      setUsers(users)
    })
  }, [])

  return (
    <div className='user-index-container'>
      <h1>{`Hello ${user.fullName}`}</h1>
      <div className='users-list-container'>
        {users.map((user) => {
          if (!user.isAdmin)
            return (
              <div className='user-container'>
                <h2>{user.fullName}</h2>
                <h3>Username: {user.username}</h3>
                <h3 className='user-password-container'>
                  Password:{' '}
                  <span className='user-password'>{user.password}</span>
                </h3>
                <button className='password-reveal'>Hold to reveal</button>
                <h4>ID: {user._id}</h4>
                {!user.isAdmin && <button>Remove User</button>}
              </div>
            )
        })}
      </div>
    </div>
  )
}
