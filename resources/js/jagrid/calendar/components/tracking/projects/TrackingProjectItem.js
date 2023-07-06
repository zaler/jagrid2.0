export default function TrackingProjectItem(props) {

    const { project, time } = props;

    return (
        <tr>
            <td>{project.title}</td>
            <td>{project.start}</td>
            <td>{project.end}</td>
            <td>{time}</td>
        </tr>
    )
}