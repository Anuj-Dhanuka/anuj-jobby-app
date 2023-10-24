import {AiOutlineSearch} from 'react-icons/ai'

import {Component} from 'react'

import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import Header from '../Header'
import JobItem from '../JobItem'

import './index.css'

const apiConstraints = {
  initial: 'INITIAL',
  loading: 'LOADING',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Jobs extends Component {
  state = {
    userProfileData: [],
    userProfileApiStatus: apiConstraints.initial,
    jobListApiStatus: apiConstraints.initial,
    jobListsData: [],
    searchedValue: '',
    finalSearchValue: '',
    packageAmount: 0,
    employmentTypeList: [],
  }

  componentDidMount() {
    this.getUserProfileApi()
    this.getJobItemApi()
  }

  onChangeSearchText = event => {
    this.setState({searchedValue: event.target.value})
  }

  onSearchItem = () => {
    const {searchedValue} = this.state
    this.setState({finalSearchValue: searchedValue}, this.getJobItemApi)
  }

  onChangeSalary = packageValue => {
    this.setState({packageAmount: packageValue}, this.getJobItemApi)
  }

  onChangeEmploymentType = jobType => {
    const {employmentTypeList} = this.state

    if (employmentTypeList.includes(jobType)) {
      const newEmploymentTypeList = employmentTypeList.filter(
        eachItem => eachItem !== jobType,
      )
      this.setState(
        {employmentTypeList: newEmploymentTypeList},
        this.getJobItemApi,
      )
    } else {
      employmentTypeList.push(jobType)
      this.setState({employmentTypeList}, this.getJobItemApi)
    }
  }

  onClickJobListFailureBtn = () => {
    this.getJobItemApi()
  }

  getUserProfileApi = async () => {
    this.setState({userProfileApiStatus: apiConstraints.loading})
    const url = 'https://apis.ccbp.in/profile'
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()

      const updatedData = {
        profileImageUrl: data.profile_details.profile_image_url,
        name: data.profile_details.name,
        shortBio: data.profile_details.short_bio,
      }
      this.setState({
        userProfileData: updatedData,
        userProfileApiStatus: apiConstraints.success,
      })
    } else {
      this.setState({userProfileApiStatus: apiConstraints.failure})
    }
  }

  getJobItemApi = async () => {
    this.setState({jobListApiStatus: apiConstraints.loading})
    const {finalSearchValue, packageAmount, employmentTypeList} = this.state
    const url = `https://apis.ccbp.in/jobs?search=${finalSearchValue}&minimum_package=${packageAmount}&employment_type=${employmentTypeList}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      const {jobs} = data
      const updatedData = jobs.map(eachItem => ({
        id: eachItem.id,
        companyLogoUrl: eachItem.company_logo_url,
        employmentType: eachItem.employment_type,
        jobDescription: eachItem.job_description,
        location: eachItem.location,
        packagePerAnnum: eachItem.package_per_annum,
        rating: eachItem.rating,
        title: eachItem.title,
      }))
      this.setState({
        jobListsData: updatedData,
        jobListApiStatus: apiConstraints.success,
      })
    } else {
      this.setState({jobListApiStatus: apiConstraints.failure})
    }
  }

  renderProfileLoadingView = () => (
    <div
      className="loader-container job-profile-loading-view"
      data-testid="loader"
    >
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderUserProfileSuccessView = () => {
    const {userProfileData} = this.state
    const {profileImageUrl, name, shortBio} = userProfileData
    return (
      <div className="jobs-lc-profile-card">
        <img src={profileImageUrl} alt="profile" />
        <h1 className="profile-user-name">{name}</h1>
        <p className="username-position">{shortBio}</p>
      </div>
    )
  }

  renderUserProfileFailureView = () => (
    <div className="job-profile-loading-view">
      <button
        type="button"
        className="jobs-retry-btn"
        onClick={this.onClickProfileRetryBtn}
      >
        Retry
      </button>
    </div>
  )

  onClickProfileRetryBtn = () => {
    this.getUserProfileApi()
  }

  renderUserProfileFinalView = () => {
    const {userProfileApiStatus} = this.state

    switch (userProfileApiStatus) {
      case apiConstraints.loading:
        return this.renderProfileLoadingView()
      case apiConstraints.success:
        return this.renderUserProfileSuccessView()
      case apiConstraints.failure:
        return this.renderUserProfileFailureView()
      default:
        return null
    }
  }

  renderTypeOfEmployment = () => {
    const {employmentTypesList} = this.props
    const onClickCheckBox = event => {
      this.onChangeEmploymentType(event.target.value)
    }
    return employmentTypesList.map(eachItem => (
      <li className="lc-toe-check-el-container" key={eachItem.employmentTypeId}>
        <input
          type="checkbox"
          id={eachItem.employmentTypeId}
          value={eachItem.employmentTypeId}
          className="lc-toe-checkbox"
          onClick={onClickCheckBox}
        />
        <label htmlFor={eachItem.employmentTypeId} className="lc-toe-label">
          {eachItem.label}
        </label>
      </li>
    ))
  }

  renderSalaryRange = () => {
    const {salaryRangesList} = this.props
    const onClickRadioBtn = event => {
      const clickedValue = event.target.value
      const intValue = parseInt(clickedValue)
      this.onChangeSalary(intValue)
    }
    return salaryRangesList.map(eachItem => (
      <li className="lc-toe-check-el-container" key={eachItem.salaryRangeId}>
        <input
          type="radio"
          id={eachItem.salaryRangeId}
          name="salaryAmount"
          value={eachItem.salaryRangeId}
          className="lc-toe-checkbox"
          onClick={onClickRadioBtn}
        />
        <label htmlFor={eachItem.salaryRangeId} className="lc-toe-label">
          {eachItem.label}
        </label>
      </li>
    ))
  }

  renderJobListLoadingView = () => (
    <div
      className="loader-container jobs-list-loading-view-container"
      data-testid="loader"
    >
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderJobListSuccessView = () => {
    const {jobListsData} = this.state
    const isEmpty = jobListsData.length === 0
    return (
      <>
        {!isEmpty && (
          <ul className="jobs-item-rc-ul-container">
            {jobListsData.map(eachItem => (
              <JobItem jobListsData={eachItem} key={eachItem.id} />
            ))}
          </ul>
        )}
        {isEmpty && (
          <div className="job-list-failure-view-container">
            <img
              src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
              alt="no jobs"
              className="job-list-failure-image"
            />
            <h1 className="job-list-failure-view-heading">No Jobs Found</h1>
            <p className="job-list-failure-view-description">
              we could not find any jobs. Try other filters.
            </p>
          </div>
        )}
      </>
    )
  }

  renderJobListFailureView = () => (
    <div className="job-list-failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="job-list-failure-image"
      />
      <h1 className="job-list-failure-view-heading">
        Oops! Something Went Wrong
      </h1>
      <p className="job-list-failure-view-description">
        We cannot seem to find the page you are looking for
      </p>
      <div className="job-list-failure-view-btn-container">
        <button
          type="button"
          className="jobs-retry-btn"
          onClick={this.onClickJobListFailureBtn}
        >
          Retry
        </button>
      </div>
    </div>
  )

  renderFinalJobListFinalView = () => {
    const {jobListApiStatus} = this.state

    switch (jobListApiStatus) {
      case apiConstraints.loading:
        return this.renderJobListLoadingView()
      case apiConstraints.success:
        return this.renderJobListSuccessView()
      case apiConstraints.failure:
        return this.renderJobListFailureView()
      default:
        return null
    }
  }

  render() {
    const {searchedValue} = this.state
    return (
      <div className="jobs-bg-container">
        <Header />
        <div className="jobs-inner-bg-container">
          <div className="jobs-left-container">
            <div className="search-box-sm-container">
              <input
                type="search"
                className="job-search-input-el"
                placeholder="Search"
                onChange={this.onChangeSearchText}
                value={searchedValue}
              />
              <button
                type="button"
                className="job-search-icon-btn"
                data-testid="searchButton"
                onClick={this.onSearchItem}
              >
                <AiOutlineSearch className="jobs-search-icon" />
              </button>
            </div>
            {this.renderUserProfileFinalView()}

            <hr className="lc-hr-line" />
            <div>
              <h1 className="lc-toe-heading">Type of Employment</h1>
              <ul>{this.renderTypeOfEmployment()}</ul>
            </div>
            <hr className="lc-hr-line" />
            <div>
              <h1 className="lc-toe-heading">Salary Range</h1>
              <ul>{this.renderSalaryRange()}</ul>
            </div>
          </div>
          <div className="jobs-right-container">
            <div className="search-box-container">
              <input
                type="search"
                className="job-search-input-el"
                placeholder="Search"
                onChange={this.onChangeSearchText}
                value={searchedValue}
              />
              <button
                type="button"
                className="job-search-icon-btn"
                data-testid="searchButton"
                onClick={this.onSearchItem}
              >
                <AiOutlineSearch className="jobs-search-icon" />
              </button>
            </div>

            {this.renderFinalJobListFinalView()}
          </div>
        </div>
      </div>
    )
  }
}

export default Jobs
