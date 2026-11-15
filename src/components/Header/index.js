import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'

import {MdHome} from 'react-icons/md'
import {BsBriefcaseFill} from 'react-icons/bs'
import {FiLogOut} from 'react-icons/fi'

import './index.css'

const Header = props => {
  // console.log(props)
  const onClickLogout = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <div className="header-container">
      <Link to="/" className="nav-link">
        <img
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          alt="website logo"
          className="header-logo"
        />
      </Link>
      <ul className="nav-menu">
        <Link to="/" className="nav-link">
          <li className="nav-item">
            <MdHome className="header-icon" />
          </li>
        </Link>
        <Link to="/jobs" className="nav-link">
          <li className="nav-item">
            <BsBriefcaseFill className="header-icon" />
          </li>
        </Link>
        <li className="nav-item">
          <button
            type="button"
            className="header-logout-btn-mob"
            onClick={onClickLogout}
          >
            <FiLogOut className="header-icon" />
          </button>
        </li>
        <Link to="/" className="nav-link">
          <li className="nav-desktop-item">Home</li>
        </Link>
        <Link to="/jobs" className="nav-link">
          <li className="nav-desktop-item">Jobs</li>
        </Link>
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
