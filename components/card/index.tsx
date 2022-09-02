import { IJob } from '../../types/job';
import React from 'react';
import parse from 'html-react-parser';
import style from '../../styles/Jobs.module.scss'

/* Job description has some HTML tags between the string, 
   the imported "parse" module creates this HTML tags elements. */
   
function truncateString( str: string, n: number, useWordBoundary: boolean ){
    if (str.length <= n) { return str; }
    const subString = str.slice(0, n-1);
    return (useWordBoundary 
      ? subString.slice(0, subString.lastIndexOf(" ")) 
      : subString) + "&hellip;";
};

interface Props {
    job: IJob;
}

const Card: React.FC<Props> = ({job}) => {
  return (
    <li className={style.job}>
        <p className={style.title}>{job.jobTitle}</p>
        <p className={style.company}>{job.companyName}</p>
        <div className={style.description}>{parse(truncateString(job.jobDescription, 200, true))}</div>
        <p className={style.postedDate}>{job.postedDate}</p>
    </li>
    );
}

export default Card;