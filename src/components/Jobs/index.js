import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import {IoIosSearch} from 'react-icons/io'

import JobsCard from '../JobsCard'

import Header from '../Header'

import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiProfileConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const apiJobsConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Jobs extends Component {
  state = {
    apiProfileStatus: apiProfileConstants.initial,
    apiJobsStatus: apiJobsConstants.initial,
    profileDetails: {},
    jobsData: [],
    selectedTypes: [],
    salaryType: '',
    searchInput: '',
  }

  componentDidMount() {
    this.getProfile()
    this.getJobs()
  }

  getProfile = async () => {
    this.setState({apiProfileStatus: apiProfileConstants.inProgress})
    const apiUrl = 'https://apis.ccbp.in/profile'
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
        name: data.profile_details.name,
        profileImageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }
      // console.log(updatedData)
      this.setState({
        profileDetails: updatedData,
        apiProfileStatus: apiProfileConstants.success,
      })
    } else {
      this.setState({apiProfileStatus: apiProfileConstants.failure})
    }
  }

  getJobs = async () => {
    this.setState({apiJobsStatus: apiJobsConstants.inProgress})
    const {selectedTypes, salaryType, searchInput} = this.state
    const employmentQuery = selectedTypes.join(',')
    console.log(employmentQuery)
    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${employmentQuery}&minimum_package=${salaryType}&search=${searchInput}`
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
        jobs: data.jobs.map(eachItem => ({
          companyLogoUrl: eachItem.company_logo_url,
          employmentType: eachItem.employment_type,
          id: eachItem.id,
          jobDescription: eachItem.job_description,
          location: eachItem.location,
          packagePerAnnum: eachItem.package_per_annum,
          rating: eachItem.rating,
          title: eachItem.title,
        })),
      }
      // console.log(updatedData)
      this.setState({
        jobsData: updatedData.jobs,
        apiJobsStatus: apiJobsConstants.success,
      })
    } else {
      this.setState({apiJobsStatus: apiJobsConstants.failure})
    }
  }

  onChangeSearchInput = event => {
    this.setState({
      searchInput: event.target.value,
    })
  }

  onClickSearchIcon = () => {
    const {jobsData, searchInput} = this.state
    const filteredJobs = jobsData.filter(eachJob =>
      eachJob.title.toLowerCase().includes(searchInput.toLowerCase()),
    )
    this.setState({jobsData: filteredJobs}, this.getJobs)
  }

  onChangeCheckbox = event => {
    const {value, checked} = event.target
    console.log(value)
    this.setState(
      prevState => ({
        selectedTypes: checked
          ? [...prevState.selectedTypes, value]
          : prevState.selectedTypes.filter(each => each !== value),
      }),
      this.getJobs,
    )
  }

  onChangeRadio = event => {
    // console.log(event.target.value)
    this.setState(
      {
        salaryType: event.target.value,
      },
      this.getJobs,
    )
  }

  onClickProfileRetryBtn = () => {
    this.getProfile()
  }

  onClickRetryJobsBtn = () => {
    this.getJobs()
  }

  renderProfileRetryView = () => (
    <div className="profile-retry-container">
      <button
        type="button"
        className="profile-retry-btn"
        onClick={this.onClickProfileRetryBtn}
      >
        Retry
      </button>
    </div>
  )

  renderJobsFailureView = () => (
    <div className="failure-page-container">
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
        onClick={this.onClickRetryJobsBtn}
      >
        Retry
      </button>
    </div>
  )

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderProfileView = () => {
    const {profileDetails} = this.state
    const {name, profileImageUrl, shortBio} = profileDetails
    return (
      <div className="profile-container">
        <img src={profileImageUrl} alt="profile" className="jobs-profile-img" />
        <h1 className="jobs-profile-name">{name}</h1>
        <p className="jobs-profile-description">{shortBio}</p>
      </div>
    )
  }

  renderJobsView = () => {
    const {jobsData} = this.state
    const jobsCount = jobsData.length
    return (
      <>
        {jobsCount > 0 ? (
          <ul className="jobs-list-container">
            {jobsData.map(eachJob => (
              <JobsCard key={eachJob.id} jobDetails={eachJob} />
            ))}
          </ul>
        ) : (
          <div className="failure-container">
            <img
              src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
              alt="no jobs"
              className="no-jobs-img"
            />
            <h1 className="no-jobs-heading">No Jobs Found</h1>
            <p className="no-jobs-content">
              We could not find any jobs. Try other filters
            </p>
          </div>
        )}
      </>
    )
  }

  renderProfileSectionView = () => {
    const {apiProfileStatus} = this.state
    switch (apiProfileStatus) {
      case apiProfileConstants.success:
        return this.renderProfileView()
      case apiProfileConstants.inProgress:
        return this.renderLoadingView()
      case apiProfileConstants.failure:
        return this.renderProfileRetryView()
      default:
        return null
    }
  }

  renderJobsSectionView = () => {
    const {apiJobsStatus} = this.state
    switch (apiJobsStatus) {
      case apiJobsConstants.success:
        return this.renderJobsView()
      case apiJobsConstants.inProgress:
        return this.renderLoadingView()
      case apiJobsConstants.failure:
        return this.renderJobsFailureView()
      default:
        return null
    }
  }

  render() {
    const {salaryType, searchInput} = this.state
    // console.log(salaryType)
    return (
      <>
        <Header />
        <div className="jobs-container">
          <div className="large-device-container-one">
            <div className="search-container-mob">
              <input
                type="search"
                placeholder="Search"
                value={searchInput}
                className="jobs-search-element-mob"
                onChange={this.onChangeSearchInput}
              />
              <button
                type="button"
                className="search-btn-mob"
                onClick={this.onClickSearchIcon}
                data-testid="searchButton"
              >
                <IoIosSearch className="jobs-search-icon-mob" />
              </button>
            </div>
            {this.renderProfileSectionView()}
            <hr />
            <div className="select-employment-container">
              <h1 className="jobs-employment-type-heading">
                Type of Employment
              </h1>
              <ul className="employment-types-container">
                {employmentTypesList.map(eachType => (
                  <li
                    className="each-employment"
                    key={eachType.employmentTypeId}
                  >
                    <input
                      type="checkbox"
                      className="checkbox"
                      id={eachType.employmentTypeId}
                      value={eachType.employmentTypeId}
                      onChange={this.onChangeCheckbox}
                    />
                    <label
                      className="label"
                      htmlFor={eachType.employmentTypeId}
                    >
                      {eachType.label}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
            <hr />
            <div className="salary-container">
              <h1 className="jobs-salary-heading">Salary Range</h1>
              <ul className="salary-filter-container">
                {salaryRangesList.map(eachItem => (
                  <li className="each-salary" key={eachItem.salaryRangeId}>
                    <input
                      type="radio"
                      checked={eachItem.salaryRangeId === salaryType}
                      className="radio"
                      id={eachItem.salaryRangeId}
                      value={eachItem.salaryRangeId}
                      onChange={this.onChangeRadio}
                    />
                    <label className="label" htmlFor={eachItem.salaryRangeId}>
                      {eachItem.label}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="large-device-container-two">
            <div className="search-container-large">
              <input
                type="search"
                placeholder="Search"
                value={searchInput}
                className="jobs-search-element-large"
                onChange={this.onChangeSearchInput}
              />
              <button
                type="button"
                className="search-btn-large"
                onClick={this.onClickSearchIcon}
                data-testid="searchButton"
              >
                <IoIosSearch className="jobs-search-icon-large" />
              </button>
            </div>
            {this.renderJobsSectionView()}
          </div>
        </div>
      </>
    )
  }
}

export default Jobs
