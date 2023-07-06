import axios from "axios";
import { locale, actions, base_url } from "../../utils/utils";
import { useAppState } from "../../contexts/appState";

export default function EventFile(props){

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

    return(
        <div>
            <a href={`${base_url}/storage/${file.path}`}>
                <img src={`${base_url}/storage/${file.path}`} className="img-fluid" />
            </a>
            <button type="button" className="btn btn-sm d-block btn-outline-danger w-25 mt-1 mb-2" onClick={(e) => { deleteFile(file.id) }}>
                {locale.DELETE}
            </button>
        </div>
    )
}