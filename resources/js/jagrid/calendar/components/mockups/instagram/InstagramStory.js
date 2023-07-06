import Carousel from 'react-bootstrap/Carousel';
import { account_name } from '../../../utils/utils';

export default function InstagramStory({ files }) {

    const renderItems = () => {
        return files.map((file, index) => {
            return (
                <Carousel.Item key={index}>
                    <div className="instagram-story-editable" style={{ backgroundPosition: "center", backgroundSize: "cover", backgroundRepeat: "no-repeat", backgroundImage: `url(/storage/${file.path})` }}>
                        <img
                            className="d-block w-100 invisible"
                            src="/storage/events/mockups/1080x1920.png"
                            alt=""
                        />
                    </div>
                </Carousel.Item>
            )
        })
    };

    return (
        <div className="instagram-story position-relative mx-auto" style={{ maxWidth: "420px" }}>
            <div className="instagram-story-shadow-top">
                <div className="row align-items-center justify-content-between">
                    <div className="col-10">
                        <img src={`https://ui-avatars.com/api/?name=${account_name}&color=7F9CF5&background=EBF4FF`} width="30" className="img-fluid rounded-pill" alt="" /> &nbsp;
                        <small className="instagram-brand-top text-white">{account_name}</small> &nbsp;
                        <time className="text-white instagram-time-story">21 h</time>
                    </div>
                    <div className="col-2 d-flex justify-content-end">
                        <svg aria-label="Cerrar" className="_8-yf5 " color="#ffffff" fill="#ffffff" height="24"
                            role="img" viewBox="0 0 24 24" width="24">
                            <polyline fill="none" points="20.643 3.357 12 12 3.353 20.647" stroke="currentColor"
                                strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"></polyline>
                            <line fill="none" stroke="currentColor" strokeLinecap="round"
                                strokeLinejoin="round" strokeWidth="3" x1="20.649" x2="3.354" y1="20.649"
                                y2="3.354"></line>
                        </svg>
                    </div>
                </div>

            </div>
            <div className="bottom-controls">
                <div>
                    <input className="form-control rounded-pill" placeholder="Enviar mensaje" />
                </div>
                <div>
                    <img src={'/storage/events/mockups/instagram/me-gusta-light.png'} className="img-fluid mx-1" />
                    <img src={'/storage/events/mockups/instagram/enviar-light.png'} className="img-fluid" />
                </div>
            </div>
            <Carousel>
                {renderItems()}
            </Carousel>
        </div>
    )
}