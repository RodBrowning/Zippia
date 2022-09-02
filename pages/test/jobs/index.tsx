import React, { useEffect, useState } from 'react';

import Card from '../../../components/card';
import Filters from '../../../components/filters';
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
    const [filteredJobs, setFilteredJobs] = useState<IJob[]>([]);
    const [shouldFilterJobsByDay, setShouldFilterJobsByDay] = useState(false);
    const [shouldFilterJobsByCompany, setShouldFilterJobsByCompany] = useState(false);

    useEffect(() => {
        let filteredJobs: IJob[] = [...allJobs];

        if(shouldFilterJobsByDay){
            const sevenDaysJobs = filterByLastSevenDays(filteredJobs);
            filteredJobs = [...sevenDaysJobs];
        }

        if(shouldFilterJobsByCompany){
            const jobsByCompany = filterByCompany(filteredJobs);
            filteredJobs = [...jobsByCompany];
        }

        setFilteredJobs([...filteredJobs]);
        
    }, [allJobs,shouldFilterJobsByDay, shouldFilterJobsByCompany])
    
    
    return (
        <div>
            <Head>
                <title>Zippia</title>
                <meta name="description" content="Zippia front-end test." />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className={style.container}>
                <Filters
                    setShouldFilterJobsByDay={setShouldFilterJobsByDay} 
                    setShouldFilterJobsByCompany={setShouldFilterJobsByCompany}
                />
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

export const getServerSideProps  = async () => {    
    let jobsArray: IJob[] = [];
    
    try {
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
        jobsArray = jobs.slice(10).map((job: IJob) => ({
            jobId: job.jobId,
            jobTitle: job.jobTitle,
            companyName: job.companyName,
            jobDescription: job.jobDescription,
            postedDate: job.postedDate,
            postingDate: job.postingDate,
        }))

    } catch (err) {
        console.error('Fetch error.',err);
    }
    
    return {
        props: {
            allJobs: jobsArray
        }
    }
}
