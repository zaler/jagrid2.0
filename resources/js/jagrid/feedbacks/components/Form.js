import { useState } from 'react';

import axios from 'axios';
import Dropzone from 'react-dropzone-uploader';
import Swal from 'sweetalert2';

import { locale } from '../utils/utils';

export default function Form(props) {

    const { setShowModal } = props;

    const [description, setDescription] = useState('');
    const [uploadFile, setUploadFile] = useState(false);

    const handleChangeStatus = ({ meta }, status) => {
        //console.log(status, meta)
    }

    const handleSubmit = (files, allFiles) => {
        //console.log(files.map(f => f.meta))
        allFiles.forEach(f => f.remove())

        var data = new FormData();
        data.append('description', description);
        files.map(f => data.append('files[]', f.file))
    
        const config = { headers: { 'Content-Type': 'multipart/form-data' } };
    
        axios.post('/feedbacks', data, config)
        .then(function (res) {
            setDescription('');
            Swal.fire({
                icon: 'success',
                text: locale.FEEDBACK_SUCCESS,
            }).then(() => {
                setShowModal(false);
            });
        })
        .catch(function (err) {

        });
    }

    const isForUploadFile = (e) => {
        setUploadFile(e.target.checked);
    };

    const saveFeedback = () => {

        var data = new FormData();
        data.append('description', description);

        const config = { headers: { 'Content-Type': 'multipart/form-data' } };
    
        axios.post('/feedbacks', data, config)
        .then(function (res) {
            setDescription('');
            Swal.fire({
                icon: 'success',
                text: locale.FEEDBACK_SUCCESS,
            }).then(() => {
                setShowModal(false);
            });
        })
        .catch(function (err) {

        });
    };

    return (
        <>
            <form>
                <div className="form-group mb-1">
                    <label className="fw-bolder">{locale.DESCRIPTION}</label>
                    <textarea className="form-control" value={description} onChange={(e) => { setDescription(e.target.value) }}></textarea>
                </div>
                <div className="form-group mb-1">
                    <div className="form-check form-check-primary">
                        <input type="checkbox" className="form-check-input" name="uploadFile" id="uploadFile" onChange={isForUploadFile} checked={uploadFile}/>
                        <label className="form-check-label" htmlFor="uploadFile">{locale.SCREENSHOT}</label>
                    </div>
                </div>
                {uploadFile ?
                    <div className="form-group mb-1">
                        <label className="fw-bolder">{locale.SCREENSHOT}</label>
                        <Dropzone
                            onChangeStatus={handleChangeStatus}
                            onSubmit={handleSubmit}
                            inputContent={locale.DRAG_LABEL}
                            inputWithFilesContent={locale.ADD_MORE_FILES}
                            submitButtonContent={locale.SEND}
                        />
                    </div>
                : ''}
                {!uploadFile ?
                    <div className="form-group d-flex justify-content-center mb-1">
                        <button type="button" className="dzu-submitButton" onClick={saveFeedback}>Enviar</button>
                    </div>
                : ''}            
            </form>
        </>
    )
}