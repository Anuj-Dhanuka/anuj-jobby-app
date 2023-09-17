import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

class Login extends Component {
  state = {username: '', password: '', errMsg: '', isInvalid: false}

  onChangeUserName = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onSuccessSubmission = jwtToken => {
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    const {history} = this.props
    history.replace('/')
  }

  onFailureSubmission = errMsg => {
    this.setState({isInvalid: true, errMsg})
  }

  onSubmitLoginForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    console.log(data)
    if (response.ok === true) {
      this.onSuccessSubmission(data.jwt_token)
    } else {
      this.onFailureSubmission(data.error_msg)
    }
  }

  render() {
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    const {username, password, isInvalid, errMsg} = this.state
    return (
      <div className="login-bg-container">
        <div className="login-card">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="form-element-logo"
          />
          <form className="form-container" onSubmit={this.onSubmitLoginForm}>
            <label htmlFor="userName" className="login-form-username">
              USERNAME
            </label>
            <input
              id="userName"
              type="text"
              className="form-input-element-style"
              placeholder="Username"
              onChange={this.onChangeUserName}
              value={username}
              autoComplete="username"
            />
            <label htmlFor="password" className="login-form-username">
              PASSWORD
            </label>
            <input
              id="password"
              type="password"
              className="form-input-element-style"
              value={password}
              onChange={this.onChangePassword}
              placeholder="Password"
              autoComplete="current-password"
            />
            <button type="submit" className="login-button">
              Login
            </button>
            {isInvalid && <p className="err-msg-style">*{errMsg}</p>}
          </form>
        </div>
      </div>
    )
  }
}

export default Login
