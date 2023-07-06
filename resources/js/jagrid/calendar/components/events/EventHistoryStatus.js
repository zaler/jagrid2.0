import { useContext, useEffect, useState } from 'react';

import axios from 'axios';

import { isSingleEvent, event_id, _timeHistory } from '../../utils/utils';
import { useAppState } from '../../contexts/appState';

export default function EventHistoryStatus() {

    const [history, setHistory] = useState([]);

    const [state, dispatch] = useAppState();

    const { currentEvent, saveOnTyping } = state.calendar;

    useEffect(() => {
        if(isSingleEvent){
            getEventHistoryStatus(event_id);
        }else{
            if(currentEvent.id){
                getEventHistoryStatus(currentEvent.id);
            }
        }
    }, []);

    useEffect(() => {
        if(!saveOnTyping){
            if(currentEvent.id){
                getEventHistoryStatus(currentEvent.id);
            }
        }
    }, [saveOnTyping]);

    const getEventHistoryStatus = (id) => {
        axios.get('/event-history-status', {
            params: {
                event_id: id
            }
        })
            .then(function (response) {
                setHistory(response.data);
            })
            .catch(function (error) {

            })
            .then(function () {

            });
    };

    const renderDate = (h) => {
        let date;
        if(!h.created_at){
            return '';
        }
        date = new Date(h.created_at).toLocaleDateString('en-us', { weekday:"short", year:"numeric", month:"short", day:"numeric"});
        return date;
    }

    const renderTime = (h) => {
        let time;
        if(!h.created_at){
            return '';
        }
        time = new Date(h.created_at).toLocaleTimeString('en-US');
        return time;
    }

    const renderMessage = (h) => {
        return(
            <>
                <b>{h.user.name}</b> ha cambiado el status de <b>{h.from_status.name}</b> a <b>{h.to_status.name}</b>
            </>
        )
    };

    const renderTimeAgo = (currentIndex, previousIndex) => {
        if(previousIndex === -1){
            return(
                _timeHistory(
                    new Date( currentEvent.created_at ),
                    new Date( history[currentIndex].created_at )
                )
            )
        }else{
            return(
                _timeHistory(
                    new Date( history[previousIndex].created_at ),
                    new Date( history[currentIndex].created_at )
                )
            )
        }
    };

    return (
        <>
            {history.length > 0 ?
                <ul className="timeline">
                    {history.map((h, index) => {
                        return(
                            <li className="timeline-item" key={h.id}>
                                <span className="timeline-point timeline-point-indicator" style={{backgroundColor: h.to_status.color}} />
                                <div className="timeline-event">
                                    <div className="d-flex justify-content-between flex-sm-row flex-column mb-sm-0 mb-1">
                                        <p>{renderMessage(h)}</p>
                                        <span className="timeline-event-time">{renderDate(h)} {renderTime(h)}</span>
                                    </div>
                                    <div className="d-flex">
                                        <small>{renderTimeAgo(index, index - 1)}</small>
                                    </div>
                                </div>
                            </li>
                        )
                    })}
                </ul>
                : ''}
        </>
    )
}