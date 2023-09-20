import './index.css'
import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'

import {FiLogOut} from 'react-icons/fi'
import {FaShoppingBag} from 'react-icons/fa'
import {AiFillHome} from 'react-icons/ai'

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
          className="header-logo"
        />
      </Link>

      <ul className="nav-items-container">
        <Link to="/" className="header-link-style">
          <li className="nav-items">Home</li>
          <li>
            <AiFillHome className="header-home-icon" />
          </li>
        </Link>
        <Link to="/jobs" className="header-link-style">
          <li className="nav-items">Jobs</li>
          <li>
            <FaShoppingBag className="header-job-icon" />
          </li>
        </Link>
        <li className="btn-li-el">
          <FiLogOut className="header-logout-icon" onClick={onClickLogout} />
        </li>
      </ul>

      <button
        type="button"
        className="header-logout-btn"
        onClick={onClickLogout}
      >
        Logout
      </button>
    </div>
  )
}

export default withRouter(Header)
