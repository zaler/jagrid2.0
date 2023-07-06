import { useContext } from 'react';

import { GlobalContext } from '../../context/GlobalState';

export default function FilterDate() {

  const {
    filterEventTypes,
    filterEventStatuses,
    addFilterEventTypes,
    deleteFilterEventTypes,
    addFilterEventStatuses,
    deleteFilterEventStatuses,
    filterStartDate,
    filterEndDate,
    setFilterStartDate,
    setFilterEndDate
  } = useContext(GlobalContext);
  
  const changeFilterEventDates = (e) => {
    let val = e.target.value;
    let name = e.target.name;

    if(name === 'filter-start-date'){
      setFilterStartDate(val);
    }else if(name === 'filter-end-date'){
      setFilterEndDate(val);
    }
  };
  return (
    <div className="row">
      <div className="col-md-6 col-12">
        <div className="mb-1">
          <label className="form-label" htmlFor="filter-start-date">Start date</label>
          <input type="date" className="form-control" name="filter-start-date" id="filter-start-date" onChange={changeFilterEventDates} value={filterStartDate} />
        </div>
      </div>
      <div className="col-md-6 col-12">
        <div className="mb-1">
          <label className="form-label" htmlFor="filter-end-date">End date</label>
          <input type="date" className="form-control" name="filter-end-date" id="filter-end-date" onChange={changeFilterEventDates} min={filterStartDate} value={filterEndDate} />
        </div>
      </div>
    </div>
  )
}