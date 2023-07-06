import { actions, plainObjectEvent } from "../utils/utils"

const calendarReducer = (state, action = {}) => {
    switch (action.type) {
        case actions.SET_OBJECTIVES:
            return {
                ...state,
                objectives: action.payload
            }
        case actions.ADD_OBJECTIVE:
            return {
                ...state,
                objectives: [...state.objectives, action.payload]
            }
        case actions.DELETE_OBJECTIVE:
            return {
                ...state,
                objectives: [...state.objectives].filter(objective => objective.id != action.payload)
            }
        default:
            return state;
    }
}

export default calendarReducer