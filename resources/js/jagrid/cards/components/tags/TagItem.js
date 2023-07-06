export default function TagItem(props){

    const { tag } = props;

    return(
        <img src={tag.icon} width={24} style={{marginRight: "2px"}} />
    )
}