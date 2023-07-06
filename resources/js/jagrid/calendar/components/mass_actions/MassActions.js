import { useState } from 'react';

import { actions, locale } from '../../utils/utils';
import ChangeEventsDate from './ChangeEventsDate';

export default function MassActions(props) {

    const { getEvents } = props;

    const [currentMassAction, setCurrentMassAction] = useState('');

    return (
        <div className="row">
            <div className="col-12">
                <h4>{locale.MASS_ACTIONS}</h4>
                <div className="form-group">
                    <label>{locale.for_all_events_that_are_marked}</label>
                    <select className="form-control" onChange={(e) => { setCurrentMassAction(e.target.value) }}>
                        <option value="">-- {locale.SELECT} --</option>
                        <option value={actions.MASS_CHANGE_EVENT_DATES}>{locale.move_events_to_another_date_another_date}</option>
                    </select>
                    {currentMassAction === actions.MASS_CHANGE_EVENT_DATES ? <ChangeEventsDate getEvents={getEvents} /> : "" }
                </div>
            </div>
        </div>
    )
}