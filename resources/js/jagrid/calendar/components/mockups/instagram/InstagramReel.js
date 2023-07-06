import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Carousel from 'react-bootstrap/Carousel';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis, faSquare, faMusic } from '@fortawesome/free-solid-svg-icons';

import iconCameraLight from '../../icons/camera-light.png';
import iconMeGustaLight from '../../icons/me-gusta-light.png';
import iconCommentLight from '../../icons/comment-light.png';
import iconEnviarLight from '../../icons/enviar-light.png';

import video from '../../videos/video.mp4';

export default function Reel() {
    return (
        <div className="instagram-reel text-white">
            <div className="marvel-device iphone8 black">
                <div className="top-bar"></div>
                <div className="sleep"></div>
                <div className="volume"></div>
                <div className="camera"></div>
                <div className="sensor"></div>
                <div className="speaker"></div>
                <div className="screen">
                    <Row className="row align-items-center top-controls">
                        <Col className="p-0">
                            <h5 className="mb-0">Reels</h5>
                        </Col>
                    </Row>
                    <div className="bar-right-top">
                        <img src={iconCameraLight} className="img-fluid" />
                    </div>
                    <div className="bar-right-bottom pb-2">
                        <div>
                            <img src={iconMeGustaLight} className="img-fluid" />
                            <p>127k</p>
                        </div>
                        <div>
                            <img src={iconCommentLight} className="img-fluid" />
                            <p>263k</p>
                        </div>
                        <div>
                            <img src={iconEnviarLight} className="img-fluid" />
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
                                <small>@lorem_ipsum_dolor93</small>
                            </Col>
                            <Col sm={12}>
                                <small>Lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500, cuando un impresor (N. del T. persona que se dedica a la imprenta) desconocido usó una galería de textos y los mezcló de tal manera que logró hacer un libro de textos especimen. No sólo sobrevivió 500 años, sino que tambien ingresó como texto de relleno en documentos electrónicos, quedando esencialmente igual al original. Fue popularizado en los 60s con la creación de las hojas "Letraset", las cuales contenian pasajes de Lorem Ipsum, y más recientemente con software de autoedición, como por ejemplo Aldus PageMaker, el cual incluye versiones de Lorem Ipsum.</small>
                            </Col>
                            <Col sm={12}>
                                <small><FontAwesomeIcon icon={faMusic} /> Playlist lorem ipsum</small>
                            </Col>
                        </Row>
                    </div>
                    <Carousel controls={false} indicators={false}>
                        <Carousel.Item>
                            <video src={video} width="100%" controls autoplay={true} />
                        </Carousel.Item>
                    </Carousel>
                </div>
                <div className="home"></div>
                <div className="bottom-bar"></div>
            </div>
        </div>
    )
}