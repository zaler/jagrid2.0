import ObjectiveItem from './ObjectiveItem';

export default function ObjectiveList(props){

    const { objectives, handleClick } = props;

    return (
        <>
            {objectives.map((objective) => <ObjectiveItem key={`objective-${objective.id}`} objective={objective} handleClick={handleClick} />)}
        </>
    )
}