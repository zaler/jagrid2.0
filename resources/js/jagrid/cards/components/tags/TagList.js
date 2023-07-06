import TagItem from './TagItem';

export default function TagList(props){

    const { tags } = props;

    return(
        <>
            {tags.map((tag) => <TagItem key={tag.id} tag={tag} />)}
        </>
    )
}