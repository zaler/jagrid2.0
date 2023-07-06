export default function ObjectiveItem(props) {

    const { objective, handleClick } = props;

    return (
        <div className="row align-items-center mb-1">
            <div className="col-12">
                <a
                    className="d-block fc-event"
                    style={{
                        border: "1px solid rgb(251, 159, 68)",
                        backgroundColor: "rgb(254, 243, 233)",
                        color: "rgb(251, 159, 68)",
                        borderRadius: "3px",
                        padding: ".25rem .5rem",
                        fontSize: ".8rem"
                    }}
                    onClick={() => { handleClick(objective.id) }}
                >
                    {objective.title}
                </a>
            </div>
        </div>
    )
}