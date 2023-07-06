import { actions } from '../../utils/utils';
import { useAppState } from '../../contexts/appState';

export default function IndexEventItem(props) {

    const { indexEvent, handleClick } = props;

    const [state, dispatch] = useAppState();

    //Dispatches
    function addFilterIndexes(data) {
        dispatch({
            type: actions.ADD_FILTER_INDEXES,
            payload: data
        })
    }
    
    function deleteFilterIndexes(data) {
        dispatch({
            type: actions.DELETE_FILTER_INDEXES,
            payload: data
        })
    }

    return (
        <>
            <div className="row align-items-center mb-1" key={indexEvent.id}>
                <div className="col-2 text-center">
                    <div className="form-check">
                    <input className="form-check-input" type="checkbox" value={indexEvent.id} onChange={(e) => {
                        if(e.target.checked){
                            addFilterIndexes(e.target.value);
                        }else{
                            deleteFilterIndexes(e.target.value);
                        }
                    }} />
                    </div>
                </div>
                <div className="col-10">
                    <a
                        className="d-block fc-event"
                        title={indexEvent.title}
                        data={indexEvent.id}
                        onClick={() => { handleClick(indexEvent.id) }}
                        style={{
                            border: "1px solid " + indexEvent.color,
                            backgroundColor: indexEvent.color,
                            color: "#f7f7f7",
                            borderRadius: "3px",
                            padding: ".25rem .5rem",
                            fontSize: ".8rem"
                        }}
                    >
                        {indexEvent.title}
                    </a>
                </div>
            </div>
        </>
    )
}