import Carousel from 'react-bootstrap/Carousel'
import SimpleReactLightbox, { SRLWrapper } from 'simple-react-lightbox';

import FileItem from './FileItem';
import { locale } from '../../utils/viewData';

export default function FileList(props) {

    const { files } = props;

    const renderFiles = () => {
        let count = 0;
        let f = [];
        files.map((file, index) => {
            if (file.type == 'final' && file.format != 'link') {
                f.push(
                    <Carousel.Item key={file.id}>
                        <FileItem file={file} index={index} />
                    </Carousel.Item>
                );
                count++;
            }
        });
        if(count > 0){
            return(
                <>
                    <label className="fw-bolder">{locale.FINAL_FILES}</label>
                    <SimpleReactLightbox>
                        <SRLWrapper>
                            <Carousel indicators={false} interval={null}>                    
                                {f}
                            </Carousel>
                        </SRLWrapper>
                    </SimpleReactLightbox>
                </>
            )
        }
        return '';
    };

    return renderFiles();
}