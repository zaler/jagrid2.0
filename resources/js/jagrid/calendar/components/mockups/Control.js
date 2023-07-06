import React from 'react'
import Form from 'react-bootstrap/Form';
import Accordion from 'react-bootstrap/Accordion';
import { useAccordionButton } from 'react-bootstrap/AccordionButton';
import Card from 'react-bootstrap/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';

function CustomToggle({ children, eventKey }) {
    const decoratedOnClick = useAccordionButton(eventKey, () =>
        console.log('totally custom!'),
    );

    return (
        <button
            className="btn mx-auto"
            type="button"
            onClick={decoratedOnClick}
        >
            {children}
        </button>
    );
}

export default function Control({ cssSelector }) {
    const changeBgPosition = (e, position) => {
        let editables = document.querySelectorAll(cssSelector);
        for (let i = 0; i < editables.length; i++) {
            const element = editables[i];
            element.style[position] = e.target.value + '%';
        }
    };

    const changeBgSize = (e) => {
        let editables = document.querySelectorAll(cssSelector);
        for (let i = 0; i < editables.length; i++) {
            const element = editables[i];
            element.style.backgroundSize = Number(e.target.value) * 2 + '%';
        }
    };

    return (
        <div className="mx-auto mb-1" style={{ maxWidth: "420px" }}>
            <Accordion>
                <Card className="m-0 p-0">
                    <Card.Header className="m-0 p-0">
                        <CustomToggle eventKey="0">
                            Edit Sizes <FontAwesomeIcon icon={faCog} />
                        </CustomToggle>
                    </Card.Header>
                    <Accordion.Collapse eventKey="0">
                        <Card.Body className="m-0 p-0">
                            <div>
                                <Form.Label>Zoom</Form.Label>
                                <Form.Range defaultValue={50} onChange={(e) => changeBgSize(e)} />
                            </div>
                            <div>
                                <Form.Label>Left - Right</Form.Label>
                                <Form.Range defaultValue={0} onChange={(e) => changeBgPosition(e, 'backgroundPositionX')} />
                            </div>
                            <div>
                                <Form.Label>Top - Bottom</Form.Label>
                                <Form.Range defaultValue={0} onChange={(e) => changeBgPosition(e, 'backgroundPositionY')} />
                            </div>
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
            </Accordion>
        </div>
    )
}
