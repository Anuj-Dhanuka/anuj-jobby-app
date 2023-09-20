import './index.css'
import {AiOutlineSearch} from 'react-icons/ai'
import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import Header from '../Header'
import JobItem from '../JobItem'

const apiStatusConstraints = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  loading: 'LOADING',
  failure: 'FAILURE',
}

class Jobs extends Component {
  state = {
    userProfileData: {},
    profileDetailsStatus: apiStatusConstraints.initial,
    jobListsData: [],
    jobListApiStatus: apiStatusConstraints.initial,
    searchedValue: '',
    finalSearchedValue: '',
    searchedPackageValue: 0,
    employmentTypeList: [],
  }

  componentDidMount = () => {
    this.getUserProfileDetails()
    this.getJobList()
  }

  onChangeJobListSearch = event => {
    this.setState({searchedValue: event.target.value})
  }

  onClickingSearchBtn = () => {
    this.setState({jobListApiStatus: apiStatusConstraints.loading})
    const {searchedValue} = this.state
    const finalSearchedValue = searchedValue
    this.setState(
      {
        finalSearchedValue,
        jobListApiStatus: apiStatusConstraints.success,
      },
      this.getJobList,
    )
  }

  onChangingPackage = packageValue => {
    this.setState({searchedPackageValue: packageValue}, this.getJobList)
  }

  onChangeCheckBox = jobType => {
    console.log(jobType)
    const {employmentTypeList} = this.state
    if (employmentTypeList.includes(jobType)) {
      const newEmploymentTypeList = employmentTypeList.filter(
        eachItem => eachItem !== jobType,
      )
      this.setState(
        {employmentTypeList: newEmploymentTypeList},
        this.getJobList,
      )
    } else {
      employmentTypeList.push(jobType)
      this.setState({employmentTypeList}, this.getJobList)
    }
  }

  onClickProfileRetry = () => {
    this.getUserProfileDetails()
  }

  onClickJobFailureRetry = () => {
    this.getJobList()
  }

  renderRadioBox = () => {
    const {salaryRangesList} = this.props
    const onClickingRadioBtn = event => {
      const clickedValue = event.target.value
      const intValue = parseInt(clickedValue)
      this.onChangingPackage(intValue)
    }
    return (
      <>
        {salaryRangesList.map(eachItem => (
          <li className="toe-ele-container" key={eachItem.salaryRangeId}>
            <input
              type="radio"
              className="check-box-style"
              name="salaryAmount"
              id={eachItem.salaryRangeId}
              value={eachItem.salaryRangeId}
              onClick={onClickingRadioBtn}
            />
            <label htmlFor={eachItem.salaryRangeId} className="list-item-text">
              {eachItem.label}
            </label>
          </li>
        ))}
      </>
    )
  }

  renderTypeOfEmploymentView = () => {
    const {employmentTypesList} = this.props
    const onClickingCheckBox = event => {
      this.onChangeCheckBox(event.target.value)
    }
    return (
      <>
        {employmentTypesList.map(eachItem => (
          <li className="toe-ele-container" key={eachItem.employmentTypeId}>
            <input
              type="checkbox"
              id={eachItem.employmentTypeId}
              className="check-box-style"
              value={eachItem.employmentTypeId}
              onClick={onClickingCheckBox}
            />
            <label
              htmlFor={eachItem.employmentTypeId}
              className="list-item-text"
            >
              {eachItem.label}
            </label>
          </li>
        ))}
      </>
    )
  }

