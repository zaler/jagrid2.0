import TagFormatItem from './TagFormatItem';

export default function TagFormatList(props){

    const { tagsFormat } = props;

    return(
        <>
            {tagsFormat.map((tagFormat) => <TagFormatItem key={tagFormat.id} tagFormat={tagFormat} />)}
        </>
    )
}