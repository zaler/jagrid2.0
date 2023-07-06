import { useContext } from 'react';

import axios from 'axios';

import { actions } from '../../utils/utils';
import { useAppState } from '../../contexts/appState';

export default function EventTagFormat(props) {

    const { tagFormat } = props;

    const [state, dispatch] = useAppState();

    const { currentEvent } = state.calendar;

    const handleChangeInput = (e) => {
        let isChecked = e.target.checked;
        let tag_format_id = e.target.value;

        if (isChecked) {
            addEventTagFormat(tagFormat);
            axios.post('/tag-format/events', {
                event_id: currentEvent.id,
                tag_format_id: tag_format_id
            })
                .then(function (response) {

                })
                .catch(function (error) {

                })
                .then(function () {

                });
        } else {
            deleteEventTagFormat(tag_format_id);
            axios.delete('/tag-format/events', {
                data: {
                    event_id: currentEvent.id,
                    tag_format_id: tag_format_id
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
    function addEventTagFormat(data) {
        dispatch({
            type: actions.ADD_EVENT_TAG_FORMAT,
            payload: data
        })
    }

    function deleteEventTagFormat(data) {
        dispatch({
            type: actions.DELETE_EVENT_TAG_FORMAT,
            payload: data
        })
    }

    return (
        <div style={{ display: "inline-block", marginRight: "10px", marginTop: "4px" }}>
            <img src={tagFormat.icon} className="img-fluid" width="30" style={{ marginRight: "4px" }} />
            <input
                type="checkbox"
                className="btn-check"
                name="tagsFormat[]"
                id={"tagFormat-" + tagFormat.id}
                value={tagFormat.id}
                onChange={(e) => { handleChangeInput(e) }}
                checked={currentEvent.tags_format.find(cetf => cetf.id == tagFormat.id) ? true : false}
            />
            <label
                className="btn btn-outline-primary"
                htmlFor={"tagFormat-" + tagFormat.id}
            >
                {tagFormat.name}
            </label>
        </div>
    )
}