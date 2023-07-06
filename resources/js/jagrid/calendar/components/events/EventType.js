import { actions } from "../../utils/utils";
import { useAppState } from "../../contexts/appState";

export default function EventType(props) {

    const { eventType } = props;

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
            <input type="radio" className="btn-check" name="event_type_id" id={"eventType-" + eventType.id} value={eventType.id} onChange={(e) => { handleChangeInput(e) }} checked={currentEvent.event_type_id == eventType.id} />
            <label className="btn btn-outline-primary" htmlFor={"eventType-" + eventType.id}>{eventType.name}</label>
        </div>
    )
}