const { Link, NavLink } = ReactRouterDOM
const { useEffect, useState } = React
const { useNavigate } = ReactRouter

import { UserMsg } from './UserMsg.jsx'
import { LoginSignUp } from './LoginSignUp.jsx'
import { userService } from '../services/user.service.js'
import { showErrorMsg } from '../services/event-bus.service.js'

export function AppHeader() {
  const [user, setUser] = useState(userService.getLoggedInUser())

  const navigate = useNavigate()

  function onLogout() {
    userService
      .logout()
      .then(() => {
        onSetUser(null)
      })
      .catch((err) => {
        showErrorMsg(`oops`)
      })
  }

  function onSetUser(user) {
    setUser(user)
    navigate('/')
  }

  useEffect(() => {
    // component did mount when dependancy array is empty
    console.log(user)
  }, [])

  return (
    <header>
      <section className='header-container'>
        <UserMsg />
        <nav className='app-nav'>
          <NavLink to='/'>Home</NavLink> |<NavLink to='/bug'>Bugs</NavLink> |
          <NavLink to='/about'>About</NavLink>{' '}
          {user && user.isAdmin && (
            <NavLink to='/userIndex'>User Index</NavLink>
          )}
        </nav>
        <h1>Bugs are Forever</h1>
      </section>
      {user ? (
        <section>
          <Link to={`/user/${user._id}`}>Hello {user.fullName}</Link>
          <button onClick={onLogout}>Logout</button>
        </section>
      ) : (
        <section>
          <LoginSignUp onSetUser={onSetUser} />
        </section>
      )}
    </header>
  )
}
