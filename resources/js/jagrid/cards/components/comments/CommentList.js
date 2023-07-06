import CommentItem from './CommentItem';
import { user_role } from '../../utils/viewData';

export default function CommentList(props) {

    const { comments, deleteComment } = props;

    return (
        <>
            {comments.length > 0 ?
                <div className="chat-widget chat-widget-comment mb-2">
                    <section className="chat-app-window">
                        <div className="user-chats">
                            <div className="chats">
                                {comments.map((comment) => {
                                    switch (user_role) {
                                        case 'owner':
                                        case 'admin':
                                        case 'agency':
                                            return <CommentItem key={comment.id} comment={comment} deleteComment={deleteComment} />
                                        case 'customer':
                                            if (!comment.is_private) {
                                                return <CommentItem key={comment.id} comment={comment} deleteComment={deleteComment} />
                                            }
                                        default:
                                            break;
                                    }
                                })}
                            </div>
                        </div>
                    </section>
                </div>
                : ""}
        </>
    )
}