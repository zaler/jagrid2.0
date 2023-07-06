import { useContext } from 'react';

import axios from 'axios';

import { actions } from "../../utils/utils";
import { useAppState } from '../../contexts/appState';

export default function EventTag(props) {

    const { tag } = props;

    const [state, dispatch] = useAppState();

    const { currentEvent } = state.calendar;

    const handleChangeInput = (e) => {
        let isChecked = e.target.checked;
        let tag_id = e.target.value;

        if (isChecked) {
            addEventTag(tag);
            axios.post('/tag/events', {
                event_id: currentEvent.id,
                tag_id: tag_id
            })
                .then(function (response) {

                })
                .catch(function (error) {

                })
                .then(function () {

                });
        } else {
            deleteEventTag(tag_id);
            axios.delete('/tag/events', {
                data: {
                    event_id: currentEvent.id,
                    tag_id: tag_id
                }
            })
                .then(function (response) {

                })
                .catch(function (error) {

                })
                .then(function () {

                });
        }
    }

    //Dispatch
    function addEventTag(data) {
        dispatch({
            type: actions.ADD_EVENT_TAG,
            payload: data
        })
    }

    function deleteEventTag(data) {
        dispatch({
            type: actions.DELETE_EVENT_TAG,
            payload: data
        })
    }
    
    return (
        <div style={{ display: "inline-block", marginRight: "10px", marginTop: "4px" }}>
            <img src={tag.icon} className="img-fluid" width="30" style={{ marginRight: "4px" }} />
            <input
                type="checkbox"
                className="btn-check"
                name="tags[]"
                id={"tag-" + tag.id}
                value={tag.id}
                onChange={(e) => { handleChangeInput(e) }}
                checked={currentEvent.tags.find(cet => cet.id == tag.id) ? true : false}
            />
            <label
                className="btn btn-outline-primary"
                htmlFor={"tag-" + tag.id}
            >
                {tag.name}
            </label>
        </div>
    )
}