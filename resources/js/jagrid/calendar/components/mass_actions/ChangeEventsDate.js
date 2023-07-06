import axios from 'axios';
import { useEffect, useState } from 'react';

import Swal from 'sweetalert2';

import { locale } from '../../utils/utils';

export default function ChangeEventsDate(props) {

    const { getEvents } = props;

    const [dataMassAction, setDataMassAction] = useState();
    const [disabledButtonApply, setDisabledButtonApply] = useState(true);

    const applyMassAction = () => {
        changeEventDates();
    };

    useEffect(() => {
        setDisabledButtonApply(true);
        if(dataMassAction){
            if (dataMassAction.criteria && dataMassAction.qty) {
                setDisabledButtonApply(false);
            }
        }
    }, [dataMassAction]);

    const changeEventDates = () => {

        let elements = document.getElementsByClassName('fc-daygrid-event');
        let ids = [];
        for (let index = 0; index < elements.length; index++) {
            const element = elements[index];
            if (element.dataset.selected == 'true') {
                ids.push(element.id);
            }
        }

        if (!dataMassAction.criteria) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Debes seleccionar dias, semanas o meses',
            });
            return false;
        }

        if (!dataMassAction.qty) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Debes digitar una cantidad',
            });
            return false;
        } else {
            if (dataMassAction.qty == 0 || dataMassAction.qty > 31) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'La cantidad debe ser mayor a 0 y menor a 31',
                });
                return false;
            }
        }

        if (ids.length == 0) {
            Swal.fire({
                icon: 'info',
                title: 'Oops...',
                text: 'No hay eventos seleccionados',
            });
            return false;
        }

        Swal.fire({
            title: '¿Seguro que desea realizar esta acción?',
            text: "Esta acción no se puede revertir",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Si'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.post('/mass-actions/changeEventDates', {
                    ids: ids,
                    data: dataMassAction
                })
                    .then(function (response) {
                        getEvents();
                        Swal.fire(
                            'Eventos actualizados',
                            'Se han movido ' + ids.length + ' evento/s a ' + dataMassAction.qty + ' ' +
                            (dataMassAction.criteria == 'days' ? 'dia/s' : '') +
                            (dataMassAction.criteria == 'weeks' ? 'semana/s' : '') +
                            (dataMassAction.criteria == 'months' ? 'mes/es' : ''),
                            'success'
                        )
                    })
                    .catch(function (error) {

                    })
                    .then(function () {

                    });
            }
        })
    };

    return (
        <>
            <div className="form-group">
                <label>{locale.MOVE_BY}</label>
                <select
                    className="form-control mb-1"
                    onChange={(e) => {
                        setDataMassAction((prevState) => ({
                            ...prevState,
                            criteria: e.target.value
                        }))
                    }}
                >
                    <option value="">-- {locale.SELECT} --</option>
                    <option value="days">{locale.DAYS}</option>
                    <option value="weeks">{locale.WEEKS}</option>
                    <option value="months">{locale.MONTHS}</option>
                </select>
            </div>
            <div className="form-group">
                <label>{locale.QTY}</label>
                <input
                    type="text"
                    className="form-control"
                    placeholder="Qty"
                    onChange={(e) => {
                        setDataMassAction((prevState) => ({
                            ...prevState,
                            qty: e.target.value
                        }))
                    }}
                    onKeyPress={(event) => {
                        if (!/[0-9]/.test(event.key)) {
                            event.preventDefault();
                        }
                    }}
                    maxLength={2}
                />
            </div>
            <button className="btn btn-primary" onClick={applyMassAction} disabled={disabledButtonApply}>{locale.APPLY}</button>
        </>
    )
}