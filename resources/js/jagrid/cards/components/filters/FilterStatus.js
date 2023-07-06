import { useContext } from 'react';

import { GlobalContext } from '../../context/GlobalState';

export default function FilterStatus() {

    const {
        statuses,
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


    const changeFilterEventStatus = (e) => {
        let val = Number(e.target.value);
        let isChecked = e.target.checked;
        if (isChecked) {
            addFilterEventStatuses(val);
        } else {
            deleteFilterEventStatuses(val);
        }
    };

    const isChecked = (eventStatusId) => {
        const found = filterEventStatuses.find(id => id == eventStatusId);
        if (found) {
            return true;
        }
        return false;
    }

    return (
        statuses.map(eventStatus => {
            return (
                <div className="col-xl-2 col-lg-2 col-md-3 col-sm-4 mt-2" key={eventStatus.id}>
                    <div className="form-check form-check-primary">
                        <div style={{ width: "100%", height: "6px", borderRaidus: "50%", backgroundColor: eventStatus.color }}></div>
                        <input type="checkbox" className="form-check-input" id={`filter-eventStatus-${eventStatus.id}`} value={eventStatus.id} onChange={changeFilterEventStatus} checked={isChecked(eventStatus.id)} />
                        <label className="form-check-label" htmlFor={`filter-eventStatus-${eventStatus.id}`}>{eventStatus.name}</label>
                    </div>
                </div>
            )
        })
    )
}
