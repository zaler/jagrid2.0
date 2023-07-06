import ExternalEventItem from './ExternalEventItem';

export default function ExternalEventList(props){

    const { externalEvents, handleClick } = props;

    return (
        <div id="externalEvents">
            {externalEvents.map((externalEvent) => <ExternalEventItem key={`externalEvent-${externalEvent.id}`} externalEvent={externalEvent} handleClick={handleClick} />)}
        </div>
    )
}