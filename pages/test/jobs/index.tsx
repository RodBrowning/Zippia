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
        <ul className={style.jobsList}>
            {jobs.map((job) => {
                return <li className={style.job} key={job.jobId}>
                    <p className={style.title}>{job.jobTitle}</p>
                    <p className={style.company}>{job.companyName}</p>
                    <div className={style.description}>{parse(truncateString(job.jobDescription, 200, true))}</div>
                    <p className={style.postedDate}>{job.postedDate}</p>
                </li>
            })}
        </ul>
    </main>
    </>
  );
}

export default Jobs;