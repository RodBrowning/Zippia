import React, { useEffect, useState } from 'react';

import Card from '../../../components/card';
import Head from 'next/head';
import { IJob } from '../../../types/job';
import style from '../../../styles/Jobs.module.scss'

interface Props {
    allJobs: IJob[]
};

const filterByLastSevenDays = (jobs: IJob[]) => {
    const currentTimeInMilliseconds = Date.now();
    const sevenDaysInMilliseconds = 604800000;
    return jobs.filter((job) => {
        const jobPostingDateInMilliseconds = new Date( job.postingDate ).getTime();
        return (currentTimeInMilliseconds - jobPostingDateInMilliseconds) < sevenDaysInMilliseconds
    })
}
const filterByCompany = (jobs: IJob[]) => {
    return jobs.sort(function(a, b){
        if(a.companyName < b.companyName) { return -1; }
        if(a.companyName > b.companyName) { return 1; }
        return 0;
    })
}

const Jobs: React.FC<Props> = ({allJobs}) => {
    const [jobs, setJobs] = useState<IJob[]>(allJobs);
    const [filteredJobs, setFilteredJobs] = useState<IJob[]>([]);
    const [shouldFilterJobsByDay, setShouldFilterJobsByDay] = useState(false);
    const [shouldFilterJobsByCompany, setShouldFilterJobsByCompany] = useState(false);

    useEffect(() => {
        let filteredJobs: IJob[] = [...jobs];
        if(shouldFilterJobsByDay){
            const sevenDaysJobs = filterByLastSevenDays(filteredJobs);
            filteredJobs = [...sevenDaysJobs];
        }
        if(shouldFilterJobsByCompany){
            const jobsByCompany = filterByCompany(filteredJobs);
            filteredJobs = [...jobsByCompany];
        }
        setFilteredJobs([...filteredJobs]);
    }, [shouldFilterJobsByDay, shouldFilterJobsByCompany])
    
    
    return (
        <div>
            <Head>
                <title>Zippia</title>
                <meta name="description" content="Zippia frontend test." />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className={style.container}>
                <div className={style['filters-container']}>
                    <h2>Filters</h2>
                    <div className={style.buttons}>
                        <label htmlFor="days">
                            <input type="checkbox" id="days"  onChange={(event) => setShouldFilterJobsByDay(event.target.checked)} />
                            <span className={style.selected}>last 7 days</span>
                        </label>
                        <label htmlFor="company">
                            <input type="checkbox" id="company" onChange={(event) => setShouldFilterJobsByCompany(event.target.checked)} />
                            <span className={style.selected}>by company</span>
                        </label>
                    </div>
                </div>
                <main>
                    <ul className={style.jobsList}>
                        {filteredJobs.map((job) => {
                            return <Card job={job} key={job.jobId}/>
                        })}
                    </ul>
                </main>
            </div>
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
