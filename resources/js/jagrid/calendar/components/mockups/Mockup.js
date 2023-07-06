import { useEffect, useState } from "react";
import { Button, Col, Modal, Row } from "react-bootstrap";
import FacebookStory from "./facebook/FacebookStory";
import FacebookSquare from "./facebook/feed/FacebookSquare";
import InstagramSquare from "./instagram/feed/InstagramSquare";
import InstagramPortrait from "./instagram/feed/InstagramPortrait";
import InstagramLandscape from "./instagram/feed/InstagramLandscape";
import InstagramStory from "./instagram/InstagramStory";
import { useAppState } from "../../contexts/appState";
import { isValidImageFormat } from "../../utils/utils";
import Control from "./Control";

export default function Mockup() {

  const [state, dispatch] = useAppState();

  const { currentEvent } = state.calendar;

  const [show, setShow] = useState(false);
  const [imagesSquare, setImagesSquare] = useState([]);
  const [imagesStory, setImagesStory] = useState([]);
  const [imagesPortrait, setImagesPortrait] = useState([]);
  const [imagesLandscape, setImagesLandscape] = useState([]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    currentEvent.files.map((file) => {
      if (file.type === 'final' && isValidImageFormat(file.format)) {
        const img = new Image();
        img.onload = function () {
          let width = this.width;
          let height = this.height;

          if (width == height) {
            setImagesSquare(prevState => [...prevState, file]);
          } else if (width > height) {
            setImagesLandscape(prevState => [...prevState, file]);
          } else if (width < height) {
            setImagesStory(prevState => [...prevState, file]);
          }
        }
        img.src = `/storage/${file.path}`;
      }
    });
  }, []);

  return (
    <>
      <Button variant="secondary" className="btn-sm" onClick={handleShow}>
        Preview mockups
      </Button>

      <Modal show={show} onHide={handleClose} fullscreen={true}>
        <Modal.Header closeButton>
          <Modal.Title>Mockups</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            {imagesSquare.length > 0 ?
              <>
                <div className="col-md-6 my-4">
                  <div className="row">
                    <div className="col-12">
                      <h1 className="text-center">Instagram Feed</h1>
                    </div>
                    <div className="col-12">
                      <Control cssSelector=".instagram-square-editable" />
                    </div>
                    <div className="col-12">
                      <InstagramSquare files={imagesSquare} />
                    </div>
                  </div>
                </div>
              </> : <></>}
            {imagesStory.length > 0 ?
              <>
                <div className="col-md-6 my-4">
                  <div className="row">
                    <div className="col-12">
                      <h1 className="text-center">Instagram Story</h1>
                    </div>
                    <div className="col-12">
                      <Control cssSelector=".instagram-story-editable" />
                    </div>
                    <div className="col-12">
                      <InstagramStory files={imagesStory} />
                    </div>
                  </div>
                </div>
              </> : <></>}
            {imagesSquare.length > 0 ?
              <>
                <div className="col-md-6 my-4">
                  <div className="row">
                    <div className="col-12">
                      <h1 className="text-center">Facebook Feed</h1>
                    </div>
                    <div className="col-12">
                      <Control cssSelector=".facebook-square-editable" />
                    </div>
                    <div className="col-12">
                      <FacebookSquare files={imagesSquare} />
                    </div>
                  </div>
                </div>
              </> : <></>}
            {imagesStory.length > 0 ?
              <>
                <div className="col-md-6 my-4">
                  <div className="row">
                    <div className="col-12">
                      <h1 className="text-center">Facebook Story</h1>
                    </div>
                    <div className="col-12">
                      <Control cssSelector=".facebook-story-editable" />
                    </div>
                    <div className="col-12">
                      <FacebookStory files={imagesStory} />
                    </div>
                  </div>
                </div>
              </> : <></>}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
            Ok
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}