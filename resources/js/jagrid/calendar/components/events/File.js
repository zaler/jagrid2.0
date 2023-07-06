import { useContext, useState } from 'react'
import Dropzone from 'react-dropzone-uploader'
import axios from 'axios'

import { actions } from '../../utils/utils'
import { useAppState } from '../../contexts/appState'

export default function File(props) {

  const { type, format } = props;

  const [state, dispatch] = useAppState();

  const { currentEvent } = state.calendar;

  // specify upload params and url for your files
  const getUploadParams = ({ meta }) => {
    return {
      headers: {
        'X-CSRF-TOKEN': document.querySelectorAll('meta[name="csrf-token"]')[0].getAttribute('content')
      },
      url: '/events-files',
      fields: {
        type: type,
        event_id: currentEvent.id
      }
    }
  }

  // called every time a file's `status` changes
  const handleChangeStatus = ({ meta, file, xhr, remove }, status) => {
    //console.log(status, meta, file, xhr)
    if (status === 'done') {
      let response = JSON.parse(xhr.response);
      addEventFiles(response);
      remove()
    }
  }

  // receives array of files that are done uploading when submit button is clicked
  const handleSubmit = (files, allFiles) => {
    //console.log(files.map(f => f.meta))
    allFiles.forEach(f => {
      f.remove();
    })
  }

  const [link, setLink] = useState('');

  const addEventLink = (e) => {
    if (e.key === 'Enter') {
      axios.post('/events-files', {
        event_id: currentEvent.id,
        type: type,
        format: 'link',
        link: link
      })
        .then(function (response) {
          addEventFiles(response.data);
          setLink('');
        })
        .catch(function (error) {

        })
        .then(function () {

        });
    }
  };

  //Dispatch
  function addEventFiles(data) {
    dispatch({
      type: actions.ADD_EVENT_FILES,
      payload: data
    })
  }

  return (
    <div>
      {format == "link" ?
        <input type="text" className="form-control" value={link} onChange={(e) => { setLink(e.target.value) }} onKeyUp={(e) => { addEventLink(e) }} />
        :
        <Dropzone
          getUploadParams={getUploadParams}
          onChangeStatus={handleChangeStatus}
          onSubmit={handleSubmit}
          accept="image/*,audio/*,video/*"
          inputContent={"Arrastra archivos para subirlos"}
          inputWithFilesContent={"Añadir más archivos"}
          submitButtonContent={"Subir archivos"}
        />
      }
    </div>
  )
}