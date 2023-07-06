import { useContext, useEffect, useState } from 'react';

import Select from 'react-select';
import Swal from 'sweetalert2';
import axios from 'axios';

import { locale, account_id, account_name } from '../../utils/utils';
import { useAppState } from '../../contexts/appState';

export default function EventAccount() {

    const [state, dispatch] = useAppState();

    const {
        currentEvent,
        filterCalendars
    } = state.calendar;

    const [options, setOptions] = useState([]);
    const [values, setValues] = useState([]);

    useEffect(() => {
        getAccountsUser();
        let _values = [];
        if (currentEvent.accounts) {
            currentEvent.accounts.map((cea) => {
                _values.push({ value: cea.id, label: cea.name });
            });
            setValues(_values);
        }
    }, []);

    const changeEventAccount = (e, type) => {
        switch (type.action) {
            case 'select-option':
                addEventToAccount(type.option.value);
                setValues(e);
                break;
            case 'remove-value':
                if (e.length == 0) {
                    Swal.fire(locale.The_event_must_belong_to_at_least_one_account)

                } else {
                    removeEventFromAccount([type.removedValue]);
                    setValues(e);
                }
                break;
            case 'clear':
                //removeEventFromAccount(type.removedValues);
                break;
            default:
                break;
        }
    };

    const addEventToAccount = (accountId) => {
        axios.post('/events-accounts', {
            event_id: currentEvent.id,
            account_id: accountId
        })
            .then(function (response) {

            })
            .catch(function (error) {

            })
            .then(function () {

            });
    };

    const removeEventFromAccount = (removedValues) => {
        axios.delete(`/events-accounts`, {
            data: {
                event_id: currentEvent.id,
                removedValues
            }
        })
            .then(function (response) {

            })
            .catch(function (error) {

            })
            .then(function () {

            });
    };

    const getAccountsUser = () => {
        axios.get(`/accounts-user`)
            .then(function (response) {
                let _options = [];
                let accountsUser = response.data;
                accountsUser.map((au) => {
                    filterCalendars.map((fc) => {
                        if (au.value == fc) {
                            _options.push(au);
                        }
                    });
                });
                if (currentEvent.accounts) {
                    let addCurrentAccount = true;
                    currentEvent.accounts.map((cea) => {
                        if (cea.id == account_id) {
                            addCurrentAccount = false;
                        }
                    });
                    if (addCurrentAccount) {
                        _options.push({ value: account_id, label: account_name });
                    }
                }
                setOptions(_options);
            })
            .catch(function (error) {

            })
            .then(function () {

            });
    };

    return (
        <>
            {filterCalendars.length > 0 ?
                <div className="form-group mb-2">
                    <label className="fw-bolder">{locale.This_event_also_belongs_to_the_following_accounts}</label>
                    <Select options={options} value={values} isMulti onChange={changeEventAccount} />
                </div>
                : ''}
        </>
    )
}