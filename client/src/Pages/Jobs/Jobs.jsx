import React, { useEffect, useState } from 'react';
import './Jobs.css';
import photo3 from '../../image/photo3.png';
import { jobData } from '../../data/JobsData';
import axios from 'axios';


const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [searchIsStarted, setSearchisStarted] = useState(false);
  const [clickedJobIds, setClickedJobIds] = useState({});
  const [selectedJob, setSelectedJob] = useState(null); 
  const [searchItems, setSearchItems] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  const [FilteredLocation, setFilteredLocation] = useState([]);
  const [itemsIsSearched, setItemsisSearched] = useState(true);
  const [LocationIsSearched, setLocationisSearched] = useState(true);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [isSearchClicked, setIsSearchClicked] = useState(false);
  const [userId, setUserId] =useState("");
  const [userData, setUserData] = useState();

  const callAbout = async () => {
      try {
          const res = await axios.get('https://opportunest-1.vercel.app/api/auth/user', {
              withCredentials: true, // to include cookies
              headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
              },
          });
          setUserId(res.data._id);
          setUserData(res.data);

      } catch (error) {
          console.error(error);
      }
  };

  // Clear userData when token is missing or logout occurs
  useEffect(() => {
      callAbout();
  }, []);

  const fetchJobs = async () => {
    setJobs(jobData.hits);
    setSearchisStarted(true);
    localStorage.setItem('searchisstarted', 'true');
    localStorage.setItem('jobs', JSON.stringify(jobData.hits)); // Store jobs in localStorage
  };


  useEffect(() => {
    const savedState = localStorage.getItem('searchisstarted');
    const savedJobs = localStorage.getItem('jobs');

    if (savedState === 'true') {
      setSearchisStarted(true);
    }

    if (savedJobs) {
      setJobs(JSON.parse(savedJobs)); // Retrieve and set jobs from localStorage
    }
  }, []);


  useEffect(() => {
    if (searchItems) {
      const filtered = jobs.filter(job =>
        job.title.toLowerCase().includes(searchItems.toLowerCase())
      );
      setFilteredItems(filtered);
    } else {
      setFilteredItems([]);
    }
  }, [searchItems, jobs]);

  useEffect(() => {
    if (searchLocation) {
      const filtered = jobs.filter(job =>
        job.location.toLowerCase().includes(searchLocation.toLowerCase())
      );
      setFilteredLocation(filtered);
    } else {
      setFilteredLocation([]);
    }
  }, [searchLocation, jobs]);

  useEffect(() => {
    if (userData && userId) {
        const storedJobs = JSON.parse(localStorage.getItem(`savedJobs_${userId}`)) || {};
        setClickedJobIds(storedJobs);
    }
}, [userData?._id]);

  const handleSvgClick = (id) => {
    if(!userData || !userId) return;
    setClickedJobIds((prev) => {
      const updatedJobs ={
        ...prev,
        [id]: !prev[id],
      };
      localStorage.setItem(`savedJobs_${userId}`, JSON.stringify(updatedJobs));
      return updatedJobs;
    });
  };
  console.log(clickedJobIds)

  const handleJobClick = (job) => {
    setSelectedJob(job);
    window.history.pushState(null, '', `/jobs/${job.id}`);
  };
 
   // Combine title and location filters before rendering the jobs
 
   const handleSearchClick = () => {
    fetchJobs();
    if(!searchItems || !searchLocation){
      window.alert("Fill the data")
      const filtered = jobs.filter(
        (job) =>
          (!searchItems || job.title.toLowerCase().includes(searchItems.toLowerCase())) &&
          (!searchLocation || job.location.toLowerCase().includes(searchLocation.toLowerCase()))
      );
      setFilteredJobs(filtered);
      setIsSearchClicked(true);
    
    }
    else{
      const filtered = jobs.filter(
        (job) =>
          (!searchItems || job.title.toLowerCase().includes(searchItems.toLowerCase())) &&
          (!searchLocation || job.location.toLowerCase().includes(searchLocation.toLowerCase()))
      );
      setFilteredJobs(filtered);
      setIsSearchClicked(true);
    }
   
  };

  const handleBackClick = () => {
    setSelectedJob(null);
};
const handleKeyDown = (event) => {
  if (event.key === 'Enter') {
      handleSearchClick();
  }
};

  return (
    <>
      <div className='parent-container'>
        <div className='search-div'>
          <div className='search-div-1'>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
            </svg>
            <input
              placeholder='search by job title'
              className='job-title-search'
              value={searchItems}
              onChange={(e) => {setSearchItems(e.target.value);setItemsisSearched(true)}}
              onKeyDown={handleKeyDown}
              
            />
            {itemsIsSearched && searchItems && filteredItems.length > 0 && (
              <div className='dropdown'>
                {filteredItems.map((job) => (
                  <div
                    key={job.id}
                    className='dropdown-item'
                    onClick={() => {setSearchItems(job.title);setItemsisSearched(false);}}
                  ><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                  <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
                </svg>
                   <span>{job.title}</span> 
                  </div>
                ))}
              </div>
            )}
          </div>
          <span className='separator'>|</span>
          <div className='search-div-2'>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
              <path d="M168.3 499.2C116.1 435 0 279.4 0 192C0 85.96 85.96 0 192 0C298 0 384 85.96 384 192C384 279.4 267 435 215.7 499.2C203.4 514.5 180.6 514.5 168.3 499.2H168.3zM192 256C227.3 256 256 227.3 256 192C256 156.7 227.3 128 192 128C156.7 128 128 156.7 128 192C128 227.3 156.7 256 192 256z" />
            </svg>
            <input placeholder='search by place' className='place-search' value={searchLocation} onChange={(e) => {setSearchLocation(e.target.value);setLocationisSearched(true)}} onKeyDown={handleKeyDown}/>
            {LocationIsSearched && searchLocation && FilteredLocation.length > 0 && (
              <div className='dropdown'>
                {FilteredLocation.map((job) => (
                  <div
                    key={job.id}
                    className='dropdown-item'
                    onClick={() => {setSearchLocation(job.location);setLocationisSearched(false)}}
                  ><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                  <path d="M168.3 499.2C116.1 435 0 279.4 0 192C0 85.96 85.96 0 192 0C298 0 384 85.96 384 192C384 279.4 267 435 215.7 499.2C203.4 514.5 180.6 514.5 168.3 499.2H168.3zM192 256C227.3 256 256 227.3 256 192C256 156.7 227.3 128 192 128C156.7 128 128 156.7 128 192C128 227.3 156.7 256 192 256z" />
                </svg>
                        <span>{job.location}</span>   
                  </div>
                ))}
              </div>
            )}
          </div>
          <button className='search-button' onClick={handleSearchClick}>Search</button>
        </div>
      </div>
      <section className='section'>
        {!searchIsStarted && (
          <div className='section-image-div'>
            <img src={photo3} alt='place' className='section-image' />
          </div>
        )}
        {searchIsStarted && (
          <div className='main-job-div'>
            <div className='job-div-div'>
            {(isSearchClicked ? filteredJobs : jobs).map((job) => (
                <div key={job.id} onClick={() => handleJobClick(job)} className='job-divs'>
                  <h1>{job.title}</h1>
                  <span>{job.company_name}</span>
                  <span>{job.location}</span>
                  <p className='p-status'>{job.formatted_relative_time}</p>
                  <p className='p-description'>{job.description}</p>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill={clickedJobIds[job.id] ? 'black' : 'white'}
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    className='icon icon-tabler icons-tabler-outline icon-tabler-bookmark'
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSvgClick(job.id);
                    }}
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill='none' />
                    <path d="M18 7v14l-6 -4l-6 4v-14a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4z" />
                  </svg>
                </div>
              ))}
            </div>
            <div className='jobs-description-div-div'>
              {selectedJob && (
                <div className='jobs-description-div'>
                  <h2>{selectedJob.title}</h2>
                  <p><strong>Company:</strong> {selectedJob.company_name}</p>
                  <p><strong>Location:</strong> {selectedJob.location}</p>
                  <p><strong>Published:</strong> {selectedJob.formatted_relative_time}</p>
                  <p><strong>Salary:</strong> ${selectedJob.salary.min} - ${selectedJob.salary.max} ({selectedJob.salary.type})</p>
                  <p><strong>Locality:</strong> {selectedJob.locality}</p>
                  <button className='apply-button' onClick={() => window.location.href = selectedJob.link}>
                    Apply for Job
                  </button>
                  <p><strong>Job Description:</strong> {selectedJob.description}</p>
                </div>
              )}
             
            </div>
            <div className='jobs-description-new-div'>
            {selectedJob && (
                 <div className='jobs-description-screen'>
                
                 <div className='jobs-description-screen-div' >
                 <button className='mobile-display-back-button' onClick={handleBackClick}>
                     &larr; Back
                 </button>
                     <h2 className='mobile-display-job-description-title'>{selectedJob.title}</h2>
                     <p className='mobile-display-job-description-p'><strong>Company:</strong> {selectedJob.company_name}</p>
                     <p className='mobile-display-job-description-p'><strong>Location:</strong> {selectedJob.location}</p>
                     <p className='mobile-display-job-description-p'><strong>Published:</strong> {selectedJob.formatted_relative_time}</p>
                     {selectedJob.salary && (
                         <p className='mobile-display-job-description-p'><strong>Salary:</strong> ${selectedJob.salary.min} - ${selectedJob.salary.max} ({selectedJob.salary.type})</p>
                     )}
                     {selectedJob.locality && (
                         <p className='mobile-display-job-description-p'><strong>Locality:</strong> {selectedJob.locality}</p>
                     )}
                     <button className='mobile-display-apply-button' onClick={() => window.location.href = selectedJob.link}>
                         Apply for Job
                     </button>
                     <p className='mobile-display-job-description-p'> <strong>Job Description:</strong> {selectedJob.description}</p>
                 </div>
             </div>
              )}
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default Jobs;