  getJobList = async () => {
    this.setState({jobListApiStatus: apiStatusConstraints.loading})
    const {
      finalSearchedValue,
      searchedPackageValue,
      employmentTypeList,
    } = this.state
    const url = `https://apis.ccbp.in/jobs?employment_type=${employmentTypeList}&minimum_package=${searchedPackageValue}&search=${finalSearchedValue}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      const updatedData = data.jobs.map(eachItem => ({
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
        jobListApiStatus: apiStatusConstraints.success,
      })
    } else {
      this.setState({jobListApiStatus: apiStatusConstraints.failure})
    }
  }

  getUserProfileDetails = async () => {
    this.setState({profileDetailsStatus: apiStatusConstraints.loading})
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
      const fetchedProfileDetails = data.profile_details
      const updatedProfileDetails = {
        name: fetchedProfileDetails.name,
        profileImageUrl: fetchedProfileDetails.profile_image_url,
        shortBio: fetchedProfileDetails.short_bio,
      }
      this.setState({
        userProfileData: updatedProfileDetails,
        profileDetailsStatus: apiStatusConstraints.success,
      })
    } else {
      this.setState({profileDetailsStatus: apiStatusConstraints.failure})
    }
  }

  renderProfileDetailsOfUserSuccessView = () => {
    const {userProfileData} = this.state
    const {name, profileImageUrl, shortBio} = userProfileData

    return (
      <div className="profile-bg-container">
        <img src={profileImageUrl} alt="profile" />
        <h1 className="profile-user-name">{name}</h1>
        <p className="username-position">{shortBio}</p>
      </div>
    )
  }

  renderProfileDetailsOfUserFailureView = () => (
    <>
      <button
        type="button"
        className="jobs-user-retry-btn"
        onClick={this.onClickProfileRetry}
      >
        Retry
      </button>
    </>
  )

  renderProfileDetailsOfUserLoadingView = () => (
    <div className="job-list-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderProfileDetailsSection = () => {
    const {profileDetailsStatus} = this.state
    switch (profileDetailsStatus) {
      case apiStatusConstraints.loading:
        return this.renderProfileDetailsOfUserLoadingView()
      case apiStatusConstraints.failure:
        return this.renderProfileDetailsOfUserFailureView()
      case apiStatusConstraints.success:
        return this.renderProfileDetailsOfUserSuccessView()
      default:
        return null
    }
  }

  renderJobListSuccessView = () => {
    const {jobListsData} = this.state

    const isLengthEmpty = jobListsData.length === 0
    return (
      <>
        {!isLengthEmpty && (
          <ul className="jobs-item-ul-container">
            {jobListsData.map(eachItem => (
              <JobItem jobListsData={eachItem} key={eachItem.id} />
            ))}
          </ul>
        )}
        {isLengthEmpty && (
          <div className="no-jobs-bg-container">
            <img
              src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
              alt="no jobs"
              className="no-job-found-image"
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
          className="jobs-user-retry-btn"
          onClick={this.onClickJobFailureRetry}
        >
          Retry
        </button>
      </div>
    </div>
  )

  renderJobListView = () => {
    const {jobListApiStatus} = this.state
    switch (jobListApiStatus) {
      case apiStatusConstraints.success:
        return this.renderJobListSuccessView()
      case apiStatusConstraints.failure:
        return this.renderJobListFailureView()
      case apiStatusConstraints.loading:
        return this.renderProfileDetailsOfUserLoadingView()

      default:
        return null
    }
  }

  render() {
    const {searchedValue} = this.state

    return (
      <div className="job-bg-container">
        <Header />
        <div className="job-inner-container">
          <div className="input-search-container-sm">
            <input
              type="search"
              className="input-search-bar-el"
              onChange={this.onChangeJobListSearch}
              value={searchedValue}
            />

            <button
              type="button"
              className="jobs-search-button"
              onClick={this.onClickingSearchBtn}
              data-testid="searchButton"
            >
              <div className="jobs-search-icon-container">
                <AiOutlineSearch />
              </div>
            </button>
          </div>
          <div className="profile-details-container">
            <div className="jobs-user-profile-outer-container">
              {this.renderProfileDetailsSection()}
            </div>

            <hr className="profile-horizontal-line" />
            <h1 className="type-of-employment">Type of Employment</h1>
            <ul className="toe-ul-container">
              {this.renderTypeOfEmploymentView()}
            </ul>
            <hr className="profile-horizontal-line" />
            <h1 className="type-of-employment">Salary Range</h1>
            <ul className="toe-ul-container">{this.renderRadioBox()}</ul>
          </div>
          <div className="jobs-left-main-container">
            <div className="input-search-container">
              <input
                type="search"
                className="input-search-bar-el"
                onChange={this.onChangeJobListSearch}
                value={searchedValue}
              />

              <button
                type="button"
                className="jobs-search-button"
                onClick={this.onClickingSearchBtn}
                data-testid="searchButton"
              >
                <div className="jobs-search-icon-container">
                  <AiOutlineSearch />
                </div>
              </button>
            </div>
            <div className="jobs-item-container">
              {this.renderJobListView()}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Jobs
