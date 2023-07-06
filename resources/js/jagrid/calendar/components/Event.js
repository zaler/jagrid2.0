import { useContext, useState } from 'react';

import SimpleReactLightbox, { SRLWrapper } from 'simple-react-lightbox';
import Swal from 'sweetalert2';
import axios from 'axios';
import moment from 'moment';

import { locale, actions, account_url } from '../utils/utils';
import RichText from './RichText';
import File from './events/File';
import EventType from './events/EventType';
import EventFileList from './events/EventFileList';
import EventTagList from './events/EventTagList';
import EventTagFormatList from './events/EventTagFormatList';
import EventStatus from './events/EventStatus';
import IndexEventList from './events/IndexEventList';
import Comment from './Comment';
import EventAccount from './events/EventAccount';
import EventRecurrent from './events/EventRecurrent';
import { useAppState } from '../contexts/appState';
import EventTitle from './events/EventTitle';
import Mockup from './mockups/Mockup';

export default function Event() {

    const [state, dispatch] = useAppState();

    const {
        currentEvent,
        errorsEvent,
        eventTypes,
        typeEventAction,
        eventStatuses
    } = state.calendar;

    const [isRecurringEvent, setIsRecurringEvent] = useState(currentEvent.is_recurrent ? currentEvent.is_recurrent : false);
    const [recurringEventRepeat, setRecurringEventRepeat] = useState();
    const [recurringEventEnd, setRecurringEventEnd] = useState();

    const handleChangeInput = (e) => {
        let target = e.target;
        let data = {
            name: target.name,
            value: target.value
        };

        if (target.type === 'checkbox' && target.name === 'allDay') {
            if (target.checked) {
                data.value = 1;
            } else {
                data.value = 0;
            }
        }

        handleChangeInputEvent(data);
    };

    const setDate = (d) => {
        if (d) {
            if (currentEvent.allDay == 1) {
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
        if (currentEvent.allDay == 1) {
            return 'date';
        }
        return 'datetime-local';
    };

    const onChangeDate = (e) => {

        let name = e.target.name;
        let value = e.target.value;

        if (name == 'start') {
            if (value > currentEvent.end) {
                handleChangeInputEvent({
                    name: 'start',
                    value: value
                });
                handleChangeInputEvent({
                    name: 'end',
                    value: value
                });
            } else {
                handleChangeInputEvent({
                    name: 'start',
                    value: value
                });
            }
        } else if (name == 'end') {
            if (value < currentEvent.start) {
                handleChangeInputEvent({
                    name: 'start',
                    value: value
                });
                handleChangeInputEvent({
                    name: 'end',
                    value: value
                });
            } else {
                handleChangeInputEvent({
                    name: 'end',
                    value: value
                });
            }
        }
    };

    const handleChangeRecurringEvent = (e) => {
        const target = e.target;
        setIsRecurringEvent(target.value)
    };

    const error = (key) => {
        return errorsEvent[key];
    };

    const removeEvent = () => {
        Swal.fire({
            title: locale.Do_you_want_to_delete_this_event,
            text: locale.You_wont_be_able_to_revert_this,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: locale.Delete
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`/events/${currentEvent.id}`)
                    .then(function (response) {
                        setTypeEventAction(actions.IS_DELETE_EVENT);
                        deleteEvent();
                    })
                    .catch(function (error) {

                    })
                    .then(function () {

                    });
            }
        })
    };

    const renderEventTypes = eventTypes.map((eventType) =>
        <EventType key={eventType.id} eventType={eventType} />
    );

    const renderEventStatuses = eventStatuses.map((eventStatus) =>
        <EventStatus key={eventStatus.id} eventStatus={eventStatus} />
    );

    const renderInputEventFiles = () => {
        return (
            <div>
                <SimpleReactLightbox>
                    <SRLWrapper>
                        <EventFileList type={"reference"} format={"files"} />
                    </SRLWrapper>
                </SimpleReactLightbox>
                <div className="form-group mb-2">
                    <label className="fw-bolder">{locale.REFERENCE_FILES}</label>
                    <File type="reference" />
                </div>
                <div className="form-group mb-2">
                    <label className="fw-bolder">{locale.REFERENCE_LINKS}</label>
                    <div className="d-block">
                        <EventFileList type={"reference"} format={"link"} />
                    </div>
                    <File type="reference" format="link" />
                </div>
                <SimpleReactLightbox>
                    <SRLWrapper>
                        <EventFileList type={"final"} format={"files"} />
                    </SRLWrapper>
                </SimpleReactLightbox>
                <div className="form-group mb-2">
                    <label className="fw-bolder">{locale.FINAL_FILES}</label>
                    <File type="final" />
                </div>
                <div className="form-group mb-2">
                    <label className="fw-bolder">{locale.FINAL_LINKS}</label>
                    <div className="d-block">
                        <EventFileList type={"final"} format={"link"} />
                    </div>
                    <File type="final" format="link" />
                </div>
            </div>
        )
    };

    const renderRRSS = (
        <div>
            <div className="form-group mb-2">
                <label className="fw-bolder">{locale.POST_COPY}</label>
                <RichText name="copy" />
            </div>
            <div className="form-group mb-2">
                <label className="fw-bolder">{locale.IMAGE_COPY}</label>
                <RichText name="copy_image" />
            </div>
            <div className="form-group mb-2">
                <label className="fw-bolder">{locale.DESIGN_INSTRUCTIONS}</label>
                <RichText name="instructions" />
            </div>
            {renderInputEventFiles()}
        </div>
    );

    const renderToDo = (
        <div>
            {renderInputEventFiles()}
        </div>
    );

    const renderPauta = (
        <div>
            <div className="form-group mb-2">
                <label className="fw-bolder">{locale.OBJETIVE_ADS}</label>
                <RichText name="objective" />
            </div>
            <div className="form-group mb-2">
                <label className="fw-bolder">{locale.ADS_COPY}</label>
                <RichText name="copy" />
            </div>
            <div className="form-group mb-2">
                <label className="fw-bolder">{locale.IMAGE_COPY}</label>
                <RichText name="copy_image" />
            </div>
            {renderInputEventFiles()}
        </div>
    );

    const renderMockup = () => {
        let copy = currentEvent.copy ? true : false;
        let rrss = currentEvent.event_type_id == 1 ? true : false;
        let finalFiles = false;
        if (currentEvent && currentEvent.files) {
            currentEvent.files.map((file) => {
                if (file.type === 'final' && file.format != 'link') {
                    finalFiles = true;
                }
            });
        }
        if (copy && rrss && finalFiles) {
            return <Mockup />;
        }
        return <></>;
    };

    const addEvent = () => {
        const target = {};
        const returnedTarget = Object.assign(target, currentEvent);
        returnedTarget.isRecurringEvent = isRecurringEvent;
        returnedTarget.recurringEventStart = currentEvent.start;
        returnedTarget.recurringEventEnd = recurringEventEnd;
        returnedTarget.recurringEventRepeat = recurringEventRepeat;
        axios.post('/events', returnedTarget)
            .then(function (response) {
                let event = response.data;
                callbackAfterAddEvent(event);
                setEventUrl(event.url);
                setErrorsEvent([]);
            })
            .catch(function (error) {
                setErrorsEvent(error.response.data.errors);
            })
            .then(function () {

            });
    };

    const updateEvent = () => {
        const target = {};
        const returnedTarget = Object.assign(target, currentEvent);
        returnedTarget.isRecurringEvent = isRecurringEvent;
        returnedTarget.recurringEventStart = currentEvent.start;
        returnedTarget.recurringEventEnd = recurringEventEnd;
        returnedTarget.recurringEventRepeat = recurringEventRepeat;
        axios.put('/events/' + returnedTarget.id, returnedTarget)
            .then(function (response) {
                //getEvents();
                callbackAfterUpdateEvent();
                setRecurrentEvent(true);
                setErrorsEvent([]);
            })
            .catch(function (error) {
                setErrorsEvent(error.response.data.errors);
            })
            .then(function () {

            });
    };

    const setEventUrl = (event_url) => {
        history.pushState({}, null, `/calendar/${account_url}/${event_url}`);
    };

    const renderRecurrentEventOptions = () => {
        return (
            <>
                <div className="form-group mb-2">
                    <label className="fw-bolder">{locale.REPEAT_EVERY}</label>
                    <select className={(error('recurringEventRepeat')) ? 'form-control is-invalid' : 'form-control'} onChange={(e) => { setRecurringEventRepeat(e.target.value) }}>
                        <option value="0">-- {locale.HOW_OFTEN_IT_REPEATS} --</option>
                        <option value="1">{locale.EVERY_DAY}</option>
                        <option value="2">{locale.every_2_days}</option>
                        <option value="3">{locale.every_3_days}</option>
                        <option value="4">{locale.every_4_days}</option>
                        <option value="5">{locale.every_5_days}</option>
                        <option value="6">{locale.every_6_days}</option>
                        <option value="7">{locale.per_week_time_1}</option>
                        <option value="15">{locale.per_week_time_2}</option>
                        <option value="31">{locale.every_month_1}</option>
                        <option value="61">{locale.every_month_2}</option>
                    </select>
                    <div className="invalid-feedback">{(error('recurringEventRepeat')) ? error('recurringEventRepeat') : ''}</div>
                </div>
                <div className="form-group mb-2">
                    <label className="fw-bolder">{locale.END_DATE}</label>
                    <input className={(error('recurringEventEnd')) ? 'form-control is-invalid' : 'form-control'} type="date" min={moment(currentEvent.start).format("YYYY-MM-DD")} onChange={(e) => { setRecurringEventEnd(e.target.value) }} />
                    <div className="invalid-feedback">{(error('recurringEventEnd')) ? error('recurringEventEnd') : ''}</div>
                </div>
            </>
        )
    }

    //Dispatch
    function handleChangeInputEvent(data) {
        dispatch({
            type: actions.HANDLE_CHANGE_INPUT_EVENT,
            payload: data
        });
    }

    function setTypeEventAction(data) {
        dispatch({
            type: actions.SET_TYPE_EVENT_ACTION,
            payload: data
        });
    }

    function deleteEvent(data) {
        dispatch({
            type: actions.DELETE_EVENT,
            payload: data
        })
    }

    function callbackAfterAddEvent(data) {
        dispatch({
            type: actions.CALLBACK_AFTER_ADD_EVENT,
            payload: data
        });
    }

    function callbackAfterUpdateEvent(data) {
        dispatch({
            type: actions.CALLBACK_AFTER_UPDATE_EVENT,
            payload: data
        });
    }

    function setRecurrentEvent(data) {
        dispatch({
            type: actions.SET_RECURRENT_EVENT,
            payload: data
        })
    }

    function setErrorsEvent(data) {
        dispatch({
            type: actions.SET_ERRORS_EVENT,
            payload: data
        });
    }

    return (
        <form>
            {typeEventAction === actions.IS_NEW_EVENT ?
                <div>
                    <div className="form-group mb-2">
                        <label className="fw-bolder">{locale.TITLE}</label>
                        <EventTitle />
                        <div className={(error('title')) ? 'form-control is-invalid d-none' : 'form-control d-none'}></div>
                        <div className="invalid-feedback">{(error('title')) ? error('title') : ''}</div>
                    </div>
                    <div className="form-group mb-2">
                        <label className="fw-bolder">{locale.EVENT_TYPE}</label>
                        <div className="btn-group d-block">
                            {renderEventTypes}
                            <div className={(error('event_type_id')) ? 'is-invalid' : ''} />
                            <div className="invalid-feedback">{(error('event_type_id')) ? error('event_type_id') : ''}</div>
                        </div>
                    </div>
                    <div className="form-group mb-2">
                        <label className="fw-bolder">{locale.RECURRING_EVENT}</label>
                        <br />
                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="radio" id="recurrentEvent1" checked={isRecurringEvent == 1} value="1" onChange={handleChangeRecurringEvent} />
                            <label className="form-check-label" htmlFor="recurrentEvent1">{locale.YES}</label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="radio" id="recurrentEvent0" checked={isRecurringEvent == 0} value="0" onChange={handleChangeRecurringEvent} />
                            <label className="form-check-label" htmlFor="recurrentEvent0">No</label>
                        </div>
                    </div>
                    {isRecurringEvent == 1 ? renderRecurrentEventOptions() : ''}
                    <div className="form-group mb-2">
                        <button type="button" className="btn btn-primary" onClick={addEvent}>
                            {locale.SAVE}
                        </button>
                    </div>
                </div>
                : ''}
            {typeEventAction === actions.IS_EXISTING_EVENT ?
                <div className="row">
                    <div className="col-lg-7">
                        <EventAccount />
                        <div className="form-group mb-2">
                            <label className="fw-bolder">{locale.TITLE}</label>
                            <EventTitle />
                            <div className={(error('title')) ? 'form-control is-invalid d-none' : 'form-control d-none'}></div>
                            <div className="invalid-feedback">{(error('title')) ? error('title') : ''}</div>
                        </div>
                        <div className="form-group mb-2">
                            <label className="fw-bolder">{locale.DESCRIPTION}</label>
                            <RichText name="description" />
                        </div>
                        {currentEvent.is_recurrent == 1 ? //Current Event is Recurrent
                            <>
                                <div className="form-group mb-2">
                                    <span className="badge bg-info">{locale.RECURRING_EVENT}</span>
                                </div>
                                <div className="form-group mb-2">
                                    <EventRecurrent /> {/* Only for update recurrent events */}
                                </div>
                            </>
                            : //Current Event is Not Recurrent. Then, show options
                            <>
                                <div className="form-group mb-2">
                                    <label className="fw-bolder">{locale.START}</label>
                                    <input type={setTypeDate()} className="form-control" name="start" value={setDate(currentEvent.start)} onChange={(e) => { onChangeDate(e) }} />
                                </div>
                                <div className="form-group mb-2">
                                    <label className="fw-bolder">{locale.END}</label>
                                    <input type={setTypeDate()} className="form-control" name="end" value={setDate(currentEvent.end)} onChange={(e) => { onChangeDate(e) }} min={currentEvent.start} />
                                </div>
                                <div className="form-group mb-2">
                                    <label className="fw-bolder">{locale.ALL_DAY}</label>
                                    <div className="form-check">
                                        <input className="form-check-input" name="allDay" type="checkbox" id="allDay" value="1" onChange={(e) => { handleChangeInput(e) }} checked={currentEvent.allDay == 1} />
                                        <label className="form-check-label" htmlFor="allDay">Yes</label>
                                    </div>
                                </div>
                                <div className="form-group mb-2">
                                    <label className="fw-bolder">{locale.RECURRING_EVENT}</label>
                                    <br />
                                    <div className="form-check form-check-inline">
                                        <input className="form-check-input" type="radio" id="recurrentEvent1" checked={isRecurringEvent == 1} value="1" onChange={handleChangeRecurringEvent} />
                                        <label className="form-check-label" htmlFor="recurrentEvent1">{locale.YES}</label>
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <input className="form-check-input" type="radio" id="recurrentEvent0" checked={isRecurringEvent == 0} value="0" onChange={handleChangeRecurringEvent} />
                                        <label className="form-check-label" htmlFor="recurrentEvent0">No</label>
                                    </div>
                                </div>
                                {isRecurringEvent == 1 ? // Recurring option is checked. The current event will be recurrent
                                    <>
                                        {renderRecurrentEventOptions()}
                                        <div className="form-group mb-2">
                                            <button type="button" className="btn btn-primary" onClick={updateEvent}>
                                                {locale.MAKE_THIS_EVENT_RECURRING}
                                            </button>
                                        </div>
                                    </>
                                    : ''}
                            </>
                        }
                        <div className="form-group mb-2">
                            <label className="fw-bolder">{locale.EVENT_TYPE}</label>
                            <div className="btn-group d-block">
                                {renderEventTypes}
                                <div className={(error('event_type_id')) ? 'is-invalid' : ''} />
                                <div className="invalid-feedback">{(error('event_type_id')) ? error('event_type_id') : ''}</div>
                            </div>
                        </div>
                        <div className="form-group mb-2">
                            <label className="fw-bolder">{locale.TAGS}</label>
                            <div className="btn-group d-block">
                                <EventTagList />
                            </div>
                        </div>
                        <div className="form-group mb-2">
                            <label className="fw-bolder">{locale.FORMAT}</label>
                            <div className="btn-group d-block">
                                <EventTagFormatList />
                            </div>
                        </div>
                        <div className="form-group mb-2">
                            <label className="fw-bolder">{locale.INDEX}</label>
                            <div className="btn-group d-block">
                                <IndexEventList />
                            </div>
                        </div>
                        <div className="form-group mb-2">
                            <label className="fw-bolder">{locale.STATUS}</label>
                            <div className="btn-group d-block">
                                {renderEventStatuses}
                                <div className={(error('event_status_id')) ? 'is-invalid' : ''} />
                                <div className="invalid-feedback">{(error('event_status_id')) ? error('event_status_id') : ''}</div>
                            </div>
                        </div>
                        {currentEvent.event_type_id == 1 ? renderRRSS : ''}
                        {currentEvent.event_type_id == 2 ? renderToDo : ''}
                        {currentEvent.event_type_id == 3 ? renderPauta : ''}
                        <div className="form-group mb-2 d-flex justify-content-between align-items-center">
                            <button type="button" className="btn btn-danger btn-sm" onClick={removeEvent}>{locale.DELETE_EVENT}</button>
                            {renderMockup()}
                        </div>
                    </div>
                    <div className="col-lg-5">
                        <div className="form-group mb-2">
                            <Comment name="comment" />
                        </div>
                    </div>
                </div>
                : ''}
        </form>
    )
}