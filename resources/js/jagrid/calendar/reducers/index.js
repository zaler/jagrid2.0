const initialState = {
  calendar: {
    events: [],
    currentEvent: {},
    currentStartDate: '',
    currentEndDate: '',
    saveOnTyping: false,
    typeEventAction: '',
    errorsEvent: [],
    eventTypes: [],
    eventStatuses: [],
    externalEvents: [],
    indexEvents: [],
    filterEventTypes: [],
    filterEventStatuses: [],
    filterStartDate: '',
    filterEndDate: '',
    filterIndexes: [],
    filterExternalEvent: [],
    filterCalendars: [],
    eventComments: [],
    accountsUser: [],
    tagsFormat: [],
    filterTagsFormat: []
  },
  objectives: []
}

const combineReducers = reducers => {
  return (state, action) => {
    return Object.keys(reducers).reduce(
      (acc, prop) => {
        return ({
          ...acc,
          ...reducers[prop]({ [prop]: acc[prop] }, action),
        })
      },
      state
    )
  }
}

export { initialState, combineReducers }
