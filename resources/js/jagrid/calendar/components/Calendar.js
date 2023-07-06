import React, { useState, useRef, useEffect, useContext, useMemo, useCallback } from 'react';

import { EditorState, convertToRaw, convertFromRaw, Modifier, SelectionState } from 'draft-js';
import Editor, { createEditorStateWithText } from '@draft-js-plugins/editor';
import createEmojiPlugin from '@draft-js-plugins/emoji';
import createHashtagPlugin from '@draft-js-plugins/hashtag';
import '@draft-js-plugins/emoji/lib/plugin.css';
import '@draft-js-plugins/hashtag/lib/plugin.css';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
import { Modal, Tabs, Tab } from 'react-bootstrap';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import axios from 'axios';
import Select from 'react-select';
import moment from 'moment';

import {
  locale,
  account_id,
  account_url,
  account_name,
  isSingleEvent,
  event_id,
  formatAMPM,
  actions,
  base_url
} from '../utils/utils';
import Event from './Event';
import ExternalEvent from './ExternalEvent';
import IndexEvent from './IndexEvent';
import MassActions from './mass_actions/MassActions';
import EventHistoryStatus from './events/EventHistoryStatus';
import Objective from './Objective';
import { useAppState } from '../contexts/appState';
import TrackingProject from './tracking/projects/TrackingProject';

