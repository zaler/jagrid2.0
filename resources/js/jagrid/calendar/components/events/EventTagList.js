import { useEffect, useState, useContext } from 'react';

import axios from 'axios';

import EventTag from './EventTag';

export default function EventTagList(){

    const [tags, setTags] = useState([]);

    useEffect(() => {
        axios.get('/tag/events')
        .then(function (response) {
            setTags(response.data);
        })
        .catch(function (error) {
    
        })
        .then(function () {
    
        });
    }, []);

    return(
        <>
            {tags.map((tag) => <EventTag key={tag.id} tag={tag} />)}
        </>
    )
}