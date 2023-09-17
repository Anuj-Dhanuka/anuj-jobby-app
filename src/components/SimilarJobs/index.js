import './index.css'

import {BsFillStarFill} from 'react-icons/bs'
import {FaMapMarkerAlt} from 'react-icons/fa'
import {IoIosTime} from 'react-icons/io'

const SimilarJobs = props => {
  const {similarJobsData} = props
  const {
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    rating,
    title,
  } = similarJobsData
  return (
    <li className="similar-jobs-bg-container">
      <div className="similar-jobs-logo-container">
        <img
          src={companyLogoUrl}
          alt="similar job company logo"
          className="similar-jobs-logo"
        />
        <div>
          <h1 className="similar-jobs-title">{title}</h1>
          <div className="similar-jobs-rating-container">
            <BsFillStarFill className="similar-jobs-rating-icon" />
            <p className="similar-jobs-rating-text">{rating}</p>
          </div>
        </div>
      </div>
      <h1 className="similar-jobs-description-title">Description</h1>
      <p className="similar-jobs-description">{jobDescription}</p>
      <div className="similar-jobs-location-job-type-container">
        <div className="similar-jobs-location-container">
          <FaMapMarkerAlt className="similar-jobs-location-icon" />
          <p className="similar-jobs-location-text">{location}</p>
        </div>

        <div className="similar-jobs-location-container">
          <IoIosTime className="similar-jobs-location-icon" />
          <p className="similar-jobs-location-text">{employmentType}</p>
        </div>
      </div>
    </li>
  )
}

export default SimilarJobs
