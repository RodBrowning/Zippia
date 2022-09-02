import React, { useState } from 'react';

import parse from 'html-react-parser';
import style from '../../../styles/Jobs.module.scss'

interface IJob {
    jobId: string;
    jobTitle: string;
    companyName: string;
    jobDescription: string;
    postedDate: string;
    postingDate: string;
}

interface Props {
    allJobs: IJob[]
};

export const getStaticProps  = async () => {
    const res = await fetch("https://www.zippia.com/api/jobs",{
        headers: {
            'Content-Type': 'application/json'
          },
        method: 'POST',
        body: JSON.stringify({
            "companySkills": true,
            "dismissedListingHashes": [],
            "fetchJobDesc": true,
            "jobTitle": "Business Analyst",
            "locations": [],
            "numJobs": 20,
            "previousListingHashes": []
        })
    })
    
    const { jobs } = await res.json();
    const jobsArray = jobs.slice(10).map((job: IJob) => ({
        jobId: job.jobId,
        jobTitle: job.jobTitle,
        companyName: job.companyName,
        jobDescription: job.jobDescription,
        postedDate: job.postedDate,
        postingDate: job.postingDate,
    }))
    
    return {
        props: {
            allJobs: jobsArray
        }
    }
}

function truncateString( str: string, n: number, useWordBoundary: boolean ){
    if (str.length <= n) { return str; }
    const subString = str.slice(0, n-1); // the original check
    return (useWordBoundary 
      ? subString.slice(0, subString.lastIndexOf(" ")) 
      : subString) + "&hellip;";
  };

const Jobs: React.FC<Props> = ({allJobs}) => {
    const [jobs, setJobs] = useState<IJob[]>(allJobs);
    
  return (
    <>
    <main>
        <div className={style.jobsList}>
            {jobs.map((job) => {
                return <div className="job" key={job.jobId}>
                    <p>{job.jobTitle}</p>
                    <p>{job.companyName}</p>
                    <div>{parse(truncateString(job.jobDescription, 200, true))}</div>
                    <p>{job.postedDate}</p>
                </div>
            })}
        </div>
    </main>
    </>
  );
}

export default Jobs;