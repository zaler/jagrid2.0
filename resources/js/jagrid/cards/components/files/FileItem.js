import { base_url } from '../../utils/viewData';

export default function FileItem(props) {

    const { file, index } = props;

    const renderFile = () => {
        return `${base_url}/storage/${file.path}`;
    };

    return (
        <div>
            <img src={renderFile()} className="img-fluid" />
        </div>
    )
}