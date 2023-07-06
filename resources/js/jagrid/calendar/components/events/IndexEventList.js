import { useEffect, useState } from 'react';

import axios from 'axios';

import IndexEvent from './IndexEvent';
import { account_id } from '../../utils/utils';

export default function IndexEventList(){

    const [ indexEvents, setIndexEvents ] = useState([]);

    useEffect(() => {
        getIndexEvents();
    }, []);

    const getIndexEvents = () => {
        axios.get('/index/events', {
            params: {
                account_id: account_id
            }
        })
        .then(function (response) {
          setIndexEvents(response.data);
        })
        .catch(function (error) {
    
        })
        .then(function () {
    
        });
    };

    return(
        <div>
            {indexEvents.map((indexEvent) => <IndexEvent key={indexEvent.id} indexEvent={indexEvent} />)}
        </div>
    )
}