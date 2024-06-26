import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service.js'
import { userService } from '../services/user.service.js'

const { useState } = React

export function LoginSignUp({ onSetUser }) {
  const [isSignUp, setIsSignUp] = useState(false)
  const [credentials, setCredentials] = useState(
    userService.getEmptyCredentials()
  )

  function handleChange({ target }) {
    const { name: field, value } = target
    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      [field]: value,
    }))
  }

  function handleSubmit(ev) {
    ev.preventDefault()
    isSignUp ? signUp(credentials) : login(credentials)
  }

  function login(credentials) {
    userService
      .login(credentials)
      .then(onSetUser)
      .then(() => {
        showSuccessMsg('Logged in successfully')
      })
      .catch((err) => {
        showErrorMsg(`Couldn't login`)
      })
  }

  function signUp(credentials) {
    console.log(credentials)
    userService
      .signup(credentials)
      .then(onSetUser)
      .then(() => {
        showSuccessMsg('Signed in successfully')
      })
      .catch((err) => {
        showErrorMsg(`Couldn't login`)
      })
  }

  return (
    <div className='login-page'>
      <form className='login-form' onSubmit={handleSubmit}>
        <input
          type='text'
          name='username'
          value={credentials.username}
          placeholder='Username'
          onChange={handleChange}
          required
          autoFocus
        />
        <input
          type='password'
          name='password'
          value={credentials.password}
          placeholder='Password'
          onChange={handleChange}
          required
          autoComplete='off'
        />
        {isSignUp && (
          <input
            type='text'
            name='fullName'
            value={credentials.fullName}
            placeholder='Full name'
            onChange={handleChange}
            required
          />
        )}
        <button>{isSignUp ? 'Signup' : 'Login'}</button>
      </form>

      <div className='btns'>
        <a href='#' onClick={() => setIsSignUp(!isSignUp)}>
          {isSignUp ? 'Already a member? Login' : 'New user? Signup here'}
        </a>
      </div>
    </div>
  )
}