export default function Calendar() {

  const MySwal = withReactContent(Swal);

  const [showModalEvent, setShowModalEvent] = useState(false);
  const [keyTab, setKeyTab] = useState('event');
  const [componentMounted, setComponentMounted] = useState(false);
  const [calendarScroll, setCalendarScroll] = useState(0);

  const [state, dispatch] = useAppState();

  const {
    events,
    currentEvent,
    saveOnTyping,
    typeEventAction,
    indexEvents,
    eventTypes,
    eventStatuses,
    filterEventTypes,
    filterEventStatuses,
    filterStartDate,
    filterEndDate,
    filterIndexes,
    filterExternalEvent,
    filterCalendars,
    accountsUser,
    tagsFormat,
    filterTagsFormat
  } = state.calendar;

  const inputFilterEndDate = useRef(null);
  const calendarRef = useRef(null);

  const customStylesFilterCalendars = {
    menuList: (provided, state) => ({
      ...provided,
      zIndex: 99999
    }),
    menu: (provided, state) => ({
      ...provided,
      zIndex: 99999
    }),
  };

  useEffect(() => {
    if (isSingleEvent) {
      getSingleEvent();
    }

    let draggableElExternal = document.getElementById("externalEvents");
    new Draggable(draggableElExternal, {
      itemSelector: ".fc-event",
      eventData: function (eventEl) {
        let title = eventEl.getAttribute("title");
        let id = eventEl.getAttribute("data");
        return {
          title: title,
          id: id,
          isExternalEvent: true
        };
      }
    });

    let draggableElIndex = document.getElementById("indexEvents");
    new Draggable(draggableElIndex, {
      itemSelector: ".fc-event",
      eventData: function (eventEl) {
        let title = eventEl.getAttribute("title");
        let id = eventEl.getAttribute("data");
        return {
          title: title,
          id: id,
          isIndex: true
        };
      }
    });

    getIndexEvents();
    getEventTypes();
    getEventStatuses();
    getAccountsUser();
    getTagsFormat();
    getObjectives();
    getExternalEvents();

    document.getElementById('calendar').addEventListener('contextmenu', function (e) {
      e.preventDefault();
    });

  }, []);

  useEffect(() => {
    if (saveOnTyping) {
      const timerId = setTimeout(() => {
        switch (typeEventAction) {
          /*case actions.IS_NEW_EVENT:
            addEvent();
            break;*/
          case actions.IS_EXISTING_EVENT:
            updateEvent();
            break;
          default:
            break;
        }
      }, 1000);

      return () => {
        clearTimeout(timerId);
      };
    } else {
      switch (typeEventAction) {
        case actions.IS_DELETE_EVENT:
          closeModalEvent();
          break;
        default:
          break;
      }
    }
  }, [currentEvent]);

  /*Component mounted*/

  const getEventTypes = () => {
    axios.get(`/event-types`)
      .then(function (response) {
        setEventTypes(response.data);
      })
      .catch(function (error) {

      })
      .then(function () {

      });
  };

  const getEventStatuses = () => {
    axios.get(`/event-statuses`)
      .then(function (response) {
        setEventStatuses(response.data);
      })
      .catch(function (error) {

      })
      .then(function () {

      });
  };

  const getAccountsUser = () => {
    axios.get(`/accounts-user?except_this_account=${account_id}`)
      .then(function (response) {
        setAccountsUser(response.data);
      })
      .catch(function (error) {

      })
      .then(function () {

      });
  };

  const getTagsFormat = () => {
    axios.get('/tag-format/events')
      .then(function (response) {
        setTagsFormat(response.data);
      })
      .catch(function (error) {

      })
      .then(function () {

      });
  };

  const getObjectives = () => {

    let filter = getObjectiveFilter();

    axios.get('/objectives', {
      params: {
        account_id,
        type: filter.type ? filter.type : '',
        date: filter.date ? filter.date : '',
        numberOfWeek: filter.numberOfWeek ? filter.numberOfWeek : ''
      }
    })
      .then(function (response) {
        setObjectives(response.data);
      })
      .catch(function (error) {

      })
      .then(function () {

      });
  };

  const getExternalEvents = () => {

    let filter = getObjectiveFilter();

    axios.get('/external/events', {
      params: {
        account_id,
        type: filter.type ? filter.type : '',
        date: filter.date ? filter.date : '',
        numberOfWeek: filter.numberOfWeek ? filter.numberOfWeek : ''
      }
    })
      .then(function (response) {
        setExternalEvents(response.data);
      })
      .catch(function (error) {

      })
      .then(function () {

      });
  };

  const getIndexEvents = () => {

    let filter = getObjectiveFilter();

    axios.get('/index/events', {
      params: {
        account_id,
        type: filter.type ? filter.type : '',
        date: filter.date ? filter.date : '',
        numberOfWeek: filter.numberOfWeek ? filter.numberOfWeek : ''
      }
    })
      .then(function (response) {
        setIndexEvents(response.data);
      })
      .catch(function (error) {

      })
      .then(function () {

      });
  };

  //Objectives Methods
  const getObjectiveFilter = () => {
    let type = '';
    let date = '';
    let numberOfWeek = '';

    if (!calendarRef.current) {
      return {};
    }

    switch (calendarRef.current.getApi().view.type) {
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
      } else {
        date = moment(calendarRef.current.getApi().view.currentStart).format("YYYY-MM-DD");
      }
    } else {
      let m = moment(calendarRef.current.getApi().view.currentStart);

      date = m.format("YYYY-MM-DD");

      if (type == 'week') {
        numberOfWeek = m.isoWeek();
      }
    }

    return { type, date, numberOfWeek };
  };

  //Fullcalendar Methods

  const weekendsVisible = () => {
    return true;
  };

  const handleDates = (e) => {
    if (componentMounted) {
      localStorage.setItem('defaultViewType', e.view.type);
      if (filterStartDate == '') {
        getEvents();
      }
      getObjectives();
      getExternalEvents();
      getIndexEvents();
      setCurrentStartDate(e.view.currentStart);
      setCurrentEndDate(e.view.currentEnd);
    } else {
      setComponentMounted(true);
    }
  };

  const handleDateSelect = (e) => {
    setNewEvent(e);
  };

  const renderEventContent = (e) => {
    let event = e.event;
    let borderEventColor = '#FB9F44';
    let time = event.allDay ? '' : formatAMPM(event.start);
    let labelTitle;

    try {
      labelTitle = JSON.parse(event.title).blocks[0].text;
    } catch (error) {
      labelTitle = event.title;
    }

    try {
      borderEventColor = event.extendedProps.status.color;
    } catch (error) {

    }

    let styles = { borderTop: "6px solid " + borderEventColor, paddingTop: "6px" };

    let viewType = e.view.type;

    if (viewType === 'timeGridDay' || viewType === 'timeGridWeek') {
      styles = { borderTop: "2px solid " + borderEventColor };
    }

    return (
      <>
        <div className="fc-event-main" style={styles} title={labelTitle}>
          <div className="fc-event-main-frame">
            <div className="fc-event-title-container">
              <div className="fc-event-title fc-sticky">
                {renderMultipleIndicator(event)}
                {renderAccountImage(event)}
                {renderEventTags(event)}
                {renderEventFormat(event)}
                {renderEventIndexes(event)}&nbsp;
                <CalendarEventTitle eventTitle={event.title} />
                {time}
                {renderImgPreview(event)}
              </div>
            </div>
          </div>
        </div>
      </>
    )
  };

  const handleEventClick = (e) => {
    setExistingEvent(e);
  };

  const handleEventAdd = () => {
    //console.log('handleEventAdd');
  };

  const handleEventRemove = () => {
    //console.log('handleEventRemove');
  };

  const handleEventResize = (e) => {
    confirmUpdateDates(e);
  };

  const handleEventDrop = (e) => {
    confirmUpdateDates(e);
  };

  const confirmUpdateDates = (e) => {

    if (e.event.extendedProps.is_recurrent == 1) {
      MySwal.fire({
        title: '<strong>Actions</strong>',
        icon: 'info',
        html: <>
          <button className="btn btn-danger" onClick={() => { updateDates(e, true); }}>All recurrent events</button>&nbsp;
          <button className="btn btn-secondary" onClick={() => { updateDates(e); }}>Current recurrent event</button>
        </>,
        showCloseButton: true,
        showCancelButton: true,
        showConfirmButton: false,
        focusConfirm: false
      });
    } else {
      updateDates(e);
    }
  }

  const updateDates = (e, allEvents = false) => {
    let data = {
      id: e.event.id,
      allDay: e.event.allDay,
      delta: e.delta ? e.delta : null,
      startDelta: e.startDelta ? e.startDelta : null,
      endDelta: e.endDelta ? e.endDelta : null,
      allEvents
    };
    axios.put('/events-dates', data)
      .then(function (response) {
        //getEvents();
        MySwal.close();
      })
      .catch(function (error) {
        //getEvents();
        MySwal.close();
      })
      .then(function () {

      });
  }

  const handleEventReceive = (e) => {

    let event = e.event;

    let event_type_id = 1;
    let event_end;

    if (event.extendedProps.isIndex) {
      event_type_id = 2;
    }

    if (!event.endStr) {
      event_end = event.start.setHours(event.start.getHours() + 1);
      event_end = moment(event_end).format();
    } else {
      event_end = event.endStr;
    }

    let data = {
      title: event.title,
      start: event.startStr,
      end: event_end,
      allDay: event.allDay,
      accounts: [{
        id: account_id,
        name: account_name,
        url: account_url
      }],
      event_type_id: event_type_id,
      event_status_id: 1,
      isIndex: event.extendedProps.isIndex ? event.extendedProps.isIndex : false,
      isExternalEvent: event.extendedProps.isExternalEvent ? event.extendedProps.isExternalEvent : false,
    };

    if (data.isIndex) {
      data.indexes = [event.id];
    }

    if (data.isExternalEvent) {
      data.external_event_id = event.id;
    }

    e.event.remove();

    axios.post('/events', data)
      .then(function (response) {
        getEvents();
      })
      .catch(function (error) {

      })
      .then(function () {

      });
  };

  const handleEventDataTransform = (e) => {

  };

  const handleEventClassNames = (e) => {
    if (e.event.extendedProps.event_type_id) {
      let event_type_id = e.event.extendedProps.event_type_id;
      return [`event-type-${event_type_id}`];
    }
    return ['event-type-1']
  };

  const handleEventDidMount = (eventCalendar) => {
    let eventHtmlElement = eventCalendar.el;

    eventHtmlElement.addEventListener('contextmenu', function (eventContextmenu) {
      eventContextmenu.preventDefault();
      eventHtmlElement.blur();
      MySwal.fire({
        title: '<strong>Actions</strong>',
        icon: 'info',
        html: <>
          <button className="btn btn-primary" onClick={() => { duplicateEvent(eventCalendar); MySwal.close(); }}>Duplicate event</button>&nbsp;
          <button className="btn btn-secondary" onClick={() => { selectEvent(eventContextmenu, eventCalendar); MySwal.close(); }}>
            {isSelectedEvent(eventContextmenu) ? 'Deselect event' : 'Select event'}
          </button>
        </>,
        showCloseButton: true,
        showCancelButton: true,
        showConfirmButton: false,
        focusConfirm: false
      });
    });
  };

  const getInitialView = () => {
    return localStorage.getItem('defaultViewType') ? localStorage.getItem('defaultViewType') : 'dayGridMonth';
  };

  //contextmenu
  const selectEvent = (htmlElement, eventObject) => {
    if (htmlElement.target.dataset.selected === undefined) {
      htmlElement.target.id = eventObject.event.id;
      htmlElement.target.dataset.selected = true;
      htmlElement.target.style.border = '2px solid #333';
    } else {
      if (htmlElement.target.dataset.selected == 'true') {
        htmlElement.target.dataset.selected = false;
        htmlElement.target.style.border = '';
      } else {
        htmlElement.target.dataset.selected = true;
        htmlElement.target.style.border = '2px solid #333';
      }
    }
  };

  const duplicateEvent = (e) => {

    let title = e.event.title;

    try {
      const editorState = EditorState
        .createWithContent(
          convertFromRaw(
            JSON.parse(
              title
            )
          )
        );

      // get current editor state 
      const currentContent = editorState.getCurrentContent();

      // create new selection state where focus is at the end
      const blockMap = currentContent.getBlockMap();
      const key = blockMap.last().getKey();
      const length = blockMap.last().getLength();
      const selection = new SelectionState({
        anchorKey: key,
        anchorOffset: length,
        focusKey: key,
        focusOffset: length,
      });

      //insert text at the selection created above 
      const textWithInsert = Modifier.insertText(currentContent, selection, ' (Duplicado)', null);
      const editorWithInsert = EditorState.push(editorState, textWithInsert, 'insert-characters');

      //also focuses cursor at the end of the editor 
      const newEditorState = EditorState.moveSelectionToEnd(editorWithInsert, textWithInsert.getSelectionAfter());

      title = JSON.stringify(convertToRaw(newEditorState.getCurrentContent()));
    } catch (error) {
      title = JSON.stringify(convertToRaw(createEditorStateWithText('(Duplicado) ' + title).getCurrentContent()));
    }

    axios.post('/duplicate-event', {
      id: e.event.id,
      title
    })
      .then(function (response) {
        /*let api = calendarRef.current.getApi();
        api.addEvent(response.data);*/
        getEvents();
      })
      .catch(function (error) {

      })
      .then(function () {

      });
  };

  const isSelectedEvent = (htmlElement) => {
    if (htmlElement.target.dataset.selected) {
      if (htmlElement.target.dataset.selected == 'true') {
        return true;
      }
    }
    return false;
  };

  //Events Methods
  const getEvents = () => {
    let params = '';

    if (filterCalendars.length > 0) {
      params += '?calendars=' + account_id + ',' + filterCalendars.join(',');
    } else {
      params += '?calendars=' + account_id;
    }

    if (filterEventTypes.length > 0) {
      params += '&eventTypeId=' + filterEventTypes.join(',');
    }
    if (filterEventStatuses.length > 0) {
      params += '&eventStatusId=' + filterEventStatuses.join(',');
    }
    if (filterStartDate != '') {
      params += '&startDate=' + filterStartDate;
      inputFilterEndDate.current.removeAttribute('disabled');
      inputFilterEndDate.current.setAttribute('min', filterStartDate);
    } else {
      inputFilterEndDate.current.setAttribute('disabled', true);
      inputFilterEndDate.current.value = '';
    }
    if (filterEndDate != '') {
      params += '&endDate=' + filterEndDate;
    }
    if (filterIndexes.length > 0) {
      params += '&indexes=' + filterIndexes.join(',');
    }
    if (filterExternalEvent.length > 0) {
      params += '&externalEventId=' + filterExternalEvent.join(',');
    }
    if (filterTagsFormat.length > 0) {
      params += '&tagsFormat=' + filterTagsFormat.join(',');
    }

    if (filterStartDate == '' && filterEndDate == '') {
      if (calendarRef.current) { //if component is loaded
        params += '&currentViewCalendarStartDate=' + calendarRef.current.getApi().view.activeStart.toISOString().substring(0, 10);
        params += '&currentViewCalendarEndDate=' + calendarRef.current.getApi().view.activeEnd.toISOString().substring(0, 10);
      }
    }

    axios.get('/events' + params)
      .then(function (response) {
        setEvents(response.data);
      })
      .catch(function (error) {

      })
      .then(function () {

      });
  }

  const renderEvent = () => {
    if (typeEventAction == actions.IS_EXISTING_EVENT) {
      let api = calendarRef.current.getApi();

      let event = api.getEventById(currentEvent.id);
      if (event) {
        event.remove();
      }

      axios.get(`/events/${currentEvent.id}`)
        .then(function (response) {
          api.addEvent(response.data); //pending: bug issue when filter calendar change on start/end, event duplicate
        })
        .catch(function (error) {

        })
        .then(function () {

        });
    }
  };

  const setNewEvent = (e) => {
    let data = {
      start: e.startStr,
      end: e.endStr,
      allDay: e.allDay,
      accounts: [{
        id: account_id,
        name: account_name,
        url: account_url
      }]
    };
    setTypeEventAction(actions.IS_NEW_EVENT);
    setCurrentEvent(data);
    openModalEvent();
  }

  const setExistingEvent = (e) => {
    e.jsEvent.preventDefault();
    let event = e.event;
    setTypeEventAction(actions.IS_EXISTING_EVENT);
    setCurrentEvent(event);
    openModalEvent();
    setEventUrl(event);
  }

  const updateEvent = () => {
    axios.put('/events/' + currentEvent.id, currentEvent)
      .then(function (response) {
        //getEvents();
        callbackAfterUpdateEvent();
        setErrorsEvent([]);
      })
      .catch(function (error) {
        setErrorsEvent(error.response.data.errors);
      })
      .then(function () {

      });
  };

  const getSingleEvent = () => {
    axios.get(`/events/${event_id}`)
      .then(function (response) {
        openModalEvent();
        setTypeEventAction(actions.IS_EXISTING_EVENT);
        setCurrentEvent(response.data);
      })
      .catch(function (error) {

      })
      .then(function () {

      });
  };

  //Modal
  const openModalEvent = () => {
    setCalendarScroll(document.querySelectorAll('.fc-scroller-liquid-absolute')[0].scrollTop);
    setShowModalEvent(true);
  };

  const closeModalEvent = () => {
    if (saveOnTyping && typeEventAction == actions.IS_EXISTING_EVENT) {

      Swal.fire({
        title: locale.SAVING,
        html: locale.SAVING_THE_EVENT,
        timer: 1000,
        timerProgressBar: true,
        didOpen: () => {
          Swal.showLoading()
        },
        willClose: () => {
          getEvents();
          //renderEvent();
          setShowModalEvent(false);
          setAccountUrl();
          resetData();
          setKeyTab('event');
        }
      }).then((result) => {

      })

    } else {
      getEvents();
      //renderEvent();
      setShowModalEvent(false);
      setAccountUrl();
      resetData();
      setKeyTab('event');
    }

  };

  const renderModalTitle = () => {

    let modalTitle = locale.NEW_EVENT;

    if (typeEventAction === actions.IS_EXISTING_EVENT) {
      modalTitle = locale.EDIT_EVENT;
    }

    let accountsNames = [];

    if (currentEvent.accounts) {
      currentEvent.accounts.map((cea) => {
        if (cea.id == account_id) {
          accountsNames.push(cea.name);
        }
        filterCalendars.map((fc) => {
          if (cea.id == fc) {
            accountsNames.push(cea.name);
          }
        });
      });
    }

    if (accountsNames.length > 1) {
      modalTitle += ' multiple ';
    }
    return modalTitle += ' - ' + accountsNames.join(', ');

  };

  //Url
  const setEventUrl = (_event) => {

    let _accountUrl = '';

    if (_event.extendedProps.accounts) {
      if (_event.extendedProps.accounts.length > 1) {
        let accountsUrls = [account_url];
        _event.extendedProps.accounts.forEach((cea) => {
          filterCalendars.forEach((fc) => {
            if (cea.id == fc) {
              accountsUrls.push(cea.url);
            }
          });
        });
        _accountUrl = accountsUrls[0];
      } else {
        _accountUrl = _event.extendedProps.accounts[0].url;
      }
    }

    history.pushState({}, null, `/calendar/${_accountUrl}/${_event.url}`);
  };

  const setAccountUrl = () => {
    history.pushState({}, null, `/calendar/${account_url}/`);
  };

  //Render Event
  const renderEventTags = (event) => {
    if (event.extendedProps.tags) {
      return (
        event.extendedProps.tags.map((tag, index) => <img key={index} width={18} height={18} src={tag.icon} />)
      )
    }
  };

  const renderEventFormat = (event) => {
    if (event.extendedProps.tags_format) {
      return (
        event.extendedProps.tags_format.map((tag_format, index) => {
          return (
            <img key={index} width={18} height={18} src={tag_format.icon} />
          )
        })
      )
    }
  };

  const renderEventIndexes = (event) => {
    if (event.extendedProps.indexes) {
      let indexes = event.extendedProps.indexes.split(',');
      return (
        indexes.map((id, index) => {
          let found = indexEvents.find(indexEvent => indexEvent.id == id);
          if (found) {
            return (
              <img key={index} src={`https://via.placeholder.com/18/${found.color.replace('#', '')}/${found.color.replace('#', '')}`} style={{ borderRadius: '50%' }} />
            )
          }
        })
      )
    }
  };

  const renderImgPreview = (event) => {
    let srcImage;
    if (event.extendedProps.files) {
      event.extendedProps.files.map((file) => {
        if (file.type == 'final' && file.format != 'link') {
          srcImage = `${base_url}/storage/${file.path}`;
        }
      });
    }
    if (srcImage) {
      return (
        <div style={{ height: "100px" }}>
          <img src={srcImage} className="img-fluid mt-1" style={{ maxHeight: "100px" }} />
        </div>
      )
    }
  };

  const renderAccountImage = (event) => {
    if (event.extendedProps.accounts && filterCalendars.length > 0) {
      return (
        <img src={`https://ui-avatars.com/api/?name=${event.extendedProps.accounts[0].name}&color=7F9CF5&background=EBF4FF`} className="rounded" width="26" />
      )
    }
  };

  const renderMultipleIndicator = (event) => {
    if (event.extendedProps.accounts && event.extendedProps.accounts.length > 1) {
      return (
        <i className="fas fa-tasks fa-lg" style={{ verticalAlign: '-4px' }}></i>
      )
    }
  };

  const CalendarEventTitle = ({ eventTitle }) => {

    const createEditorState = () => {
      let _editorState;

      try {
        _editorState = EditorState.createWithContent(convertFromRaw(JSON.parse(eventTitle)));
      } catch (error) {
        _editorState = createEditorStateWithText(eventTitle);
      }

      return _editorState;
    };

    const [editorState, setEditorState] = useState(createEditorState());

    const { EmojiSuggestions, EmojiSelect, plugins } = useMemo(() => {
      const emojiPlugin = createEmojiPlugin();
      const hashtagPlugin = createHashtagPlugin();

      const { EmojiSuggestions, EmojiSelect } = emojiPlugin;

      const plugins = [emojiPlugin, hashtagPlugin];
      return { EmojiSuggestions, EmojiSelect, plugins };
    }, []);

    const editor = useRef(null);

    const onChange = (newEditorState) => {
      setEditorState(newEditorState);
    };

    const focus = () => {
      editor.current.focus();
    };

    return (
      <div onClick={focus}>
        <Editor
          editorState={editorState}
          onChange={onChange}
          plugins={plugins}
          ref={editor}
          readOnly
        />
      </div>
    )
  }

  /*Calendar Filters*/

  useEffect(() => {

    getEvents();

  }, [
    filterEventTypes,
    filterEventStatuses,
    filterStartDate,
    filterEndDate,
    filterIndexes,
    filterExternalEvent,
    filterCalendars,
    filterTagsFormat
  ]);

  const renderFilterEventDates = () => {
    return (
      <>
        <div className="row">
          <div className="col-md-6 col-12">
            <div>
              <label className="form-label" htmlFor="filter-start-date">Start date</label>
              <input type="date" className="form-control" name="filter-start-date" id="filter-start-date" onChange={changeFilterEventDates} />
            </div>
          </div>
          <div className="col-md-6 col-12">
            <div>
              <label className="form-label" htmlFor="filter-end-date">End date</label>
              <input type="date" className="form-control" name="filter-end-date" id="filter-end-date" onChange={changeFilterEventDates} ref={inputFilterEndDate} disabled />
            </div>
          </div>
        </div>
      </>
    )
  };

  const renderFilterEventTypes = () => {
    return (
      eventTypes.map(eventType => {
        return (
          <div className="col-xl-2 col-lg-2 col-md-3 col-sm-4" key={eventType.id}>
            <div className="form-check form-check-primary">
              <input type="checkbox" className="form-check-input" id={`filter-eventType-${eventType.id}`} value={eventType.id} onChange={changeFilterEventType} />
              <label className="form-check-label" htmlFor={`filter-eventType-${eventType.id}`}>{eventType.name}</label>
            </div>
          </div>
        )
      })
    )
  };

  const renderFilterEventStatuses = () => {
    return (
      eventStatuses.map(eventStatus => {
        return (
          <div className="col-xl-2 col-lg-2 col-md-3 col-sm-4" key={eventStatus.id}>
            <div className="form-check form-check-primary">
              <div style={{ width: "100%", height: "6px", borderRaidus: "50%", backgroundColor: eventStatus.color }}></div>
              <input type="checkbox" className="form-check-input" id={`filter-eventStatus-${eventStatus.id}`} value={eventStatus.id} onChange={changeFilterEventStatus} />
              <label className="form-check-label" htmlFor={`filter-eventStatus-${eventStatus.id}`}>{eventStatus.name}</label>
            </div>
          </div>
        )
      })
    )
  };

  const renderFilterTagsFormat = () => {
    return (
      tagsFormat.map((tagFormat) => {
        return (
          <div className="col-xl-2 col-lg-2 col-md-3 col-sm-4" key={tagFormat.id}>
            <div className="form-check form-check-filter-tagformat">
              <input type="checkbox" className="form-check-input" id={`filter-tagformat-${tagFormat.id}`} value={tagFormat.id} onChange={changeFilterTagFormat} />
              <label className="form-check-label" htmlFor={`filter-tagformat-${tagFormat.id}`}><img src={tagFormat.icon} className="img-fluid" width="16" />{tagFormat.name}</label>
            </div>
          </div>
        )
      })
    )
  };

  const changeFilterEventType = (e) => {
    let val = Number(e.target.value);
    let isChecked = e.target.checked;
    if (isChecked) {
      addFilterEventTypes(val);
    } else {
      deleteFilterEventTypes(val);
    }
  };

  const changeFilterEventStatus = (e) => {
    let val = Number(e.target.value);
    let isChecked = e.target.checked;
    if (isChecked) {
      addFilterEventStatuses(val);
    } else {
      deleteFilterEventStatuses(val);
    }
  };

  const changeFilterEventDates = (e) => {
    let val = e.target.value;
    let name = e.target.name;

    if (name === 'filter-start-date') {
      setFilterStartDate(val);
    } else {
      setFilterEndDate(val);
    }
  };

  const changeFilterCalendars = (e, type) => {
    switch (type.action) {
      case 'select-option':
        addFilterCalendars(type.option.value);
        break;
      case 'remove-value':
        deleteFilterCalendars(type.removedValue.value);
        break;
      default:
        break;
    }
  };

  const changeFilterTagFormat = (e) => {
    let val = Number(e.target.value);
    let isChecked = e.target.checked;
    if (isChecked) {
      addFilterTagFormat(val);
    } else {
      deleteFilterTagFormat(val);
    }
  };

  //Dispatches
  function setEvents(data) {
    dispatch({
      type: actions.SET_EVENTS,
      payload: data
    });
  }

  function setCurrentEvent(data) {
    dispatch({
      type: actions.SET_CURRENT_EVENT,
      payload: data
    });
  }

  function setTypeEventAction(data) {
    dispatch({
      type: actions.SET_TYPE_EVENT_ACTION,
      payload: data
    });
  }

  function callbackAfterUpdateEvent(data) {
    dispatch({
      type: actions.CALLBACK_AFTER_UPDATE_EVENT,
      payload: data
    });
  }

  function setErrorsEvent(data) {
    dispatch({
      type: actions.SET_ERRORS_EVENT,
      payload: data
    });
  }

  function resetData() {
    dispatch({
      type: actions.RESET_DATA
    })
  }

  function setEventTypes(data) {
    dispatch({
      type: actions.SET_EVENT_TYPES,
      payload: data
    })
  }

  function setEventStatuses(data) {
    dispatch({
      type: actions.SET_EVENT_STATUSES,
      payload: data
    })
  }

  function setExternalEvents(data) {
    dispatch({
      type: actions.SET_EXTERNAL_EVENTS,
      payload: data
    })
  }

  function setIndexEvents(data) {
    dispatch({
      type: actions.SET_INDEX_EVENTS,
      payload: data
    })
  }

  function addFilterEventTypes(data) {
    dispatch({
      type: actions.ADD_FILTER_EVENT_TYPES,
      payload: data
    })
  }

  function addFilterEventStatuses(data) {
    dispatch({
      type: actions.ADD_FILTER_EVENT_STATUSES,
      payload: data
    })
  }

  function deleteFilterEventTypes(data) {
    dispatch({
      type: actions.DELETE_FILTER_EVENT_TYPES,
      payload: data
    })
  }

  function deleteFilterEventStatuses(data) {
    dispatch({
      type: actions.DELETE_FILTER_EVENT_STATUSES,
      payload: data
    })
  }

  function setFilterStartDate(data) {
    dispatch({
      type: actions.SET_FILTER_START_DATE,
      payload: data
    })
  }

  function setFilterEndDate(data) {
    dispatch({
      type: actions.SET_FILTER_END_DATE,
      payload: data
    })
  }

  function addFilterCalendars(data) {
    dispatch({
      type: actions.ADD_FILTER_CALENDARS,
      payload: data
    })
  }

  function deleteFilterCalendars(data) {
    dispatch({
      type: actions.DELETE_FILTER_CALENDARS,
      payload: data
    })
  }

  function setAccountsUser(data) {
    dispatch({
      type: actions.SET_ACCOUNTS_USER,
      payload: data
    })
  }

  function setTagsFormat(data) {
    dispatch({
      type: actions.SET_TAGS_FORMAT,
      payload: data
    })
  }

  function addFilterTagFormat(data) {
    dispatch({
      type: actions.ADD_FILTER_TAG_FORMAT,
      payload: data
    })
  }

  function deleteFilterTagFormat(data) {
    dispatch({
      type: actions.DELETE_FILTER_TAG_FORMAT,
      payload: data
    })
  }

  function setObjectives(data) {
    dispatch({
      type: actions.SET_OBJECTIVES,
      payload: data
    })
  }

  function setCurrentStartDate(data) {
    dispatch({
      type: actions.SET_CURRENT_START_DATE,
      payload: data
    })
  }

  function setCurrentEndDate(data) {
    dispatch({
      type: actions.SET_CURRENT_END_DATE,
      payload: data
    })
  }

  return (
    <div className="row">
      <div className="col-md-12">
        <div className="row">
          <div className="col-xl-6">
            <h4>{locale.FILTER_BY_DATES}</h4>
            {renderFilterEventDates()}
          </div>
        </div>
        <div className="row">
          <div className="col-12 mt-4">
            <h4>{locale.FILTER_BY_EVENT_TYPE}</h4>
          </div>
          {renderFilterEventTypes()}
          <div className="col-12 mt-4">
            <h4>{locale.FILTER_BY_FORMAT}</h4>
          </div>
          {renderFilterTagsFormat()}
          <div className="col-12 mt-4">
            <h4>{locale.FILTER_BY_STATUS}</h4>
          </div>
          {renderFilterEventStatuses()}
        </div>
        <div className="row">
          <div className="col-md-6 mt-4">
            <MassActions getEvents={getEvents} />
          </div>
          <div className="col-md-6 mt-4">
            <h4>{locale.SEE_OTHER_CALENDARS}</h4>
            <label>{locale.SELECT_MULTIPLE_CALENDARS}</label>
            <Select styles={customStylesFilterCalendars} options={accountsUser} isMulti onChange={changeFilterCalendars} />
          </div>
        </div>
      </div>
      <div className="col-md-2 mt-5">
        <div className="d-block">
          <h4>{locale.INDEX_EVENTS}</h4>
          <IndexEvent calendarRef={calendarRef} getIndexEvents={getIndexEvents} />
        </div>
        <div className="d-block mt-5">
          <h4>{locale.EXTERNAL_EVENTS}</h4>
          <ExternalEvent calendarRef={calendarRef} getExternalEvents={getExternalEvents} />
        </div>
        <div className="d-block mt-5">
          <h4>{locale.OBJECTIVES}</h4>
          <Objective calendarRef={calendarRef} getObjectives={getObjectives} />
        </div>
      </div>
      <div className="col-md-10 mt-5">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          initialView={getInitialView()}
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={false}
          weekends={weekendsVisible}
          datesSet={handleDates}
          select={handleDateSelect}
          events={events}
          eventContent={renderEventContent}
          eventClick={handleEventClick}
          eventAdd={handleEventAdd}
          eventRemove={handleEventRemove}
          eventResize={handleEventResize}
          eventDrop={handleEventDrop}
          eventReceive={handleEventReceive}
          eventDataTransform={handleEventDataTransform}
          eventClassNames={handleEventClassNames}
          eventDidMount={handleEventDidMount}
          locale={locale.CALENDAR}
          weekNumbers={true}
          ref={calendarRef}
        />
        <TrackingProject />
      </div>
      <div className="col-md-12">
        <Modal size={typeEventAction === actions.IS_EXISTING_EVENT ? "lg" : "md"}
          show={showModalEvent}
          onHide={closeModalEvent}
          onExited={() => {
            document.querySelectorAll('.fc-scroller-liquid-absolute')[0].scrollTop = calendarScroll
          }}
        >
          <Modal.Header closeButton>
            <Modal.Title>{renderModalTitle()}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Tabs
              id="controlled-tab-example"
              activeKey={keyTab}
              onSelect={(k) => setKeyTab(k)}
              className="mb-3"
            >
              <Tab eventKey="event" title="Event">
                <Event />
              </Tab>
              <Tab eventKey="history" title="Historial">
                <EventHistoryStatus />
              </Tab>
            </Tabs>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  )
}