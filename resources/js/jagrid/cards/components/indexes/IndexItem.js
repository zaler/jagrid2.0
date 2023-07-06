import { useContext } from 'react';

import { GlobalContext } from '../../context/GlobalState';

export default function IndexItem(props){

    const { index } = props;

    const { globalIndexes } = useContext(GlobalContext);

    const renderIndexItem = () => {
        let found = globalIndexes.find(gi => gi.id == index);
        if(found){
            return(
                <img
                    src={`https://via.placeholder.com/24/${found.color.replace('#', '')}/${found.color.replace('#', '')}`}
                    style={{ borderRadius: '50%' }}
                />
            )
        }
    };

    return(
        <>
            {renderIndexItem()}
        </>
    )
}