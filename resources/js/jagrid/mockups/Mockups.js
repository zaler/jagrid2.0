import React from 'react'
import ReactDOM from 'react-dom'
import FacebookStory from './facebook/FacebookStory';
import FacebookSquare from './facebook/feed/FacebookSquare';
import InstagramStory from './instagram/InstagramStory';
import InstagramPortrait from './instagram/feed/InstagramPortrait';
import InstagramLandscape from './instagram/feed/InstagramLandscape';
import InstagramSquare from './instagram/feed/InstagramSquare';

export default function Mockups() {
    return (
        <div className="row">
            <div className="col-md-4">
                <InstagramLandscape />
            </div>
            <div className="col-md-4">
                <InstagramSquare />
            </div>
            <div className="col-md-4">
                <InstagramPortrait />
            </div>
            <div className="col-md-4">
                <InstagramStory />
            </div>
            <div className="col-md-4">
                <FacebookSquare />
            </div>
            <div className="col-md-4">
                <FacebookStory />
            </div>
        </div>
    )
}

if (document.getElementById('mockups')) {
    ReactDOM.render(<Mockups />, document.getElementById('mockups'));
}