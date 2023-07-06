import { actions } from '../../utils/utils';
import { useAppState } from '../../contexts/appState';

export default function ExternalEventItem(props) {

    const { externalEvent, handleClick } = props;

    const [state, dispatch] = useAppState();

    //Dispatches
    function addFilterExternalEvent(data) {
        dispatch({
            type: actions.ADD_FILTER_EXTERNAL_EVENT,
            payload: data
        })
    }
    
    function deleteFilterExternalEvent(data) {
        dispatch({
            type: actions.DELETE_FILTER_EXTERNAL_EVENT,
            payload: data
        })
    }

    return (
        <>
            <div className="row align-items-center mb-1" key={externalEvent.id}>
                <div className="col-2 text-center">
                    <div className="form-check">
                    <input className="form-check-input" type="checkbox" value={externalEvent.id} onChange={(e) => {
                        if(e.target.checked){
                            addFilterExternalEvent(e.target.value);
                        }else{
                            deleteFilterExternalEvent(e.target.value);
                        }
                    }} />
                    </div>
                </div>
                <div className="col-10">
                    <a
                        className="d-block fc-event"
                        title={externalEvent.title}
                        data={externalEvent.id}
                        onClick={() => { handleClick(externalEvent.id) }}
                        style={{
                            border: "1px solid #FB9F44",
                            color: "#FB9F44",
                            backgroundColor: "#FEF3E9",
                            borderRadius: "3px",
                            padding: ".25rem .5rem",
                            fontSize: ".8rem"

                        }}
                    >
                        {externalEvent.title}
                    </a>
                </div>
            </div>
        </>
    )
}