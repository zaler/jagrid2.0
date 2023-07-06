import { useAppState } from "../../contexts/appState";
import { actions } from "../../utils/utils";

export default function EventStatus(props) {

    const { eventStatus } = props;

    const [state, dispatch] = useAppState();

    const { currentEvent } = state.calendar;

    const handleChangeInput = (e) => {
        let target = e.target;
        let data = {
            name: target.name,
            value: target.value
        };
        handleChangeInputEvent(data);
    };

    //Dispatch
    function handleChangeInputEvent(data) {
        dispatch({
            type: actions.HANDLE_CHANGE_INPUT_EVENT,
            payload: data
        });
    }

    return (
        <div style={{ display: "inline-block", marginRight: "2px", marginTop: "2px" }}>
            <input type="radio" className="btn-check" name="event_status_id" id={"eventStatus-" + eventStatus.id} value={eventStatus.id} onChange={(e) => { handleChangeInput(e) }} checked={currentEvent.event_status_id == eventStatus.id} />
            <label className="btn btn-outline-primary" htmlFor={"eventStatus-" + eventStatus.id}>{eventStatus.name}</label>
        </div>
    )
}