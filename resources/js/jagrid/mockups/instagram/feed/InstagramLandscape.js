import Carousel from 'react-bootstrap/Carousel';
import DraftJS from '../../draft-js/DraftJS';

export default function InstagramLandscape() {

    const account_name = "Cuenta1";

    return (
        <div className="instagram-feed-landscape" style={{ maxWidth: "420px" }}>
            <div className="mx-auto">
                <div className="card pb-1 mb-0">
                    <div className="card-body p-0">
                        <div className="row align-items-center justify-content-between">
                            <div className="col-10">
                                <img src={`https://ui-avatars.com/api/?name=${account_name}&color=7F9CF5&background=EBF4FF`} width="30" className="img-fluid rounded-pill" alt="" />
                                &nbsp;
                                <small className="instagram-brand-top">{account_name}</small>
                            </div>
                            <div className="col-2 d-flex justify-content-end">
                                <svg aria-label="Más opciones" className="_8-yf5 " color="#262626" fill="#262626" height={24} role="img" viewBox="0 0 24 24" width={24}>
                                    <circle cx={12} cy={12} r="1.5" />
                                    <circle cx={6} cy={12} r="1.5" />
                                    <circle cx={18} cy={12} r="1.5" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <Carousel>
                            <Carousel.Item>
                                <div style={{ backgroundSize: "cover", backgroundRepeat: "no-repeat", backgroundImage: `url(https://jagrid.io/storage/events/final/K7G8tYU0nGgAa345uf2WRczv9zw40ziuSvWD3s5z.jpg)` }}>
                                    <img
                                        className="d-block w-100 invisible"
                                        src="/storage/events/mockups/1920x1080.png"
                                        alt=""
                                    />
                                </div>
                            </Carousel.Item>
                            <Carousel.Item>
                                <div style={{ backgroundSize: "cover", backgroundRepeat: "no-repeat", backgroundImage: `url(https://jagrid.io/storage/events/final/K7G8tYU0nGgAa345uf2WRczv9zw40ziuSvWD3s5z.jpg)` }}>
                                    <img
                                        className="d-block w-100 invisible"
                                        src="/storage/events/mockups/1920x1080.png"
                                        alt=""
                                    />
                                </div>
                            </Carousel.Item>
                            <Carousel.Item>
                                <div style={{ backgroundSize: "cover", backgroundRepeat: "no-repeat", backgroundImage: `url(https://jagrid.io/storage/events/final/K7G8tYU0nGgAa345uf2WRczv9zw40ziuSvWD3s5z.jpg)` }}>
                                    <img
                                        className="d-block w-100 invisible"
                                        src="/storage/events/mockups/1920x1080.png"
                                        alt=""
                                    />
                                </div>
                            </Carousel.Item>
                        </Carousel>
                    </div>
                </div>
                <div className="card">
                    <div className="card-body px-0 py-2">
                        <div className="row align-items-center justify-content-between">
                            <div className="col">
                                <div style={{ float: 'left', paddingRight: '10px' }}>
                                    <svg aria-label="Me gusta" className="_8-yf5 " color="#262626" fill="#262626" height={24} role="img" viewBox="0 0 24 24" width={24}>
                                        <path d="M16.792 3.904A4.989 4.989 0 0121.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 014.708-5.218 4.21 4.21 0 013.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 013.679-1.938m0-2a6.04 6.04 0 00-4.797 2.127 6.052 6.052 0 00-4.787-2.127A6.985 6.985 0 00.5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 003.518 3.018 2 2 0 002.174 0 45.263 45.263 0 003.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 00-6.708-7.218z">
                                        </path>
                                    </svg>
                                </div>
                                <div style={{ float: 'left', paddingRight: '10px' }}>
                                    <svg aria-label="Comentar" className="_8-yf5 " color="#262626" fill="#262626" height={24} role="img" viewBox="0 0 24 24" width={24}>
                                        <path d="M20.656 17.008a9.993 9.993 0 10-3.59 3.615L22 22z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth={2} />
                                    </svg>
                                </div>
                                <div style={{ float: 'left', paddingRight: '10px' }}>
                                    <svg aria-label="Compartir publicación" className="_8-yf5 " color="#262626" fill="#262626" height={24} role="img" viewBox="0 0 24 24" width={24}>
                                        <line fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth={2} x1={22} x2="9.218" y1={3} y2="10.083" />
                                        <polygon fill="none" points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334" stroke="currentColor" strokeLinejoin="round" strokeWidth={2}>
                                        </polygon>
                                    </svg>
                                </div>
                            </div>
                            <div className="col d-flex justify-content-end">
                                <svg aria-label="Guardar" className="_8-yf5 " color="#262626" fill="#262626" height={24} role="img" viewBox="0 0 24 24" width={24}>
                                    <polygon fill="none" points="20 21 12 13.44 4 21 4 3 20 3 20 21" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                                </svg>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col pt-1">
                                <DraftJS />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}