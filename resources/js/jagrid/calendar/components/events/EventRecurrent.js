import { useContext, useState } from 'react';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import moment from 'moment';
import axios from 'axios';

import { locale, actions } from '../../utils/utils';
import { useAppState } from '../../contexts/appState';

export default function EventRecurrent() {

    const MySwal = withReactContent(Swal);

    const [state, dispatch] = useAppState();

    const { currentEvent } = state.calendar;

    const [start, setStart] = useState(currentEvent.start);
    const [end, setEnd] = useState(currentEvent.end);
    const [allDay, setAllDay] = useState(currentEvent.allDay);

    const [showUpdateEvent, setShowUpdateEvent] = useState(false);

    const handleChangeInput = (e) => {
        let target = e.target;
        let data = {
            name: target.name,
            value: target.value
        };

        if (target.type === 'checkbox' && target.name === 'allDay') {
            if (target.checked) {
                setAllDay(true);
            } else {
                setAllDay(false);
            }
        }

        //handleChangeInputEvent(data);
    };

    const setDate = (d) => {
        if (d) {
            if (allDay == 1) {
                if (d) {
                    return moment(d).format('YYYY-MM-DD');
                }
            } else {
                return moment(d).format('YYYY-MM-DDTHH:mm:ss');
            }
        }
        return '';
    };

    const setTypeDate = () => {
        if (allDay == 1) {
            return 'date';
        }
        return 'datetime-local';
    };

    const onChangeDate = (e) => {

        let name = e.target.name;
        let value = e.target.value;

        if (name == 'start') {
            if (value > currentEvent.end) {
                setStart(value);
                setEnd(value);
            } else {
                setStart(value);
            }
        } else if (name == 'end') {
            if (value < currentEvent.start) {
                setStart(value);
                setEnd(value);
            } else {
                setEnd(value);
            }
        }
    };

    const confirmUpdateEvent = () => {
        MySwal.fire({
            title: '<strong>Actions</strong>',
            icon: 'info',
            html: <>
                <button className="btn btn-danger" onClick={() => { updateDates(true); }}>All recurrent events</button>&nbsp;
                <button className="btn btn-secondary" onClick={() => { updateDates(); }}>Current recurrent event</button>
            </>,
            showCloseButton: true,
            showCancelButton: true,
            showConfirmButton: false,
            focusConfirm: false
        });
    };

    const updateDates = (allEvents = false) => {
        let oldStart = moment(currentEvent.start);
        let newStart = moment(start);
        let startDelta = newStart.diff(oldStart);

        let oldEnd = moment(currentEvent.end);
        let newEnd = moment(end);
        let endDelta = newEnd.diff(oldEnd);

        let data = {
            id: currentEvent.id,
            allDay: Number(allDay),
            startDelta,
            endDelta,
            allEvents
        };

        axios.put('/events-dates/milliseconds', data)
            .then(function (response) {
                let resp = response.data;
                resp.start = moment(resp.start).format();
                resp.end = moment(resp.end).format();
                setCurrentEventDates(resp);
                setShowUpdateEvent(false);
                MySwal.close();
            })
            .catch(function (error) {
                MySwal.close();
            })
            .then(function () {

            });
    }

    //Dispatch
    function setCurrentEventDates(data) {
        dispatch({
            type: actions.SET_CURRENT_EVENT_DATES,
            payload: data
        })
    }
    
    return (
        <>
            <div className="form-group mb-2">
                <label className="fw-bolder">{locale.START}</label>
                <input type={setTypeDate()} className="form-control" name="start" value={setDate(start)} onChange={(e) => { setShowUpdateEvent(true); onChangeDate(e) }} />
            </div>
            <div className="form-group mb-2">
                <label className="fw-bolder">{locale.END}</label>
                <input type={setTypeDate()} className="form-control" name="end" value={setDate(end)} onChange={(e) => { setShowUpdateEvent(true); onChangeDate(e) }} min={start} />
            </div>
            <div className="form-group mb-2">
                <label className="fw-bolder">{locale.ALL_DAY}</label>
                <div className="form-check">
                    <input className="form-check-input" name="allDay" type="checkbox" id="allDay" value="1" onChange={(e) => { setShowUpdateEvent(true); handleChangeInput(e) }} checked={allDay == 1} />
                    <label className="form-check-label" htmlFor="allDay">Yes</label>
                </div>
            </div>
            {showUpdateEvent ?
                <div className="form-group mb-2 d-flex justify-content-end">
                    <button className="btn btn-secondary btn-sm" type="button" onClick={confirmUpdateEvent}>Update recurrent event</button>
                </div>
                : ''}
        </>
    )
}