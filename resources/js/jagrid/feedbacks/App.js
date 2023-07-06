import React, { useState } from 'react';
import ReactDOM from 'react-dom';

import { Modal, Button } from 'react-bootstrap';

import Form from './components/Form';
import { locale } from './utils/utils';

export default function App() {

    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <Button
                variant="danger"
                onClick={() => {
                    setShowModal(true)
                }}
            >
                {locale.ADD_FEEDBACK}
            </Button>
            <Modal
                show={showModal}
                onHide={() => {
                    setShowModal(false)
                }}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Feedback</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form setShowModal={setShowModal} />
                </Modal.Body>
            </Modal>
        </>
    )
}

if (document.getElementById('feedbacks')) {
    ReactDOM.render(<App />, document.getElementById('feedbacks'));
}