import IndexEventItem from './IndexEventItem';

export default function IndexEventList(props){

    const { indexEvents, handleClick } = props;

    return (
        <div id="indexEvents">
            {indexEvents.map((indexEvent) => <IndexEventItem key={`indexEvent-${indexEvent.id}`} indexEvent={indexEvent} handleClick={handleClick} />)}
        </div>
    )
}