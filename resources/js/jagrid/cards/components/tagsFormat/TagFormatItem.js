export default function TagFormatItem(props){

    const { tagFormat } = props;

    return(
        <img src={tagFormat.icon} width={24} style={{marginRight: "2px"}} />
    )
}