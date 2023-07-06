import EventFile from './EventFile';
import EventLink from './EventLink';
import { useAppState } from '../../contexts/appState';

export default function EventFileList(props){

    const { type, format } = props;
    const [state, dispatch] = useAppState();

    const { currentEvent } = state.calendar;

    const renderListEventFiles = (type, format) => {
        var result;

        if(format == 'link'){
            result = currentEvent.files.filter(file => file.type == type && file.format == 'link');
            return(
                result.map((file) =>
                    <EventLink key={file.id} file={file} />
                )
            )
        }else{
            result = currentEvent.files.filter(file => file.type == type && file.format != 'link');
            return(
                result.map((file) =>
                    <EventFile key={file.id} file={file} />
                )
            )
        }
    };

    return(
        <div>
            { renderListEventFiles(type, format) }
        </div>
    )
}