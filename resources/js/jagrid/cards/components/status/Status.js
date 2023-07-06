import { useContext, useState } from 'react';

import axios from 'axios';

import { GlobalContext } from '../../context/GlobalState';
import { locale } from '../../utils/viewData';

export default function Status(props) {

    const { event } = props;

    const { statuses } = useContext(GlobalContext);

    const [currentStatusId, setCurrentStatusId] = useState(event.status.id);

    const [isLoading, setIsLoading] = useState(false);

    const handleChangeStatus = (e) => {
        updateEvent(e.target.value);
    };

    const updateEvent = (status_id) => {
        axios.put('/events/' + event.id, {
            title: event.title,
            start: event.start,
            account_id: event.account_id,
            event_status_id: status_id
        })
            .then(function (response) {
                setCurrentStatusId(response.data.event_status_id);
            })
            .catch(function (error) {

            })
            .then(function () {

            });
    };

    return (
        <>
            {currentStatusId == 6 ?
                <>
                    <label className="fw-bolder">{locale.STATUS}</label>
                    <label className="d-block">{event.status.name}</label>
                    {isLoading ?
                        <button class="btn btn-primary" type="button" disabled>
                            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            Loading...
                        </button>
                        : <button type="button" className="btn btn-primary" onClick={() => updateEvent(7)}>{locale.INTERNAL_APPROVAL}</button>}
                </>
                : ''}
            {currentStatusId == 7 ?
                <>
                    <label className="fw-bolder">{locale.STATUS}</label>
                    <label className="d-block">{locale.PENDING_CLIENT_APPROVAL}</label>
                    {isLoading ?
                        <button class="btn btn-primary" type="button" disabled>
                            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            Loading...
                        </button>
                        : <button type="button" className="btn btn-primary" onClick={() => updateEvent(9)}>{locale.APPROVAL}</button>}
                </>
                : ''}
            {currentStatusId == 8 ?
                <>
                    <label className="fw-bolder">{locale.STATUS}</label>
                    <label className="d-block">{event.status.name}</label>
                    {isLoading ?
                        <button class="btn btn-primary" type="button" disabled>
                            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            Loading...
                        </button>
                        : <button type="button" className="btn btn-primary" onClick={() => updateEvent(9)}>{locale.APPROVAL}</button>}
                </>
                : ''}
            {currentStatusId == 9 ?
                <>
                    <label className="fw-bolder">{locale.STATUS}</label>
                    <select className="form-select" onChange={handleChangeStatus} value={currentStatusId} disabled>
                        <option value="">-- {locale.SELECT} --</option>
                        {statuses ?
                            statuses.map((s) => <option value={s.id} key={s.id}>{s.name}</option>)
                            : ''}
                    </select>
                </>
                : ''}
            {currentStatusId != 6 && currentStatusId != 7 && currentStatusId != 8 && currentStatusId != 9 ?
                <>
                    <label className="fw-bolder">{locale.STATUS}</label>
                    <select className="form-select" onChange={handleChangeStatus} value={currentStatusId}>
                        <option value="">-- {locale.SELECT} --</option>
                        {statuses ?
                            statuses.map((s) => <option value={s.id} key={s.id}>{s.name}</option>)
                            : ''}
                    </select>
                </>
                : ''}
        </>
    )
}