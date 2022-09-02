import React, { useState } from 'react';

import Card from '../../../components/card';
import { IJob } from '../../../types/job';
import style from '../../../styles/Jobs.module.scss'

interface Props {
    allJobs: IJob[]
};

const Jobs: React.FC<Props> = ({allJobs}) => {
    const [jobs, setJobs] = useState<IJob[]>(allJobs);
    
    return (
        <div className={style.container}>
            <div className={style['filters-container']}>
                <h2>Filters</h2>
                <div className={style.buttons}>
                    <label htmlFor="days">
                        <input type="checkbox" id="days" />
                        <span className={style.selected}>last 7 days</span>
                    </label>
                    <label htmlFor="company">
                        <input type="checkbox" id="company" />
                        <span className={style.selected}>by company</span>
                    </label>
                </div>
            </div>
            <main>
                <ul className={style.jobsList}>
                    {jobs.map((job) => {
                        return <Card job={job} key={job.jobId}/>
                    })}
                </ul>
            </main>
        </div>
    );
}

export default Jobs;

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
