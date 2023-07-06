import { createContext, useReducer } from 'react';

import AppReducer from './AppReducer';
import { actions } from '../utils/actions';

const initialState = {
  events: [],
  globalIndexes: [],
  statuses: [],
  eventTypes: [],
  filterEventTypes: [],
  filterEventStatuses: [],
  filterStartDate: '',
  filterEndDate: '',
};

export const GlobalContext = createContext(initialState);

export const GlobalProvider = ({ children }) => {

  const [state, dispatch] = useReducer(AppReducer, initialState);

  function setEvents(data){
    dispatch({
      type: actions.SET_EVENTS,
      payload: data
    });
  }

  function setGlobalIndexes(data){
    dispatch({
      type: actions.SET_GLOBAL_INDEXES,
      payload: data
    });
  }

  function setStatuses(data){
    dispatch({
      type: actions.SET_STATUSES,
      payload: data
    })
  }

  function setEventTypes(data){
    dispatch({
      type: actions.SET_EVENT_TYPES,
      payload: data
    })
  }

  function addFilterEventTypes(data){
    dispatch({
      type: actions.ADD_FILTER_EVENT_TYPES,
      payload: data
    })
  }

  function addFilterEventStatuses(data){
    dispatch({
      type: actions.ADD_FILTER_EVENT_STATUSES,
      payload: data
    })
  }

  function deleteFilterEventTypes(data){
    dispatch({
      type: actions.DELETE_FILTER_EVENT_TYPES,
      payload: data
    })
  }

  function deleteFilterEventStatuses(data){
    dispatch({
      type: actions.DELETE_FILTER_EVENT_STATUSES,
      payload: data
    })
  }

  function setFilterStartDate(data){
    dispatch({
      type: actions.SET_FILTER_START_DATE,
      payload: data
    })
  }

  function setFilterEndDate(data){
    dispatch({
      type: actions.SET_FILTER_END_DATE,
      payload: data
    })
  }

  return (
    <GlobalContext.Provider
      value={{
        events: state.events,
        setEvents,
        globalIndexes: state.globalIndexes,
        setGlobalIndexes,
        statuses: state.statuses,
        setStatuses,
        eventTypes: state.eventTypes,
        setEventTypes,
        filterEventTypes: state.filterEventTypes,
        filterEventStatuses: state.filterEventStatuses,
        addFilterEventTypes,
        addFilterEventStatuses,
        deleteFilterEventTypes,
        deleteFilterEventStatuses,
        filterStartDate: state.filterStartDate,
        filterEndDate: state.filterEndDate,
        setFilterStartDate,
        setFilterEndDate,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};