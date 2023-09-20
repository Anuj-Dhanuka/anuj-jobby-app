import './index.css'
import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import {BsFillStarFill} from 'react-icons/bs'
import {FaMapMarkerAlt} from 'react-icons/fa'
import {IoIosTime} from 'react-icons/io'
import {GoLinkExternal} from 'react-icons/go'

import Header from '../Header'
import SimilarJobs from '../SimilarJobs'

const apiStatusConstraints = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  loading: 'LOADING',
  failure: 'FAILURE',
}

class JobItemDetails extends Component {
  state = {
    jobItemDetailsData: [],
    lifeAtCompanyData: [],
    skillsData: [],
    similarJobsData: [],
    apiStatus: apiStatusConstraints.initial,
  }

  componentDidMount() {
    this.getJobItemDetailsApi()
  }

  onClickJobItemDetailsRetry = () => {
    this.getJobItemDetailsApi()
  }

  getJobItemDetailsApi = async () => {
    this.setState({apiStatus: apiStatusConstraints.loading})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const url = `https://apis.ccbp.in/jobs/${id}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      const jobDetails = data.job_details

      const updatedJobDetails = {
        companyLogoUrl: jobDetails.company_logo_url,
        employmentType: jobDetails.employment_type,
        jobDescription: jobDetails.job_description,
        companyWebsiteUrl: jobDetails.company_website_url,
        lifeAtCompany: jobDetails.life_at_company,
        location: jobDetails.location,
        packagePerAnnum: jobDetails.package_per_annum,
        rating: jobDetails.rating,
        skills: jobDetails.skills,
        title: jobDetails.title,
      }
      const lifeAtCompanyData = updatedJobDetails.lifeAtCompany
      const updatedLifeAtCompanyData = {
        description: lifeAtCompanyData.description,
        imageUrl: lifeAtCompanyData.image_url,
      }
      const skillsData = updatedJobDetails.skills

      const updatedSkillsData = skillsData.map(eachItem => ({
        skillName: eachItem.name,
        skillImageUrl: eachItem.image_url,
      }))

      const similarJobs = data.similar_jobs
      const updatedSimilarJobs = similarJobs.map(eachItem => ({
        id: eachItem.id,
        companyLogoUrl: eachItem.company_logo_url,
        employmentType: eachItem.employment_type,
        jobDescription: eachItem.job_description,
        location: eachItem.location,
        rating: eachItem.rating,
        title: eachItem.title,
      }))

      this.setState({
        jobItemDetailsData: updatedJobDetails,
        lifeAtCompanyData: updatedLifeAtCompanyData,
        skillsData: updatedSkillsData,
        similarJobsData: updatedSimilarJobs,
        apiStatus: apiStatusConstraints.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstraints.failure})
    }
  }

  renderJobItemDetailsSuccessView = () => {
    const {
      jobItemDetailsData,
      lifeAtCompanyData,
      skillsData,
      similarJobsData,
    } = this.state
    const {
      companyLogoUrl,
      employmentType,
      jobDescription,
      location,
      packagePerAnnum,
      rating,
      title,
      companyWebsiteUrl,
    } = jobItemDetailsData
    const {description, imageUrl} = lifeAtCompanyData

    return (
      <div className="job-item-details-second-container">
        <div className="job-item-details-main-container">
          <div className="job-item-details-logo-container">
            <img
              src={companyLogoUrl}
              alt="job details company logo"
              className="job-item-details-logo"
            />
            <div>
              <h1 className="job-item-details-title">{title}</h1>
              <div className="rating-container">
                <BsFillStarFill className="job-item-details-rating-icon" />
                <p className="job-item-details-rating-text">{rating}</p>
              </div>
            </div>
          </div>
          <ul className="job-item-details-location-package-container">
            <div className="job-item-details-location-intern-container">
              <li className="job-item-details-location-container">
                <FaMapMarkerAlt className="job-item-details-location-icon" />
                <p className="job-item-details-location-text">{location}</p>
              </li>
              <li className="job-item-details-location-container">
                <IoIosTime className="job-item-details-location-icon" />
                <p className="job-item-details-location-text">
                  {employmentType}
                </p>
              </li>
            </div>
            <p className="job-item-details-package">{packagePerAnnum}</p>
          </ul>
          <hr className="job-item-details-hr-line" />
          <div className="job-item-details-description-visit-btn">
            <h1 className="job-item-details-description-title">Description</h1>
            <a href={companyWebsiteUrl} className="href-style">
              <button className="job-item-details-visit-btn" type="button">
                <p className="visit-title">Visit</p>
                <GoLinkExternal className="go-link-icon" />
              </button>
            </a>
          </div>

          <p className="job-item-details-description">{jobDescription}</p>
          <h1 className="job-item-details-skill-title">Skills</h1>
          <ul className="job-item-details-skills-ul-container">
            {skillsData.map(eachItem => (
              <li
                className="job-item-details-skills-li-container"
                key={eachItem.skillName}
              >
                <img
                  src={eachItem.skillImageUrl}
                  alt={eachItem.skillName}
                  className="skills-image"
                />
                <p className="job-item-details-skill-name">
                  {eachItem.skillName}
                </p>
              </li>
            ))}
          </ul>
          <h1 className="life-at-company-title">Life at Company</h1>
          <div className="life-at-company-container">
            <p className="life-at-company-description">{description}</p>
            <img
              src={imageUrl}
              alt="life at company"
              className="life-at-company-img"
            />
          </div>
        </div>
        <div className="job-item-details-bottom-container">
          <h1 className="job-item-details-similar-jobs-title">Similar Jobs</h1>
          <ul className="similar-jobs-ul-container">
            {similarJobsData.map(eachItem => (
              <SimilarJobs similarJobsData={eachItem} key={eachItem.id} />
            ))}
          </ul>
        </div>
      </div>
    )
  }

  renderJobItemDetailsLoadingView = () => (
    <div className="job-item-details-failure-container">
      <div className="loader-container" data-testid="loader">
        <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
      </div>
    </div>
  )

  renderJobItemsFailureView = () => (
    <div className="job-item-details-failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="job-item-detail-failure-img"
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
          onClick={this.onClickJobItemDetailsRetry}
        >
          Retry
        </button>
      </div>
    </div>
  )

  renderJobItemDetails = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstraints.loading:
        return this.renderJobItemDetailsLoadingView()
      case apiStatusConstraints.success:
        return this.renderJobItemDetailsSuccessView()
      case apiStatusConstraints.failure:
        return this.renderJobItemsFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="job-item-details-bg-container">
        <Header />
        {this.renderJobItemDetails()}
      </div>
    )
  }
}

export default JobItemDetails
