import { useContext, useEffect, useState } from 'react';

import { Button, Modal, Form } from 'react-bootstrap';
import moment from 'moment';
import axios from 'axios';

import IndexEventList from './index_event/IndexEventList';
import { locale, account_id, actions } from '../utils/utils';
import { useAppState } from '../contexts/appState';

export default function IndexEvent(props) {

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
        account_id,
        color: ''
    };

    const defaultColors = [
        { name: "Orange", color: "#ff9f43" },
        { name: "Yellow", color: "#F1C40F" },
        { name: "Teal", color: "#1ABC9C" },
        { name: "Green", color: "#27AE60" },
        { name: "Light Blue", color: "#85C7F2" },
        { name: "Blue", color: "#3381FF" },
        { name: "Purple", color: "#9B59B6" },
        { name: "Magenta", color: "#D30C7B" },
        { name: "Red", color: "#E74C3C" },
        { name: "Caret", color: "#750D37" },
        { name: "Black", color: "#222222" }
    ];

    const [state, dispatch] = useAppState();

    const { indexEvents } = state.calendar;

    const { calendarRef, getIndexEvents } = props;

    const [action, setAction] = useState('');
    const [indexEvent, setIndexEvent] = useState(schemaObject);
    const [errorTitle, setErrorTitle] = useState('');
    const [errorType, setErrorType] = useState('');
    const [errorDate, setErrorDate] = useState('');

    const [show, setShow] = useState(false);

    const handleClose = () => {
        setShow(false);
        setIndexEvent(schemaObject);
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
        setIndexEvent(prevState => ({
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

    const saveIndexEvent = () => {
        setErrorTitle('');
        setErrorType('');
        setErrorDate('');

        if (action === 'add') {
            axios.post('/index/events', indexEvent)
                .then(function (resp) {
                    let response = resp.data;
                    if (response.success) {
                        addIndexEvent(response.data);
                        setIndexEvent(prevState => ({
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
            axios.put(`/index/events/${indexEvent.id}`, indexEvent)
                .then(function (resp) {
                    let response = resp.data;
                    if (response.success) {
                        setIndexEvent(response.data);
                        getIndexEvents();
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

    const removeIndexEvent = () => {
        axios.delete(`/index/events/${indexEvent.id}`)
            .then(function (response) {
                deleteIndexEvent(indexEvent.id);
                handleClose();
            })
            .catch(function (error) {

            })
            .then(function () {

            });
    };

    const handleClick = (id) => {
        axios.get(`/index/events/${id}`)
            .then(function (response) {
                setAction('update');
                setIndexEvent(response.data);
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

        setIndexEvent(prevState => ({
            ...prevState,
            type,
            date
        }));
    };

    useEffect(() => {
        if (indexEvent.date) {
            let date = moment(indexEvent.date);

            let year = date.format('YYYY');
            let month = date.format('M');
            let week = date.isoWeek();
            let day = date.format('D');

            setIndexEvent(prevState => ({
                ...prevState,
                year,
                month,
                week,
                day
            }));
        }
    }, [indexEvent.date]);

    useEffect(() => {
        setDate();
    }, [indexEvent.is_temporary]);

    const renderDefaultColors = () => {
        return defaultColors.map((dc, index) => {
            return (
                <div className="col-md-4" key={index}>
                    <label className="container-radio">{dc.name}
                        <input type="radio" name="color" className="default-color" value={dc.color} onChange={handleChange} />
                        <span className="checkmark" style={{ backgroundColor: dc.color }}></span>
                    </label>
                </div>
            )
        })
    };

    const uncheckedDefaultColors = () => {
        var defaultColors = document.querySelectorAll(".default-color");
        var defaultColorsLength = defaultColors.length;
        for (let i = 0; i < defaultColorsLength; i++) {
            const element = defaultColors[i];
            element.checked = false;
        }
    };

    //Dispatches
    function addIndexEvent(data) {
        dispatch({
            type: actions.ADD_INDEX_EVENT,
            payload: data
        })
    }
    
    function deleteIndexEvent(data) {
        dispatch({
            type: actions.DELETE_INDEX_EVENT,
            payload: data
        })
    }

    return (
        <>
            <IndexEventList indexEvents={indexEvents} handleClick={handleClick} />

            <div className="d-flex justify-content-end">
                <Button variant="primary" size="sm" onClick={handleShow}>
                    {locale.ADD_INDEX_EVENT}
                </Button>
            </div>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Proyecto</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-1">
                            <label className="fw-bold">{locale.TITLE}</label>
                            <Form.Control className={errorTitle ? 'form-control is-invalid' : 'form-control'} type="text" placeholder="I want to be better :)" name="title" value={indexEvent.title} onChange={handleChange} />
                            <div className="invalid-feedback">{errorTitle ? errorTitle : ''}</div>
                        </Form.Group>
                        <Form.Group className="mt-2">
                            <label className="fw-bold">Seleccionar color</label>
                        </Form.Group>
                        <Form.Group className="row mt-2">
                            {renderDefaultColors()}
                        </Form.Group>
                        <Form.Group className="mt-2">
                            <label className="fw-bold">Custom color</label><br />
                            <input type="color" name="color" className="form-control" value={indexEvent.color} onChange={(e) => { handleChange(e); uncheckedDefaultColors(); }} />
                        </Form.Group>
                        <Form.Group className="mb-1">
                            <div className="form-check form-check-primary">
                                <input type="checkbox" className="form-check-input" id="is_temporary" name="is_temporary" checked={indexEvent.is_temporary} onChange={handleChange} />
                                <label className="form-check-label" htmlFor="is_temporary">Marcar como temporal</label>
                            </div>
                        </Form.Group>
                        {indexEvent.is_temporary ?
                            <>
                                <Form.Group className="mb-1">
                                    <label className="fw-bold">Tipo</label>
                                    <select className={errorType ? 'form-select is-invalid' : 'form-select'} name="type" value={indexEvent.type} onChange={handleChange}>
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
                                    <input type="date" className={errorDate ? 'form-control is-invalid' : 'form-control'} name="date" value={indexEvent.date} onChange={handleChange} />
                                    <div className="invalid-feedback">{errorDate ? errorDate : ''}</div>
                                </Form.Group>
                            </>
                            : ""}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    {action === 'update' ?
                        <Button variant="danger" onClick={removeIndexEvent}>{locale.DELETE}</Button>
                        : ''}
                    <Button variant="light" onClick={handleClose}>
                        {locale.CANCEL}
                    </Button>
                    <Button variant="primary" onClick={saveIndexEvent}>
                        {locale.SAVE}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}