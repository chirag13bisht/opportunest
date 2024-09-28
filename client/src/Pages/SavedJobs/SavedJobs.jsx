import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; 
import { jobData } from '../../data/JobsData'; 
import './SavedJobs.css';

const SavedJobs = () => {
    const { userId } = useParams(); 
    const [savedJobs, setSavedJobs] = useState({});
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

   

    useEffect(() => {
        const fetchSavedJobs = async () => {
            if (userId) {
                const storedJobs = localStorage.getItem(`savedJobs_${userId}`);
                if (storedJobs) {
                    try {
                        const parsedJobs = JSON.parse(storedJobs);
                        if (typeof parsedJobs === 'object' && !Array.isArray(parsedJobs)) {
                            setSavedJobs(parsedJobs);
                        }
                    } catch (error) {
                        console.error("Error parsing saved jobs:", error);
                    }
                }
            }
            setLoading(false);
        };

        fetchSavedJobs();
    }, [userId]);

    const savedJobIds = Object.keys(savedJobs).filter(jobId => savedJobs[jobId]);
    const filteredJobs = jobData.hits.filter(job => 
        savedJobIds.includes(job.id) && 
        (job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
         job.company_name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (loading) return <div className="loading-spinner">Loading...</div>;

    return (
        <div className='savedjobs-maindiv'>
            <h1 className="saved-jobs-title">Your Saved Jobs</h1> {/* Title added here */}
            <input
                type="text"
                placeholder="Search saved jobs..."
                className="search-bar"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
            />
            {filteredJobs.length > 0 ? (
                <div className="job-cards">
                    {filteredJobs.map((job) => (
                        <div key={job.id} className='savedjobs-div'>
                            <h2>{job.title}</h2>
                            <p><strong>Company:</strong> {job.company_name}</p>
                            <p><strong>Location:</strong> {job.location}</p>
                            <p><strong>Published:</strong> {job.formatted_relative_time}</p>
                            <p><strong>Salary:</strong> ${job.salary.min} - ${job.salary.max} ({job.salary.type})</p>
                            <p><strong>Locality:</strong> {job.locality}</p>
                            <button className='apply-button' onClick={() => window.location.href = job.link}>
                                Apply for Job
                            </button>
                            <button className='remove-button' onClick={() => handleRemoveJob(job.id)}>
                                Remove from Saved
                            </button>
                            <p><strong>Job Description:</strong> {job.description}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No saved jobs found.</p>
            )}
        </div>
    );

    function handleRemoveJob(jobId) {
        const updatedSavedJobs = { ...savedJobs };
        delete updatedSavedJobs[jobId];
        setSavedJobs(updatedSavedJobs);
        localStorage.setItem(`savedJobs_${userId}`, JSON.stringify(updatedSavedJobs));
    }
};

export default SavedJobs;
