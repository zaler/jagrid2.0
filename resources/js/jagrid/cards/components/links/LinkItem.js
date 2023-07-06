export default function LinkItem(props){

    const { link } = props;

    return <a className="list-group-item list-group-item-action" href={link.path} target="_blank">{link.path}</a>
}