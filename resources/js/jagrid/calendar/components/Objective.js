import { useContext, useEffect, useState } from 'react';

import { Button, Modal, Form } from 'react-bootstrap';
import moment from 'moment';
import axios from 'axios';

import ObjectiveList from './objectives/ObjectiveList';
import { locale, account_id, actions } from '../utils/utils';
import { useAppState } from '../contexts/appState';

export default function Objective(props) {

    const schemaObject = {
        id: '',
        title: '',
        description: '',
        type: '',
        date: '',
        year: '',
        month: '',
        week: '',
        day: '',
        account_id
    };

    const [state, dispatch] = useAppState();

    const { objectives } = state;

    const { calendarRef, getObjectives } = props;

    const [action, setAction] = useState('');
    const [objective, setObjective] = useState(schemaObject);
    const [errorTitle, setErrorTitle] = useState('');
    const [errorType, setErrorType] = useState('');
    const [errorDate, setErrorDate] = useState('');

    const [show, setShow] = useState(false);

    const handleClose = () => {
        setShow(false);
        setObjective(schemaObject);
        setErrorTitle('');
        setErrorDate('');
        setErrorType('');
        setAction('');
    };

    const handleShow = () => {
        setShow(true);
        setAction('add');

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

        setObjective(prevState => ({
            ...prevState,
            type,
            date
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();
    };

    const handleChange = (e) => {
        let name = e.target.name;
        let value = e.target.value;
        setObjective(prevState => ({
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

    const saveObjective = () => {
        setErrorTitle('');
        setErrorType('');
        setErrorDate('');

        if(action === 'add'){
            axios.post('/objectives', objective)
            .then(function (resp) {
                let response = resp.data;
                if (response.success) {
                    addObjective(response.data);
                    setObjective(prevState => ({
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
        }else if(action === 'update'){
            axios.put('/objectives/' + objective.id, objective)
            .then(function (resp) {
                let response = resp.data;
                if(response.success){
                    if(!response.data.description){
                        response.data.description = '';
                    }
                    setObjective(response.data);
                    getObjectives();
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

    const removeObjective = () => {
        axios.delete(`/objectives/${objective.id}`)
        .then(function (response) {
            deleteObjective(objective.id);
            handleClose();
        })
        .catch(function (error) {

        })
        .then(function () {

        });
    };

    const handleClick = (id) => {
        axios.get(`/objectives/${id}`)
        .then(function (response) {
            setAction('update');
            if(!response.data.description){
                response.data.description = '';
            }
            setObjective(response.data);
            setShow(true);
        })
        .catch(function (error) {

        })
        .then(function () {

        });
        /*setShow(true);
        setAction('update');*/
    };

    useEffect(() => {
        if (objective.date) {
            let date = moment(objective.date);

            let year = date.format('YYYY');
            let month = date.format('M');
            let week = date.isoWeek();
            let day = date.format('D');

            setObjective(prevState => ({
                ...prevState,
                year,
                month,
                week,
                day
            }));
        }
    }, [objective.date]);

    //Dispatches
    function addObjective(data) {
        dispatch({
            type: actions.ADD_OBJECTIVE,
            payload: data
        })
    }
    
    function deleteObjective(data) {
        dispatch({
            type: actions.DELETE_OBJECTIVE,
            payload: data
        })
    }

    return (
        <>
            <ObjectiveList objectives={objectives} handleClick={handleClick} />

            <div className="d-flex justify-content-end">
                <Button variant="primary" size="sm" onClick={handleShow}>
                    {locale.ADD_OBJECTIVE}
                </Button>
            </div>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{locale.OBJECTIVE}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-1">
                            <label className="fw-bold">{locale.TITLE}</label>
                            <Form.Control className={errorTitle ? 'form-control is-invalid' : 'form-control'} type="text" placeholder="I want to be better :)" name="title" value={objective.title} onChange={handleChange} />
                            <div className="invalid-feedback">{errorTitle ? errorTitle : ''}</div>
                        </Form.Group>
                        <Form.Group className="mb-1">
                            <label className="fw-bold">{locale.DESCRIPTION}</label>
                            <Form.Control as="textarea" rows={3} placeholder="Awesome description!" name="description" value={objective.description} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-1">
                            <label className="fw-bold">Type</label>
                            <select className={errorType ? 'form-select is-invalid' : 'form-select'} name="type" value={objective.type} onChange={handleChange}>
                                <option value="">-- Select --</option>
                                <option value="year" className="d-none">Year</option>
                                <option value="month">Month</option>
                                <option value="week">Week</option>
                                <option value="day">Day</option>
                            </select>
                            <div className="invalid-feedback">{errorType ? errorType : ''}</div>
                        </Form.Group>
                        <Form.Group className="mb-1 d-none">
                            <label className="fw-bold">Date</label>
                            <input type="date" className={errorDate ? 'form-control is-invalid' : 'form-control'} name="date" value={objective.date} onChange={handleChange} />
                            <div className="invalid-feedback">{errorDate ? errorDate : ''}</div>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    {action === 'update' ?
                        <Button variant="danger" onClick={removeObjective}>{locale.DELETE}</Button>
                    : ''}
                    <Button variant="light" onClick={handleClose}>
                        {locale.CANCEL}
                    </Button>
                    <Button variant="primary" onClick={saveObjective}>
                        {locale.SAVE}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}