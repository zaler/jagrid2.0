import { actions, plainObjectEvent } from "../utils/utils"

const calendarReducer = (state, action = {}) => {
    switch (action.type) {
        case actions.SET_EVENTS:
            return {
                ...state,
                calendar: {
                    ...state.calendar,
                    events: action.payload
                }
            }
        case actions.SET_CURRENT_EVENT:
            return {
                ...state,
                calendar: {
                    ...state.calendar,
                    currentEvent: plainObjectEvent(action.payload)
                }
            }
        case actions.HANDLE_CHANGE_INPUT_EVENT:
            return {
                ...state,
                calendar: {
                    ...state.calendar,
                    currentEvent: {
                        ...state.calendar.currentEvent,
                        [action.payload.name]: action.payload.value
                    },
                    saveOnTyping: true
                }
            }
        case actions.SET_TYPE_EVENT_ACTION:
            return {
                ...state,
                calendar: {
                    ...state.calendar,
                    typeEventAction: action.payload
                }
            }
        case actions.CALLBACK_AFTER_ADD_EVENT:
            return {
                ...state,
                calendar: {
                    ...state.calendar,
                    currentEvent: plainObjectEvent(action.payload),
                    saveOnTyping: false,
                    typeEventAction: actions.IS_EXISTING_EVENT
                }
            }
        case actions.CALLBACK_AFTER_UPDATE_EVENT:
            return {
                ...state,
                calendar: {
                    ...state.calendar,
                    saveOnTyping: false,
                }
            }
        case actions.SET_ERRORS_EVENT:
            return {
                ...state,
                calendar: {
                    ...state.calendar,
                    errorsEvent: action.payload
                }
            }
        case actions.RESET_DATA:
            return {
                ...state,
                calendar: {
                    ...state.calendar,
                    currentEvent: plainObjectEvent(),
                    errorsEvent: [],
                    saveOnTyping: false,
                    typeEventAction: '',
                    eventComments: []
                }
            }
        case actions.SET_EVENT_TYPES:
            return {
                ...state,
                calendar: {
                    ...state.calendar,
                    eventTypes: action.payload
                }
            }
        case actions.ADD_EVENT_FILES:
            return {
                ...state,
                calendar: {
                    ...state.calendar,
                    currentEvent: {
                        ...state.calendar.currentEvent,
                        files: [...state.calendar.currentEvent.files, action.payload]
                    },
                }
            }
        case actions.DELETE_EVENT_FILE:
            return {
                ...state,
                calendar: {
                    ...state.calendar,
                    currentEvent: {
                        ...state.calendar.currentEvent,
                        files: [...state.calendar.currentEvent.files].filter(file => file.id != action.payload)
                    },
                }
            }
        case actions.DELETE_EVENT:
            return {
                ...state,
                calendar: {
                    ...state.calendar,
                    currentEvent: plainObjectEvent()
                }
            }
        case actions.ADD_EVENT_TAG:
            return {
                ...state,
                calendar: {
                    ...state.calendar,
                    currentEvent: {
                        ...state.calendar.currentEvent,
                        tags: [...state.calendar.currentEvent.tags, action.payload]
                    }
                }
            }
        case actions.DELETE_EVENT_TAG:
            return {
                ...state,
                calendar: {
                    ...state.calendar,
                    currentEvent: {
                        ...state.calendar.currentEvent,
                        tags: [...state.calendar.currentEvent.tags].filter(tag => tag.id != action.payload)
                    }
                }
            }
        case actions.ADD_EVENT_TAG_FORMAT:
            return {
                ...state,
                calendar: {
                    ...state.calendar,
                    currentEvent: {
                        ...state.calendar.currentEvent,
                        tags_format: [...state.calendar.currentEvent.tags_format, action.payload]
                    }
                }
            }
        case actions.DELETE_EVENT_TAG_FORMAT:
            return {
                ...state,
                calendar: {
                    ...state.calendar,
                    currentEvent: {
                        ...state.calendar.currentEvent,
                        tags_format: [...state.calendar.currentEvent.tags_format].filter(tagFormat => tagFormat.id != action.payload)
                    }
                }
            }
        case actions.SET_EVENT_STATUSES:
            return {
                ...state,
                calendar: {
                    ...state.calendar,
                    eventStatuses: action.payload
                }
            }
        case actions.SET_EXTERNAL_EVENTS:
            return {
                ...state,
                calendar: {
                    ...state.calendar,
                    externalEvents: action.payload
                }
            }
        case actions.ADD_EXTERNAL_EVENT:
            return {
                ...state,
                calendar: {
                    ...state.calendar,
                    externalEvents: [...state.calendar.externalEvents, action.payload]
                }
            }
        case actions.DELETE_EXTERNAL_EVENT:
            return {
                ...state,
                calendar: {
                    ...state.calendar,
                    externalEvents: [...state.calendar.externalEvents].filter(externalEvent => externalEvent.id != action.payload)
                }
            }
        case actions.SET_SAVE_ON_TYPING:
            return {
                ...state,
                calendar: {
                    ...state.calendar,
                    saveOnTyping: action.payload
                }
            }
        case actions.SET_INDEX_EVENTS:
            return {
                ...state,
                calendar: {
                    ...state.calendar,
                    indexEvents: action.payload
                }
            }
        case actions.ADD_INDEX_EVENT:
            return {
                ...state,
                calendar: {
                    ...state.calendar,
                    indexEvents: [...state.calendar.indexEvents, action.payload]
                }
            }
        case actions.DELETE_INDEX_EVENT:
            return {
                ...state,
                calendar: {
                    ...state.calendar,
                    indexEvents: [...state.calendar.indexEvents].filter(indexEVent => indexEVent.id != action.payload)
                }
            }
        case actions.ADD_INDEX_TO_EVENT:
            return {
                ...state,
                calendar: {
                    ...state.calendar,
                    saveOnTyping: true,
                    currentEvent: {
                        ...state.calendar.currentEvent,
                        indexes: [...state.calendar.currentEvent.indexes, action.payload]
                    }
                }
            }

        case actions.DELETE_INDEX_FROM_EVENT:
            return {
                ...state,
                calendar: {
                    ...state.calendar,
                    saveOnTyping: true,
                    currentEvent: {
                        ...state.calendar.currentEvent,
                        indexes: [...state.calendar.currentEvent.indexes].filter(id => id != action.payload)
                    }
                }
            }
        case actions.ADD_FILTER_EVENT_TYPES:
            return {
                ...state,
                calendar: {
                    ...state.calendar,
                    filterEventTypes: [...state.calendar.filterEventTypes, action.payload]
                }
            }
        case actions.ADD_FILTER_EVENT_STATUSES:
            return {
                ...state,
                calendar: {
                    ...state.calendar,
                    filterEventStatuses: [...state.calendar.filterEventStatuses, action.payload]
                }
            }

        case actions.DELETE_FILTER_EVENT_TYPES:
            return {
                ...state,
                calendar: {
                    ...state.calendar,
                    filterEventTypes: [...state.calendar.filterEventTypes].filter(id => id != action.payload)
                }
            }
        case actions.DELETE_FILTER_EVENT_STATUSES:
            return {
                ...state,
                calendar: {
                    ...state.calendar,
                    filterEventStatuses: [...state.calendar.filterEventStatuses].filter(id => id != action.payload)
                }
            }
        case actions.SET_FILTER_START_DATE:
            return {
                ...state,
                calendar: {
                    ...state.calendar,
                    filterStartDate: action.payload
                }
            }
        case actions.SET_FILTER_END_DATE:
            return {
                ...state,
                calendar: {
                    ...state.calendar,
                    filterEndDate: action.payload
                }
            }
        case actions.ADD_FILTER_INDEXES:
            return {
                ...state,
                calendar: {
                    ...state.calendar,
                    filterIndexes: [...state.calendar.filterIndexes, action.payload]
                }
            }
        case actions.DELETE_FILTER_INDEXES:
            return {
                ...state,
                calendar: {
                    ...state.calendar,
                    filterIndexes: [...state.calendar.filterIndexes].filter(id => id != action.payload)
                }
            }
        case actions.ADD_FILTER_EXTERNAL_EVENT:
            return {
                ...state,
                calendar: {
                    ...state.calendar,
                    filterExternalEvent: [...state.calendar.filterExternalEvent, action.payload]
                }
            }
        case actions.DELETE_FILTER_EXTERNAL_EVENT:
            return {
                ...state,
                calendar: {
                    ...state.calendar,
                    filterExternalEvent: [...state.calendar.filterExternalEvent].filter(id => id != action.payload)
                }
            }
        case actions.ADD_FILTER_CALENDARS:
            return {
                ...state,
                calendar: {
                    ...state.calendar,
                    filterCalendars: [...state.calendar.filterCalendars, action.payload]
                }
            }
        case actions.DELETE_FILTER_CALENDARS:
            return {
                ...state,
                calendar: {
                    ...state.calendar,
                    filterCalendars: [...state.calendar.filterCalendars].filter(id => id != action.payload)
                }
            }
        case actions.SET_EVENT_COMMENTS:
            return {
                ...state,
                calendar: {
                    ...state.calendar,
                    eventComments: action.payload
                }
            }
        case actions.ADD_EVENT_COMMENTS:
            return {
                ...state,
                calendar: {
                    ...state.calendar,
                    eventComments: [...state.calendar.eventComments, action.payload]
                }
            }
        case actions.DELETE_EVENT_COMMENTS:
            return {
                ...state,
                calendar: {
                    ...state.calendar,
                    eventComments: [...state.calendar.eventComments].filter(eventComment => eventComment.id != action.payload)
                }
            }
        case actions.SET_SOLVED_COMMENT:
            let comments = [...state.calendar.eventComments];
            const found = comments.find(comment => comment.id == action.payload.id);
            found.solved = action.payload.solved;
            return {
                ...state,
                calendar: {
                    ...state.calendar,
                    eventComments: comments
                }
            }
        case actions.SET_ACCOUNTS_USER:
            return {
                ...state,
                calendar: {
                    ...state.calendar,
                    accountsUser: action.payload
                }
            }
        case actions.SET_TAGS_FORMAT:
            return {
                ...state,
                calendar: {
                    ...state.calendar,
                    tagsFormat: action.payload
                }
            }
        case actions.ADD_FILTER_TAG_FORMAT:
            return {
                ...state,
                calendar: {
                    ...state.calendar,
                    filterTagsFormat: [...state.calendar.filterTagsFormat, action.payload]
                }
            }
        case actions.DELETE_FILTER_TAG_FORMAT:
            return {
                ...state,
                calendar: {
                    ...state.calendar,
                    filterTagsFormat: [...state.calendar.filterTagsFormat].filter(id => id != action.payload)
                }
            }
        case actions.SET_RECURRENT_EVENT:
            return {
                ...state,
                calendar: {
                    ...state.calendar,
                    currentEvent: {
                        ...state.calendar.currentEvent,
                        is_recurrent: action.payload
                    }
                }
            }
        case actions.SET_CURRENT_EVENT_DATES:
            return {
                ...state,
                calendar: {
                    ...state.calendar,
                    currentEvent: {
                        ...state.calendar.currentEvent,
                        start: action.payload.start,
                        end: action.payload.end,
                        allDay: action.payload.allDay
                    }
                }
            }
        case actions.SET_CURRENT_START_DATE:
            return {
                ...state,
                calendar: {
                    ...state.calendar,
                    currentStartDate: action.payload
                }
            }
        case actions.SET_CURRENT_END_DATE:
            return {
                ...state,
                calendar: {
                    ...state.calendar,
                    currentEndDate: action.payload
                }
            }
        default:
            return state;
    }
}

export default calendarReducer