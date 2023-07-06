import { useEffect, useState } from 'react';

import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Button, Modal } from 'react-bootstrap';

import { account_id, account_url, account_name, base_url } from '../../../utils/viewData';

export default function Link(props) {

    const MySwal = withReactContent(Swal);

    const { params } = props;

    const [show, setShow] = useState(false);
    const [customers, setCustomers] = useState([]);
    const [customerEmail, setCustomerEmail] = useState('');
    const [customersToNotify, setCustomersToNotify] = useState([]);
    const [btnSend, setBtnSend] = useState(false);
    const [errorStyleAddEmail, setErrorStyleAddEmail] = useState({});
    const [errorMessageAddEmail, setErrorMessageAddEmail] = useState('');

    useEffect(() => {
        getCustomers();
    }, []);

    useEffect(() => {
        if (customersToNotify.length > 0) {
            setBtnSend(true);
        } else {
            setBtnSend(false);
        }
    }, [customersToNotify]);

    const handleShow = () => setShow(true);

    const handleClose = () => {
        setShow(false);
        setCustomersToNotify([]);
        setBtnSend(false);
    };

    const sendLinkToCustomer = () => {
        if (customersToNotify.length > 0) {
            setBtnSend(false);
            axios.post('/cards-generate-link', {
                customersToNotify,
                account_id,
                account_name,
                url: `/cards/${account_url}/${params}`,
                sendNotification: true
            })
                .then(function (resp) {
                    let response = resp.data
                    if (response.success) {
                        let message = 'Correos enviados exitosamente';
                        showSuccess(response.data, message);
                    } else {
                        showFailure();
                    }
                })
                .catch(function (error) {
                    showFailure();
                });
        }
    };

    const generateLinkToCustomer = () => {
        if (customersToNotify.length > 0) {
            setBtnSend(false);
            axios.post('/cards-generate-link', {
                customersToNotify,
                account_id,
                account_name,
                url: `/cards/${account_url}/${params}`,
                sendNotification: false
            })
                .then(function (resp) {
                    let response = resp.data
                    if (response.success) {
                        let message = 'Enlaces generados';
                        showSuccess(response.data, message);
                    } else {
                        showFailure();
                    }
                })
                .catch(function (error) {
                    showFailure();
                });
        }
    };

    const getCustomers = () => {
        axios.get('/cards-customers', {
            params: {
                account_id: account_id
            }
        })
            .then(function (response) {
                setCustomers(response.data);
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    const addOrRemoveCustomersToNotify = (e, customer) => {
        if (e.target.checked) {
            setCustomersToNotify(prevState => [...prevState, customer]);
        } else {
            setCustomersToNotify(customersToNotify.filter(customerToNotify => customerToNotify.email != customer.email));
        }
        cleanError('addEmail');
        cleanError('sendEmail');
    };

    const renderCustomers = () => {
        return customers.map((customer, index) => (
            <div className="form-check mt-1" key={index}>
                <input className="form-check-input" type="checkbox" id={`customer-${index}`} onChange={(e) => addOrRemoveCustomersToNotify(e, customer)} />
                <label className="form-check-label" htmlFor={`customer-${index}`}><span className="fw-bold">{customer.name}</span> (<i>{customer.email}</i>)</label>
            </div>
        ));
    };

    const addNewEmail = () => {
        const re = /\S+@\S+\.\S+/;
        if (re.test(customerEmail) && !customers.find(customer => customer.email == customerEmail)) {
            setCustomers(prevState => [...prevState, { name: 'Guest User', email: customerEmail }]);
            cleanError('addEmail');
        } else {
            setError('addEmail');
        }
    };

    const setError = (name) => {
        switch (name) {
            case 'addEmail':
                setErrorMessageAddEmail('Por favor ingrese un email válido');
                setErrorStyleAddEmail({ display: 'block' });
                break;
            case 'sendEmail':
                break;
            default:
                break;
        }
    };

    const cleanError = (name) => {
        switch (name) {
            case 'addEmail':
                setErrorMessageAddEmail('');
                setErrorStyleAddEmail({});
                setCustomerEmail('');
                break;
            case 'sendEmail':
                break;
            default:
                break;
        }
    };

    const showSuccess = (data, message) => {
        MySwal.fire({
            title: '<strong>' + message + '</strong>',
            icon: 'success',
            html: <>
                {data.map((d, i) => {
                    return (
                        <div key={`key-generated-link-${i}`}>
                            <p key={`generated-link-${i}`}>{d.user_email} <input type="text" className="form-control" id={`generated-link-${i}`} readOnly value={d.url} onClick={(e) => copyLink(i)} /></p>
                            <div className="alert alert-success mt-1" id={`alert-generated-link-${i}`} style={{ display: 'none' }}>
                                <div className="alert-body">
                                    ¡Copiado al portapapeles!
                                </div>
                            </div>
                        </div>
                    )
                })}
            </>,
            showCloseButton: true,
            showCancelButton: false,
            showConfirmButton: false,
            focusConfirm: false,
            allowOutsideClick: false
        }).then((result) => {
            handleClose();
        });
    };

    const showFailure = () => {
        Swal.fire(
            'Error',
            'Algo ha salido mal. Intentalo de nuevo mas tarde',
            'error'
        ).then((result) => {
            handleClose();
        })
    };

    const copyLink = (i) => {
        var copyText = document.getElementById(`generated-link-${i}`);
        copyText.focus();
        copyText.select();
        document.execCommand('copy');
        document.getElementById(`alert-generated-link-${i}`).style.display = 'block';
        setTimeout(() => {
            document.getElementById(`alert-generated-link-${i}`).style.display = 'none';
        }, 1500);
    };

    return (
        <>
            <Button variant="secondary" onClick={handleShow}>
                <i className="far fa-link"></i> Generar y enviar enlace a cliente
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Generador de enlace a cliente</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="form-group mt-2">
                        <label className="fw-bold">Enviar por correo a</label>
                        {renderCustomers()}
                    </div>
                    <div className="form-group mt-1">
                        <div className="input-group">
                            <input type="email" className="form-control" placeholder="customer@example.com" onChange={(e) => setCustomerEmail(e.target.value)} value={customerEmail} />
                            <button className="btn btn-outline-primary waves-effect" type="button" data-bs-toggle="tooltip" data-bs-placement="top" title="Add new email" onClick={addNewEmail}>
                                <i className="far fa-plus fa-lg"></i>
                            </button>
                        </div>
                        <div className="invalid-feedback" style={errorStyleAddEmail}>{errorMessageAddEmail}</div>
                    </div>
                </Modal.Body>
                <Modal.Footer className="d-flex justify-content-between">
                    <Button variant="outline-danger" onClick={handleClose}>
                        Cancelar
                    </Button>
                    <Button variant="secondary" onClick={generateLinkToCustomer} disabled={!btnSend}>
                        Generar enlaces
                    </Button>
                    <Button variant="primary" onClick={sendLinkToCustomer} disabled={!btnSend}>
                        Enviar por correo
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}