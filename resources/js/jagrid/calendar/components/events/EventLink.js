import axios from "axios";
import { locale, actions } from "../../utils/utils";
import { useAppState } from "../../contexts/appState";

export default function EventLink(props) {

    const { file } = props;
    const [state, dispatch] = useAppState();

    const deleteFile = (file_id) => {
        axios.delete(`/events-files/${file_id}`)
            .then(function (response) {
                deleteEventFile(file_id);
            })
            .catch(function (error) {

            })
            .then(function () {

            });
    };

    //Dispatch
    function deleteEventFile(data) {
        dispatch({
            type: actions.DELETE_EVENT_FILE,
            payload: data
        })
    }

    return (
        <div>
            <a href={file.path} target="_blank" className="d-block">
                {file.path}
            </a>
            <a className="text-danger" href="#" onClick={(e) => { deleteFile(file.id) }}>
                {locale.DELETE}
            </a>
        </div>
    )
}