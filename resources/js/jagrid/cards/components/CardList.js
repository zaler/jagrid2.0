import { useEffect, useContext } from 'react';

import axios from 'axios';

import { GlobalContext } from '../context/GlobalState';
import { account_id, account_url, locale } from '../utils/viewData';
import CardItem from './CardItem';
import FilterDate from './filters/FilterDate';
import FilterEventType from './filters/FilterEventType';
import FilterStatus from './filters/FilterStatus';
import { default as GenerateLink } from './generator/customer/Link';

export default function CardList() {

    const {
        events,
        setEvents,
        setGlobalIndexes,
        setStatuses,
        setEventTypes,
        filterEventTypes,
        filterEventStatuses,
        filterStartDate,
        filterEndDate,
        addFilterEventStatuses,
        addFilterEventTypes,
        setFilterStartDate,
        setFilterEndDate
    } = useContext(GlobalContext);

    useEffect(() => {
        if(window.location.search){
            setParams();
        }else{
            getEvents();
        }

        getGlobalIndexes();
        getStatuses();
        getEventTypes();
        
    }, []);

    useEffect(() => {

        const timerId = setTimeout(() => {
            getEvents();
        }, 1000);

        return () => {
            clearTimeout(timerId);
        };

    }, [
        filterEventTypes,
        filterEventStatuses,
        filterStartDate,
        filterEndDate
    ]);

    const getEvents = () => {
        axios.get('/events' + getParams())
            .then(function (response) {
                setEvents(response.data);
            })
            .catch(function (error) {

            })
            .then(function () {

            });
    }

    const getParams = () => {
        let params = '';

        params += '?calendars=' + account_id;

        if (filterEventTypes.length > 0) {
            params += '&eventTypeId=' + filterEventTypes.join(',');
        }
        if (filterEventStatuses.length > 0) {
            params += '&eventStatusId=' + filterEventStatuses.join(',');
        }
        if (filterStartDate != '') {
            params += '&startDate=' + filterStartDate;
        }
        if (filterEndDate != '') {
            params += '&endDate=' + filterEndDate;
        }

        return params;
    };

    const setParams = () => {
        let params = new URLSearchParams(window.location.search);

        if(params.get('eventTypeId')){
            params.get('eventTypeId').split(',').map((row) => addFilterEventTypes(row));
        }
        if(params.get('eventStatusId')){
            params.get('eventStatusId').split(',').map((row) => addFilterEventStatuses(row));
        }
        if(params.get('startDate')){
            setFilterStartDate(params.get('startDate'));
        }
        if(params.get('endDate')){
            setFilterEndDate(params.get('endDate'));
        }
    }

    const getGlobalIndexes = () => {
        axios.get('/index/events', {
            params: {
                account_id: account_id
            }
        })
            .then(function (response) {
                setGlobalIndexes(response.data);
            })
            .catch(function (error) {

            })
            .then(function () {

            });
    };

    const getStatuses = () => {
        axios.get(`/event-statuses`)
            .then(function (response) {
                setStatuses(response.data);
            })
            .catch(function (error) {

            })
            .then(function () {

            });
    };

    const getEventTypes = () => {
        axios.get(`/event-types`)
            .then(function (response) {
                setEventTypes(response.data);
            })
            .catch(function (error) {

            })
            .then(function () {

            });
    };

    const cleanFilters = () => {
        location.href = `/cards/${account_url}`;
    };

    return (
        <>
            <div className="row">
                <div className="col-md-12 pt-2">
                    <div className="row mb-2">
                        <div className="col-xl-6">
                            <h4>{locale.FILTER_BY_DATES}</h4>
                            <FilterDate />
                        </div>
                        <div className="col-xl-6">
                            <h4>{locale.FILTER_BY_EVENT_TYPE}</h4>
                            <div style={{ display: "flex" }}>
                                <FilterEventType />
                            </div>
                        </div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-12">
                            <h4>{locale.FILTER_BY_STATUS}</h4>
                        </div>
                        <FilterStatus />
                    </div>
                </div>
                <div className="col-md-12 pt-2 pb-2">
                    <button className="btn btn-info" type="button" onClick={() => { cleanFilters() }}><i className="fas fa-redo"></i> Limpiar filtros</button>&nbsp;
                    <GenerateLink params={getParams()} />
                </div>
            </div>
            <div className="row">
                {events.map((event) => <CardItem event={event} key={event.id} />)}
            </div>
        </>
    )
}