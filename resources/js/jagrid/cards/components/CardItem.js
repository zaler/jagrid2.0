import TagList from './tags/TagList';
import TagFormatList from './tagsFormat/TagFormatList';
import Comment from './comments/Comment';
import IndexList from './indexes/IndexList';
import RichText from './richtext/RichText';
import Status from './status/Status';
import FileList from './files/FileList';
import LinkList from './links/LinkList';
import Title from './title/Title';
import { locale } from '../utils/viewData';
import Start from './start/Start';

export default function CardItem(props) {

    const { event } = props;

    return (
        <div className="col-md-4">
            <div className="card">
                <div className="card-header">
                    <p>{event.user.name}</p>
                    <Start event={event} />
                </div>
                <div className="card-body">
                    <div className="form-group mb-1">
                        <TagList tags={event.tags} />
                        <TagFormatList tagsFormat={event.tags_format} />
                        <IndexList eventIndexes={event.indexes} />
                    </div>
                    <div className="form-group mb-1">
                        <Title event={event} />
                    </div>
                    <div className="form-group mb-1">
                        <RichText event={event} data={event.copy} label={locale.COPY_PUBLICATION} name="copy" />
                    </div>
                    <div className="form-group mb-1">
                        <Status event={event} />
                    </div>
                    <div className="form-group mb-1">
                        <FileList files={event.files} />
                    </div>
                    <div className="form-group mb-1">
                        <LinkList links={event.files} />
                    </div>
                </div>
                <div className="card-footer">
                    <Comment event={event} />
                </div>
            </div>
        </div>
    )
}