import IndexItem from './IndexItem';

export default function IndexList(props){

    const { eventIndexes } = props;

    return(
        <>
            { eventIndexes ? 
                eventIndexes.split(',').map((ei) => <IndexItem index={ei} key={ei} />)
            : '' }
        </>
    )
}