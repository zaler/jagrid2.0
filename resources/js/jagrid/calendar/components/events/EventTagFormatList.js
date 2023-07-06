import { useAppState } from '../../contexts/appState';
import EventTagFormat from './EventTagFormat';

export default function EventTagFormatList(){

    const [state, dispatch] = useAppState();

    const { tagsFormat } = state.calendar;

    return(
        <>
            {tagsFormat.map((tagFormat) => <EventTagFormat key={tagFormat.id} tagFormat={tagFormat} />)}
        </>
    )
}