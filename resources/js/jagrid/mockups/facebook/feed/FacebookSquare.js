import Carousel from 'react-bootstrap/Carousel';
import DraftJS from '../../draft-js/DraftJS';

export default function FacebookSquare() {

    const account_name = 'Cuenta1';

    return (
        <div className="instagram-feed-square" style={{ maxWidth: "420px" }}>
            <div className="mx-auto">
                <div className="card mb-0">
                    <div className="card-body p-0">
                        <div className="row align-items-center justify-content-between">
                            <div className="col">
                                <img src={`https://ui-avatars.com/api/?name=${account_name}&color=7F9CF5&background=EBF4FF`} width="30" className="img-fluid rounded-pill" alt="" />
                                &nbsp;
                                <small className="instagram-brand-top">{account_name}</small>
                            </div>
                            <div className="col d-flex justify-content-end">
                                <svg aria-label="Más opciones" className="_8-yf5 " color="#262626" fill="#262626" height={24} role="img" viewBox="0 0 24 24" width={24}>
                                    <circle cx={12} cy={12} r="1.5" />
                                    <circle cx={6} cy={12} r="1.5" />
                                    <circle cx={18} cy={12} r="1.5" />
                                </svg>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <DraftJS />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <Carousel indicators={false}>
                            <Carousel.Item>
                                <div style={{ backgroundSize: "100%", backgroundRepeat: "no-repeat", backgroundImage: `url(https://jagrid.io/storage/events/final/K7G8tYU0nGgAa345uf2WRczv9zw40ziuSvWD3s5z.jpg)` }}>
                                    <img
                                        className="d-block w-100 invisible"
                                        src="/storage/events/mockups/1080x1080.png"
                                        alt=""
                                    />
                                </div>
                            </Carousel.Item>
                            <Carousel.Item>
                                <div style={{ backgroundSize: "100%", backgroundRepeat: "no-repeat", backgroundImage: `url(https://jagrid.io/storage/events/final/K7G8tYU0nGgAa345uf2WRczv9zw40ziuSvWD3s5z.jpg)` }}>
                                    <img
                                        className="d-block w-100 invisible"
                                        src="/storage/events/mockups/1080x1080.png"
                                        alt=""
                                    />
                                </div>
                            </Carousel.Item>
                            <Carousel.Item>
                                <div style={{ backgroundSize: "100%", backgroundRepeat: "no-repeat", backgroundImage: `url(https://jagrid.io/storage/events/final/K7G8tYU0nGgAa345uf2WRczv9zw40ziuSvWD3s5z.jpg)` }}>
                                    <img
                                        className="d-block w-100 invisible"
                                        src="/storage/events/mockups/1080x1080.png"
                                        alt=""
                                    />
                                </div>
                            </Carousel.Item>
                        </Carousel>
                    </div>
                </div>
                <div className="card">
                    <div className="card-body p-0">
                        <div className="d-flex align-items-center justify-content-between border-top pt-1 pb-1">
                            <div className="facebook-emojis">
                                <img src="/storage/events/mockups/emojis/like.svg" width="20" />
                                <img src="/storage/events/mockups/emojis/heart.svg" width="20" />
                                <img src="/storage/events/mockups/emojis/emoji.svg" width="20" />
                            </div>
                            <div className="facebook-emojis d-flex justify-content-end">
                                <p className="mb-0">2 comentarios</p>
                            </div>
                        </div>
                        <div className="d-flex align-items-center justify-content-between border-top pt-1 pb-1">
                            <div className="d-flex align-items-center justify-content-start facebook-actions">
                                <i className="me-gusta" /><p className="mb-0">Me gusta</p>
                            </div>
                            <div className="d-flex align-items-center justify-content-center facebook-actions">
                                <i className="comentar" /><p className="mb-0">Comentar</p>
                            </div>
                            <div className="d-flex align-items-center justify-content-end facebook-actions">
                                <i className="compartir" /><p className="mb-0">Compartir</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}