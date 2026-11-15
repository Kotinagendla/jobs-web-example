import {Component} from 'react'
import Loader from 'react-loader-spinner'

import Cookies from 'js-cookie'

import {FaStar} from 'react-icons/fa'
import {IoLocationSharp} from 'react-icons/io5'
import {BsBriefcaseFill} from 'react-icons/bs'
import {FiExternalLink} from 'react-icons/fi'

import Header from '../Header'

import './index.css'

const apiStatusConstants = {
  failure: 'FAILURE',
  success: 'SUCCESS',
  inProgress: 'IN_PROGRESS',
  initial: 'INITIAL',
}

class JobItemDetails extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    jobDetailsData: {},
    similarJobsData: [],
  }

  componentDidMount() {
    this.getJobDetails()
  }

  getJobDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    // console.log(id)
    const apiUrl = `https://apis.ccbp.in/jobs/${id}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    // console.log(response)
    if (response.ok === true) {
      const data = await response.json()
      // console.log(data)
      const updatedData = {
        jobDetails: {
          companyLogoUrl: data.job_details.company_logo_url,
          companyWebsiteUrl: data.job_details.company_website_url,
          employmentType: data.job_details.employment_type,
          id: data.job_details.id,
          jobDescription: data.job_details.job_description,
          title: data.job_details.title,
          location: data.job_details.location,
          rating: data.job_details.rating,
          packagePerAnnum: data.job_details.package_per_annum,
          lifeAtCompany: {
            description: data.job_details.life_at_company.description,
            imageUrl: data.job_details.life_at_company.image_url,
          },
          skills: data.job_details.skills.map(eachSkill => ({
            name: eachSkill.name,
            imageUrl: eachSkill.image_url,
          })),
        },
        similarJobs: data.similar_jobs.map(eachJob => ({
          id: eachJob.id,
          title: eachJob.title,
          companyLogoUrl: eachJob.company_logo_url,
          location: eachJob.location,
          rating: eachJob.rating,
          jobDescription: eachJob.job_description,
          employmentType: eachJob.employment_type,
        })),
      }
      this.setState({
        jobDetailsData: updatedData.jobDetails,
        similarJobsData: updatedData.similarJobs,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }

    // console.log(updatedData)
  }

  onClickSpecificJobBtn = () => {
    this.getJobDetails()
  }

  renderLoaderView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderErrorPageView = () => (
    <>
      <Header />
      <div className="failure-page-containerr">
        <img
          src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
          alt="failure view"
          className="no-page-img"
        />
        <h1 className="no-page-heading">Oops! Something Went Wrong</h1>
        <p className="no-page-content">
          We cannot seem to find the page you are looking for
        </p>
        <button
          type="button"
          className="no-page-retry-btn"
          onClick={this.onClickSpecificJobBtn}
        >
          Retry
        </button>
      </div>
    </>
  )

  renderJobSectionView = () => {
    const {jobDetailsData, similarJobsData} = this.state
    // console.log(jobDetailsData)
    // console.log(similarJobsData)
    return (
      <>
        <Header />
        <div className="job-main-container">
          <div className="specific-job-card">
            <div className="specific-comp-logo-details-container">
              <img
                src={jobDetailsData.companyLogoUrl}
                alt="job details company logo"
                className="specific-job-comp-logo"
              />
              <div className="specific-comp-details-container">
                <h1 className="specific-comp-job-name">
                  {jobDetailsData.title}
                </h1>
                <div className="specific-star-review-container">
                  <FaStar className="specific-star-icon" />
                  <p className="specific-rate-no">{jobDetailsData.rating}</p>
                </div>
              </div>
            </div>
            <div className="specific-loc-job-lpa-container">
              <div className="specific-loc-job-container">
                <div className="specific-loc-container">
                  <IoLocationSharp className="specific-loc-icon" />
                  <p className="specific-loc-name">{jobDetailsData.location}</p>
                </div>
                <div className="specific-job-type-container">
                  <BsBriefcaseFill className="specific-job-brief-icon" />
                  <p className="specific-job-type">
                    {jobDetailsData.employmentType}
                  </p>
                </div>
              </div>
              <p className="specific-job-salary-range">
                {jobDetailsData.packagePerAnnum}
              </p>
            </div>
            <hr />
            <div className="specific-job-description-container">
              <div className="specific-description-visit-container">
                <h1 className="specific-job-description">Description</h1>
                <div className="specific-link-text-container">
                  <a
                    href={jobDetailsData.companyWebsiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="specific-page-link"
                  >
                    Visit
                  </a>
                  <FiExternalLink className="specific-link-icon" />
                </div>
              </div>
              <p className="specific-job-description-content">
                {jobDetailsData.jobDescription}
              </p>
            </div>
            <div className="specific-job-skills-container">
              <h1 className="specific-job-skills-heading">Skills</h1>
              <ul className="specific-job-skills-list-container">
                {jobDetailsData.skills.map(eachSkill => (
                  <li className="specific-job-skill" key={eachSkill.name}>
                    <img
                      src={eachSkill.imageUrl}
                      alt={eachSkill.name}
                      className="specific-job-skill-img"
                    />
                    <h1 className="specific-job-skill-name">
                      {eachSkill.name}
                    </h1>
                  </li>
                ))}
              </ul>
            </div>
            <div className="specific-job-life-at-container">
              <h1 className="specific-job-life-at-heading">Life at Company</h1>
              <div className="specific-job-life-at-content-pic-container">
                <p className="specific-job-life-at-content">
                  {jobDetailsData.lifeAtCompany.description}
                </p>
                <img
                  src={jobDetailsData.lifeAtCompany.imageUrl}
                  alt="life at company"
                  className="specific-job-life-at-img"
                />
              </div>
            </div>
          </div>
          <div className="specific-job-similar-jobs-container">
            <h1 className="specific-job-similar-jobs-heading">Similar Jobs</h1>
            <ul className="specific-job-similar-jobs-list-container">
              {similarJobsData.map(eachSimilarJob => (
                <li
                  className="specific-job-similar-job-card"
                  key={eachSimilarJob.id}
                >
                  <div className="specific-comp-similar-logo-details-container">
                    <img
                      src={eachSimilarJob.companyLogoUrl}
                      alt="similar job company logo"
                      className="specific-job-similar-comp-logo"
                    />
                    <div className="specific-comp-similar-details-container">
                      <h1 className="specific-comp-similar-job-name">
                        {eachSimilarJob.title}
                      </h1>
                      <div className="specific-similar-star-review-container">
                        <FaStar className="specific-similar-star-icon" />
                        <p className="specific-similar-rate-no">
                          {eachSimilarJob.rating}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="specific-job-similar-job-description-container">
                    <h1 className="specific-job-similar-job-description">
                      Description
                    </h1>
                    <p className="specific-job-similar-job-description-content">
                      {eachSimilarJob.jobDescription}
                    </p>
                    <div className="specific-loc-job-similar-lpa-container">
                      <div className="specific-loc-similar-container">
                        <IoLocationSharp className="specific-loc-similar-icon" />
                        <p className="specific-loc-similar-name">
                          {eachSimilarJob.location}
                        </p>
                      </div>
                      <div className="specific-job-type-similar-container">
                        <BsBriefcaseFill className="specific-job-similar-brief-icon" />
                        <p className="specific-similar-job-type">
                          {eachSimilarJob.employmentType}
                        </p>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </>
    )
  }

  render() {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderJobSectionView()
      case apiStatusConstants.failure:
        return this.renderErrorPageView()
      case apiStatusConstants.inProgress:
        return this.renderLoaderView()
      default:
        return null
    }
  }
}

export default JobItemDetails
