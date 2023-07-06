import { useContext, useEffect, useState } from 'react';

import { Button, Modal, Form } from 'react-bootstrap';
import moment from 'moment';
import axios from 'axios';

import ExternalEventList from './external_event/ExternalEventList';
import { locale, account_id, actions } from '../utils/utils';
import { useAppState } from '../contexts/appState';

export default function ExternalEvent(props) {

    const schemaObject = {
        id: '',
        title: '',
        type: '',
        date: '',
        year: '',
        month: '',
        week: '',
        day: '',
        is_temporary: false,
        account_id
    };

    const [state, dispatch] = useAppState();

    const { externalEvents } = state.calendar;

    const { calendarRef, getExternalEvents } = props;

    const [action, setAction] = useState('');
    const [externalEvent, setExternalEvent] = useState(schemaObject);
    const [errorTitle, setErrorTitle] = useState('');
    const [errorType, setErrorType] = useState('');
    const [errorDate, setErrorDate] = useState('');

    const [show, setShow] = useState(false);

    const handleClose = () => {
        setShow(false);
        setExternalEvent(schemaObject);
        setErrorTitle('');
        setErrorDate('');
        setErrorType('');
        setAction('');
    };

    const handleShow = () => {
        setShow(true);
        setAction('add');
        setDate();
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();
    };

    const handleChange = (e) => {
        let name = e.target.name;
        let value = e.target.value;

        if (name == 'is_temporary') {
            value = e.target.checked;
        }
        setExternalEvent(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const getViewType = () => {
        if (calendarRef) {
            return calendarRef.current.getApi().view.type;
        }
        return;
    };

    const saveExternalEvent = () => {
        setErrorTitle('');
        setErrorType('');
        setErrorDate('');

        if (action === 'add') {
            axios.post('/external/events', externalEvent)
                .then(function (resp) {
                    let response = resp.data;
                    if (response.success) {
                        addExternalEvent(response.data);
                        setExternalEvent(prevState => ({
                            ...prevState,
                            id: response.data.id
                        }));
                        setAction('update');
                    }
                })
                .catch(function (error) {
                    let errors = error.response.data.errors;
                    if (errors.title) {
                        setErrorTitle(errors.title[0]);
                    }
                    if (errors.type) {
                        setErrorType(errors.type[0]);
                    }
                    if (errors.date) {
                        setErrorDate(errors.date[0]);
                    }
                })
                .then(function () {

                });
        } else if (action === 'update') {
            axios.put(`/external/events/${externalEvent.id}`, externalEvent)
                .then(function (resp) {
                    let response = resp.data;
                    if (response.success) {
                        setExternalEvent(response.data);
                        getExternalEvents();
                    }
                })
                .catch(function (error) {
                    let errors = error.response.data.errors;
                    if (errors.title) {
                        setErrorTitle(errors.title[0]);
                    }
                    if (errors.type) {
                        setErrorType(errors.type[0]);
                    }
                    if (errors.date) {
                        setErrorDate(errors.date[0]);
                    }
                })
                .then(function () {

                });
        }
    };

    const removeExternalEvent = () => {
        axios.delete(`/external/events/${externalEvent.id}`)
            .then(function (response) {
                deleteExternalEvent(externalEvent.id);
                handleClose();
            })
            .catch(function (error) {

            })
            .then(function () {

            });
    };

    const handleClick = (id) => {
        axios.get(`/external/events/${id}`)
            .then(function (response) {
                setAction('update');
                setExternalEvent(response.data);
                setShow(true);
            })
            .catch(function (error) {

            })
            .then(function () {

            });
        /*setShow(true);
        setAction('update');*/
    };

    const setDate = () => {
        let type = "";
        let date = moment(calendarRef.current.getApi().view.currentStart).format("YYYY-MM-DD");

        switch (getViewType()) {
            case "dayGridMonth":
                type = "month";
                break;
            case "timeGridWeek":
                type = "week";
                break;
            case "timeGridDay":
                type = "day";
                break;
            default:
                break;
        }

        if (type == "month") {
            let currentCalendarMonthYear = moment(calendarRef.current.getApi().view.currentStart).format("YYYY-MM");
            let now = moment().format("YYYY-MM");

            if (currentCalendarMonthYear == now) {
                date = moment().format("YYYY-MM-DD");
            }
        }

        setExternalEvent(prevState => ({
            ...prevState,
            type,
            date
        }));
    };

    useEffect(() => {
        if (externalEvent.date) {
            let date = moment(externalEvent.date);

            let year = date.format('YYYY');
            let month = date.format('M');
            let week = date.isoWeek();
            let day = date.format('D');

            setExternalEvent(prevState => ({
                ...prevState,
                year,
                month,
                week,
                day
            }));
        }
    }, [externalEvent.date]);

    useEffect(() => {
        setDate();
    }, [externalEvent.is_temporary]);

    //Dispatches
    function addExternalEvent(data) {
        dispatch({
            type: actions.ADD_EXTERNAL_EVENT,
            payload: data
        })
    }
    
    function deleteExternalEvent(data) {
        dispatch({
            type: actions.DELETE_EXTERNAL_EVENT,
            payload: data
        })
    }

    return (
        <>
            <ExternalEventList externalEvents={externalEvents} handleClick={handleClick} />

            <div className="d-flex justify-content-end">
                <Button variant="primary" size="sm" onClick={handleShow}>
                    {locale.ADD_EXTERNAL_EVENT}
                </Button>
            </div>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Ejes tematicos</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-1">
                            <label className="fw-bold">{locale.TITLE}</label>
                            <Form.Control className={errorTitle ? 'form-control is-invalid' : 'form-control'} type="text" placeholder="I want to be better :)" name="title" value={externalEvent.title} onChange={handleChange} />
                            <div className="invalid-feedback">{errorTitle ? errorTitle : ''}</div>
                        </Form.Group>
                        <Form.Group className="mb-1">
                            <div className="form-check form-check-primary">
                                <input type="checkbox" className="form-check-input" id="is_temporary" name="is_temporary" checked={externalEvent.is_temporary} onChange={handleChange} />
                                <label className="form-check-label" htmlFor="is_temporary">Marcar como temporal</label>
                            </div>
                        </Form.Group>
                        {externalEvent.is_temporary ?
                            <>
                                <Form.Group className="mb-1">
                                    <label className="fw-bold">Tipo</label>
                                    <select className={errorType ? 'form-select is-invalid' : 'form-select'} name="type" value={externalEvent.type} onChange={handleChange}>
                                        <option value="">-- Select --</option>
                                        <option value="year" className="d-none">Año</option>
                                        <option value="month">Mes</option>
                                        <option value="week">Semana</option>
                                        <option value="day">Dia</option>
                                    </select>
                                    <div className="invalid-feedback">{errorType ? errorType : ''}</div>
                                </Form.Group>
                                <Form.Group className="mb-1 d-none">
                                    <label className="fw-bold">Fecha</label>
                                    <input type="date" className={errorDate ? 'form-control is-invalid' : 'form-control'} name="date" value={externalEvent.date} onChange={handleChange} />
                                    <div className="invalid-feedback">{errorDate ? errorDate : ''}</div>
                                </Form.Group>
                            </>
                            : ""}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    {action === 'update' ?
                        <Button variant="danger" onClick={removeExternalEvent}>{locale.DELETE}</Button>
                        : ''}
                    <Button variant="light" onClick={handleClose}>
                        {locale.CANCEL}
                    </Button>
                    <Button variant="primary" onClick={saveExternalEvent}>
                        {locale.SAVE}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}