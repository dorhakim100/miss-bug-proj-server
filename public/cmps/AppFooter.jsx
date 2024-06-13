import { showSuccessMsg } from '../services/event-bus.service.js'
const { useEffect } = React

export function AppFooter() {
  useEffect(() => {
    // component did mount when dependancy array is empty
  }, [])

  return (
    <footer className='footer'>
      <p>coffeerights to all</p>
      <div className='footer-links-container'>
        <i className='fa-brands fa-facebook'></i>
        <i className='fa-brands fa-instagram'></i>
        <i className='fa-brands fa-twitter'></i>
      </div>
    </footer>
  )
}
