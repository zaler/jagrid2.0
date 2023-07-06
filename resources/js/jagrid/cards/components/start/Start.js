import { useEffect, useState } from 'react';

import axios from 'axios';
import { Modal } from 'react-bootstrap';
import moment from 'moment';

import { locale } from '../../utils/viewData';

export default function Start(props) {

    const { event } = props;

    const [showModal, setShowModal] = useState(false);
    const [start, setStart] = useState(event.start);
    const [end, setEnd] = useState(event.end);
    const [allDay, setAllDay] = useState(event.allDay);
    const [localeStart, setLocaleStart] = useState(null);

    const handleClickStart = () => {
        setShowModal(true);
    };

    const handleChangeDate = (e) => {
        let newDate = e.target.value;
        let name = e.target.name;
        if(name == 'start'){
            if(newDate > end){
                setStart(newDate);
                setEnd(newDate);
            }else{
                setStart(newDate);
            }
        }else if(name == 'end'){
            if(newDate < start){
                setStart(newDate);
                setEnd(newDate);
            }else{
                setEnd(newDate);
            }
        }
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

    const handleChangeAllDay = (e) => {
        if (e.target.checked) {
            setAllDay(true);
        } else {
            setAllDay(false);
        }
    };

    const updateDates = () => {
        axios.put('/events/' + event.id, {
            title: event.title,
            account_id: event.account_id,
            start: start,
            end: end,
            allDay: allDay
        })
            .then(function (response) {
                setShowModal(false);
            })
            .catch(function (error) {

            })
            .then(function () {

            });
    };

    useEffect(() => {
        if(start){
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            const date = new Date(start);
            var locale = date.toLocaleDateString('en-US', options);

            if(!allDay){
                locale = date.toLocaleDateString('en-US', options) + ' ' + date.toLocaleTimeString('en-US');
            }
            setLocaleStart(locale)
        }
    }, [start, allDay]);

    return (
        <>
            <p onClick={handleClickStart}>{localeStart}</p>
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Event</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="form-group mb-1">
                        <label className="fw-bolder">{locale.START}</label>
                        <input type={setTypeDate()} name="start" value={setDate(start)} className="form-control" onChange={handleChangeDate} />
                    </div>
                    <div className="form-group mb-1">
                        <label className="fw-bolder">{locale.END}</label>
                        <input type={setTypeDate()} name="end" value={setDate(end)} className="form-control" onChange={handleChangeDate} />
                    </div>
                    <div className="form-group mb-1">
                        <label className="fw-bolder">{locale.ALL_DAY}</label>
                        <div className="form-check">
                            <input className="form-check-input" name="allDay" type="checkbox" id="allDay" value="1" onChange={handleChangeAllDay} checked={allDay}/>
                            <label className="form-check-label" htmlFor="allDay">Yes</label>
                        </div>
                    </div>
                    <div className="form-group mb-1">
                        <button type="button" className="btn btn-primary" onClick={updateDates}>{locale.SAVE}</button>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}