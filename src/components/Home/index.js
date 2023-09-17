import {Component} from 'react'
import './index.css'
import {Link} from 'react-router-dom'

import Header from '../Header'

class Home extends Component {
  render() {
    return (
      <div className="home-bg-container">
        <Header />
        <div className="home-description-container">
          <h1 className="home-main-heading">
            Find The Job That Fits Your Life
          </h1>
          <p className="home-description">
            Millions of people are searching for jobs, salary information,
            company reviews. Find the job that fits your abilities and potential
          </p>
          <Link to="/jobs" className="home-link-item-style">
            <button
              type="button"
              className="find-jobs-button"
              onClick={this.onClickFindJobs}
            >
              Find Jobs
            </button>
          </Link>
        </div>
      </div>
    )
  }
}

export default Home
