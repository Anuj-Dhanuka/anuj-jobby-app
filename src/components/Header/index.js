import './index.css'
import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'

const Header = props => {
  const onClickLogout = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <div className="header-bg-container">
      <Link to="/" className="header-link-style">
        <img
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          alt="website logo"
          className="website logo"
        />
      </Link>

      <ul className="nav-items-container">
        <Link to="/" className="header-link-style">
          <li className="nav-items">Home</li>
        </Link>
        <Link to="/jobs" className="header-link-style">
          <li className="nav-items">Jobs</li>
        </Link>
      </ul>
      <li className="btn-li-el">
        <button
          type="button"
          className="header-logout-btn"
          onClick={onClickLogout}
        >
          Logout
        </button>
      </li>
    </div>
  )
}

export default withRouter(Header)
