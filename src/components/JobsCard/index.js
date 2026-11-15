import {Link} from 'react-router-dom'

import {FaStar} from 'react-icons/fa'
import {IoLocationSharp} from 'react-icons/io5'
import {BsBriefcaseFill} from 'react-icons/bs'
import './index.css'

const JobsCard = props => {
  const {jobDetails} = props
  // console.log(jobDetails)
  const {
    companyLogoUrl,
    employmentType,
    id,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
  } = jobDetails
  return (
    <Link to={`/jobs/${id}`} className="nav-link">
      <li className="each-job">
        <div className="comp-logo-details-container">
          <img
            src={companyLogoUrl}
            alt="company logo"
            className="job-comp-logo"
          />
          <div className="comp-details-container">
            <h1 className="comp-job-name">{title}</h1>
            <div className="star-review-container">
              <FaStar className="star-icon" />
              <p className="rate-no">{rating}</p>
            </div>
          </div>
        </div>
        <div className="loc-job-lpa-container">
          <div className="loc-job-container">
            <div className="loc-container">
              <IoLocationSharp className="loc-icon" />
              <p className="loc-name">{location}</p>
            </div>
            <div className="job-type-container">
              <BsBriefcaseFill className="job-brief-icon" />
              <p className="job-type">{employmentType}</p>
            </div>
          </div>
          <p className="job-salary-range">{packagePerAnnum}</p>
        </div>
        <hr />
        <div className="job-description-container">
          <h1 className="job-description">Description</h1>
          <p className="job-description-content">{jobDescription}</p>
        </div>
      </li>
    </Link>
  )
}

export default JobsCard
