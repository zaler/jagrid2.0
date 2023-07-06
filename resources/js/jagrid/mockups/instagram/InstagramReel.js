import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Carousel from 'react-bootstrap/Carousel';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis, faSquare, faMusic } from '@fortawesome/free-solid-svg-icons';
import DraftJS from '../draft-js/DraftJS';

export default function InstagramReel() {

    const account_name = "Cuenta1";
    
    return (
        <div className="instagram-reel text-white position-relative">
            <Row className="row align-items-center top-controls">
                <Col className="p-0">
                    <h5 className="mb-0">Reels</h5>
                </Col>
            </Row>
            <div className="bar-right-top">
                <img src={'/storage/events/mockups/instagram/camera-light.png'} className="img-fluid" />
            </div>
            <div className="bar-right-bottom pb-2">
                <div>
                    <img src={'/storage/events/mockups/instagram/me-gusta-light.png'} className="img-fluid" />
                    <p>127k</p>
                </div>
                <div>
                    <img src={'/storage/events/mockups/instagram/comment-light.png'} className="img-fluid" />
                    <p>263k</p>
                </div>
                <div>
                    <img src={'/storage/events/mockups/instagram/enviar-light.png'} className="img-fluid" />
                </div>
                <div>
                    <FontAwesomeIcon icon={faEllipsis} className="fa-lg pt-3 pb-5 mb-5" />
                </div>
                <div>
                    <FontAwesomeIcon icon={faSquare} className="fa-2x" />
                </div>
            </div>
            <div className="bottom-controls pb-2">
                <Row>
                    <Col sm={12}>
                        <small>{account_name}</small>
                    </Col>
                    <Col sm={12}>
                        <DraftJS />
                    </Col>
                    <Col sm={12}>
                        <small><FontAwesomeIcon icon={faMusic} /> Playlist lorem ipsum</small>
                    </Col>
                </Row>
            </div>
            <Carousel controls={false} indicators={false}>
                <Carousel.Item>
                    <div style={{ backgroundSize: "cover", backgroundRepeat: "no-repeat", backgroundImage: `url(https://jagrid.io/storage/events/final/K7G8tYU0nGgAa345uf2WRczv9zw40ziuSvWD3s5z.jpg)` }}>
                        <img
                            className="d-block w-100 invisible"
                            src="https://via.placeholder.com/1080x1920"
                            alt="First slide"
                        />
                    </div>
                </Carousel.Item>
            </Carousel>
        </div>
    )
}