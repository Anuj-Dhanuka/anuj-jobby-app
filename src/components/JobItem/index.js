import './index.css'
import {BsFillStarFill} from 'react-icons/bs'
import {FaMapMarkerAlt} from 'react-icons/fa'
import {IoIosTime} from 'react-icons/io'

import {Link} from 'react-router-dom'

const JobItem = props => {
  const {jobListsData} = props
  const {
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
    id,
  } = jobListsData

  return (
    <Link to={`/jobs/${id}`} className="job-item-link-style">
      <li className="job-item-bg-container">
        <div className="job-item-logo-title-container">
          <img
            src={companyLogoUrl}
            alt="job details company logo"
            className="job-item-image"
          />
          <div>
            <h1 className="job-item-title">{title}</h1>
            <div className="job-item-rating-container">
              <BsFillStarFill className="job-item-star-icon" />
              <p className="job-item-rating-text">{rating}</p>
            </div>
          </div>
        </div>
        <ul className="job-item-sec-container">
          <div className="location-full-part-time-container">
            <li className="job-item-location-container">
              <FaMapMarkerAlt className="job-item-location" />
              <p className="location-text">{location}</p>
            </li>
            <li className="job-item-location-container">
              <IoIosTime className="job-item-location" />
              <p className="location-text">{employmentType}</p>
            </li>
          </div>
          <li className="job-item-package">{packagePerAnnum}</li>
        </ul>
        <hr className="job-item-hr-line" />
        <h1 className="job-title-description-title">Description</h1>
        <p className="job-title-description">{jobDescription}</p>
      </li>
    </Link>
  )
}

export default JobItem
