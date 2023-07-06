import { useContext } from 'react';

import { GlobalContext } from '../../context/GlobalState';

export default function FilterEventType() {

  const {
    eventTypes,
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

  const changeFilterEventType = (e) => {
    let val = Number(e.target.value);
    let isChecked = e.target.checked;
    if (isChecked) {
      addFilterEventTypes(val);
    } else {
      deleteFilterEventTypes(val);
    }
  };

  const isChecked = (eventTypeId) => { 
    const found = filterEventTypes.find(id => id == eventTypeId);
    if(found){
      return true;
    }
    return false;
  }

  return (
    eventTypes.map(eventType => {
      return (
        <div style={{ marginRight: "2rem" }} key={eventType.id}>
          <div className="form-check form-check-primary">
            <input type="checkbox" className="form-check-input" id={`filter-eventType-${eventType.id}`} value={eventType.id} onChange={changeFilterEventType} checked={isChecked(eventType.id)} />
            <label className="form-check-label" htmlFor={`filter-eventType-${eventType.id}`}>{eventType.name}</label>
          </div>
        </div>
      )
    })
  )
}