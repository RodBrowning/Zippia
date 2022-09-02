import React from 'react';
import style from '../../styles/Filter.module.scss'

interface Props {
    setShouldFilterJobsByDay: Function;
    setShouldFilterJobsByCompany: Function;
}

const Filters: React.FC<Props> = ({setShouldFilterJobsByDay, setShouldFilterJobsByCompany}) => {
  return (
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
  );
}

export default Filters;