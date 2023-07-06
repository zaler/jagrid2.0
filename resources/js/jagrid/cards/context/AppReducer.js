import { actions } from "../utils/actions";

export default function AppReducer(state, action) {
    switch (action.type) {
        case actions.SET_EVENTS:
            return {
                ...state,
                events: action.payload
            }
        case actions.SET_GLOBAL_INDEXES:
            return {
                ...state,
                globalIndexes: action.payload
            }
        case actions.SET_STATUSES:
            return {
                ...state,
                statuses: action.payload
            }
        case actions.SET_EVENT_TYPES:
            return {
                ...state,
                eventTypes: action.payload
            }
        case actions.ADD_FILTER_EVENT_TYPES:
            return {
                ...state,
                filterEventTypes: [...state.filterEventTypes, action.payload]
            }
        case actions.ADD_FILTER_EVENT_STATUSES:
            return {
                ...state,
                filterEventStatuses: [...state.filterEventStatuses, action.payload]
            }
        case actions.DELETE_FILTER_EVENT_TYPES:
            return {
                ...state,
                filterEventTypes: [...state.filterEventTypes].filter(id => id != action.payload)
            }
        case actions.DELETE_FILTER_EVENT_STATUSES:
            return {
                ...state,
                filterEventStatuses: [...state.filterEventStatuses].filter(id => id != action.payload)
            }
        case actions.SET_FILTER_START_DATE:
            return {
                ...state,
                filterStartDate: action.payload
            }
        case actions.SET_FILTER_END_DATE:
            return {
                ...state,
                filterEndDate: action.payload
            }
        default:
            return state;
    }
}