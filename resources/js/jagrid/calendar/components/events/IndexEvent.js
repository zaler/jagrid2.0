import { actions } from '../../utils/utils';
import { useAppState } from '../../contexts/appState';

export default function IndexEvent(props) {

    const { indexEvent } = props;

    const [state, dispatch] = useAppState();

    const { currentEvent } = state.calendar;

    const handleChangeInput = (e, id) => {
        let isChecked = e.target.checked;

        if (isChecked) {
            addIndexToEvent(id);
        } else {
            deleteIndexFromEvent(id);
        }
    }

    //Dispatches
    function addIndexToEvent(data) {
        dispatch({
            type: actions.ADD_INDEX_TO_EVENT,
            payload: data
        })
    }

    function deleteIndexFromEvent(data) {
        dispatch({
            type: actions.DELETE_INDEX_FROM_EVENT,
            payload: data
        })
    }

    return (
        <div style={{ display: "inline-block", marginRight: "2px", marginTop: "2px" }}>
            <input
                type="checkbox"
                className="btn-check"
                name="indexes[]"
                id={"indexEvent-" + indexEvent.id}
                value={indexEvent.id}
                onChange={(e) => { handleChangeInput(e, indexEvent.id) }}
                checked={currentEvent.indexes.find(ceiid => ceiid == indexEvent.id) ? true : false}
            />
            <label
                className="btn btn-outline-primary"
                htmlFor={"indexEvent-" + indexEvent.id}
                style={{ display: "flex", flexFlow: "row" }}
            >
                <span
                    style={{
                        backgroundColor: indexEvent.color,
                        width: "14px",
                        height: "14px",
                        borderRadius: "50%"
                    }}>
                </span>&nbsp;
                <span>
                    {indexEvent.title}
                </span>
            </label>
        </div>
    )
}