import { useEffect, useState } from 'react';

import axios from 'axios';
import moment from 'moment';
import momentDurationFormatSetup from 'moment-duration-format';

import { useAppState } from '../../../contexts/appState';
import { account_id } from '../../../utils/utils';
import TrackingProjectItem from './TrackingProjectItem';

export default function TrackingProject() {

    const [state, dispatch] = useAppState();

    const { currentStartDate, currentEndDate, indexEvents, filterStartDate, filterEndDate } = state.calendar;

    const [contentTracking, setContentTracking] = useState('');
    const [contentTrackingGlobal, setContentTrackingGlobal] = useState('');
    const [totals, setTotals] = useState();

    useEffect(() => {
        if (filterStartDate && filterEndDate && indexEvents.length > 0) {
            axios.get('/tracking-projects', {
                params: {
                    account_id,
                    start: moment(filterStartDate).format(),
                    end: moment(filterEndDate).format()
                }
            })
                .then(function (response) {
                    calculateTotals(response.data);
                })
                .catch(function (error) {

                })
                .then(function () {

                });
        } else {
            if (currentStartDate && currentEndDate && indexEvents.length > 0) {
                axios.get('/tracking-projects', {
                    params: {
                        account_id,
                        start: moment(currentStartDate).format(),
                        end: moment(currentEndDate).format()
                    }
                })
                    .then(function (response) {
                        calculateTotals(response.data);
                    })
                    .catch(function (error) {

                    })
                    .then(function () {

                    });
            }
        }
    }, [currentStartDate, currentEndDate, indexEvents, filterStartDate, filterEndDate]);

    const calculateTotals = (projects) => {
        let days = 0;
        let hours = 0;
        let minutes = 0;
        let content = [];
        let contentGlobal = [];
        let indexes = [];

        projects.map((project) => {

            let start = moment(project.start);
            let end = moment(project.end);

            let time = '';

            if (end.isValid() && end.isAfter(start)) {

                let diff = moment.duration(end.diff(start));

                let d = diff.days();
                let h = diff.hours();
                let m = diff.minutes();

                days += d;
                hours += h;
                minutes += m;

                time = `Tiempo estimado: ${d} dia/s, ${h} hora/s, ${m} minuto/s`;

                let tmpIndexes = project.indexes.split(',');
                if (tmpIndexes.length > 0) {
                    tmpIndexes.map((tmpIndex) => {
                        let found = indexes.find(index => index.id == tmpIndex);
                        if (!found) {
                            let ie = indexEvents.find(i => i.id == tmpIndex);
                            if (ie) {
                                indexes.push({ id: tmpIndex, title: ie.title, hours: anyTimeToHours(d, h, m), events: 1 });
                            }
                        } else {
                            found.hours = found.hours + anyTimeToHours(d, h, m);
                            found.events = found.events + 1;
                        }
                    });
                }
            }
            content.push(<TrackingProjectItem key={project.id} project={project} time={time} />);
        });

        indexes.map((i) => {
            contentGlobal.push(<tr key={i.id}><td>{i.title}</td><td>{moment.duration(i.hours, 'hours').format("d [days], h [hours], m [minutes]")}</td><td>{i.events}</td></tr>);
        });

        setTotals({
            days,
            hours,
            minutes
        })
        setContentTracking(content);
        setContentTrackingGlobal(contentGlobal);
    };

    const formatCalculatedTotal = () => {
        let label = '';
        let view = localStorage.getItem('defaultViewType');

        switch (view) {
            case 'dayGridMonth':
                label = 'en el mes';
                break;
            case 'timeGridWeek':
                label = 'en la semana';
                break;
            case 'timeGridDay':
                label = 'en el dia';
                break;
            default:
                break;
        }

        let daysToHours = moment.duration(totals.days, 'days').asHours();
        let minutesToHours = moment.duration(totals.minutes, 'minutes').asHours();
        let total = daysToHours + minutesToHours + totals.hours;
        return `Horas dedicadas a proyectos ${label}: ${total}`;
    };

    const formatLabelView = () => {
        let label = '';
        let view = '';
        let defaultViewType = localStorage.getItem('defaultViewType');

        switch (defaultViewType) {
            case 'dayGridMonth':
                label = 'en el mes';
                view = 'Mes';
                break;
            case 'timeGridWeek':
                label = 'en la semana';
                view = 'Semana';
                break;
            case 'timeGridDay':
                label = 'en el dia';
                view = 'Dia';
                break;
            default:
                break;
        }

        return (
            <ul>
                <li>{`Tiempo dedicado a proyectos ${label}`}</li>
                <li>{`Vista: ${view}`}</li>
                {filterStartDate && filterEndDate ?
                    <li>Del {moment(filterStartDate).format('YYYY-MM-DD') + ' hasta ' + moment(filterEndDate).format('YYYY-MM-DD')}</li>
                    : ''}
                {(currentStartDate && currentEndDate) && (!filterStartDate && !filterEndDate) ?
                    <li>Del {moment(currentStartDate).format('YYYY-MM-DD') + ' hasta ' + moment(currentEndDate).format('YYYY-MM-DD')}</li>
                    : ''}
            </ul>
        )
    };

    const anyTimeToHours = (days, hours, minutes) => {
        let daysToHours = moment.duration(days, 'days').asHours();
        let minutesToHours = moment.duration(minutes, 'minutes').asHours();
        let total = daysToHours + minutesToHours + hours;
        return total;
    };

    return (
        <>
            {contentTrackingGlobal ?
                <>
                    <h2 className='mt-2'>Seguimiento de proyectos</h2>
                    {formatLabelView()}
                    <table className='table my-2'>
                        <thead>
                            <tr>
                                <th>Titulo</th>
                                <th>Tiempo</th>
                                <th>Total proyectos</th>
                            </tr>
                        </thead>
                        <tbody>
                            {contentTrackingGlobal}
                        </tbody>
                    </table>
                    {/*
                    <h2 className='mt-2'>Tracking Projects</h2>
                    <div className='w-100'>
                        <b>{formatCalculatedTotal()}</b>
                    </div>
                    <table className='table my-2'>
                        <thead>
                            <tr>
                                <th>Titulo</th>
                                <th>Desde</th>
                                <th>Hasta</th>
                                <th>Tiempo Estimado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {contentTracking}
                        </tbody>
                    </table>
                    */}
                </>
                : 'Loading ...'
            }
        </>
    )

}