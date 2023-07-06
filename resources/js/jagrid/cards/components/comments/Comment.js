import { useState, useRef, useEffect, useContext, useMemo, useCallback } from 'react';

import Editor, { createEditorStateWithText } from '@draft-js-plugins/editor';
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';
import createEmojiPlugin from '@draft-js-plugins/emoji';
import createHashtagPlugin from '@draft-js-plugins/hashtag';
import '@draft-js-plugins/emoji/lib/plugin.css';
import '@draft-js-plugins/hashtag/lib/plugin.css';
import '@draft-js-plugins/mention/lib/plugin.css';
import createMentionPlugin, {
    defaultSuggestionsFilter,
} from '@draft-js-plugins/mention';
import axios from 'axios';

import CommentList from './CommentList';
import { account_id, locale, user_role } from '../../utils/viewData';
import Swal from 'sweetalert2';

export default function Comment(props) {

    const { event } = props;

    const [editorState, setEditorState] = useState(createEditorStateWithText(''));

    const [isPrivate, setIsPrivate] = useState(false);

    const [open, setOpen] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [comments, setComments] = useState([]);

    const { MentionSuggestions, EmojiSuggestions, EmojiSelect, plugins } = useMemo(() => {
        const emojiPlugin = createEmojiPlugin();
        const hashtagPlugin = createHashtagPlugin();
        const mentionPlugin = createMentionPlugin();

        const { EmojiSuggestions, EmojiSelect } = emojiPlugin;
        // eslint-disable-next-line no-shadow
        const { MentionSuggestions } = mentionPlugin;
        // eslint-disable-next-line no-shadow
        const plugins = [mentionPlugin, emojiPlugin, hashtagPlugin];
        return { plugins, MentionSuggestions, EmojiSuggestions, EmojiSelect };
    }, []);

    const editor = useRef(null);

    const onOpenChange = useCallback((_open) => {
        setOpen(_open);
    }, []);

    const onSearchChange = useCallback(data => {
        axios.get('/accounts-mentions', { params: { account_id: account_id } })
            .then(function (response) {
                setSuggestions(defaultSuggestionsFilter(data.value, response.data));
            })
            .catch(function (error) {

            })
            .then(function () {

            });
    }, []);

    const onChange = (newEditorState) => {
        setEditorState(newEditorState);
    };

    const focus = () => {
        editor.current.focus();
    };

    useEffect(() => {
        axios.get('/comments', { params: { entity: 'events', entity_id: event.id } })
            .then(function (response) {
                setComments(response.data);
            })
            .catch(function (error) {

            })
            .then(function () {

            });
    }, []);

    const addComment = () => {
        let comment = editorState.getCurrentContent().getPlainText().trim();
        if (comment) {

            comment = JSON.stringify(convertToRaw(editorState.getCurrentContent()));

            axios.post('/comments', {
                data: comment,
                entity: 'events',
                entity_id: event.id,
                account_id: account_id,
                is_private: isPrivate
            })
                .then(function (response) {
                    setComments([...comments, response.data]);
                    setEditorState(createEditorStateWithText(''));
                })
                .catch(function (error) {

                })
                .then(function () {

                });
        }
    };

    const deleteComment = (id) => {
        Swal.fire({
            title: locale.Do_you_want_to_delete_this_comment,
            text: locale.You_wont_be_able_to_revert_this,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: locale.Delete
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`/comments/${id}`)
                    .then(function (response) {
                        setComments(comments.filter(c => c.id != id));
                    })
                    .catch(function (error) {

                    })
                    .then(function () {

                    });
            }
        })
    };

    const renderPrivateOption = () => {
        switch (user_role) {
          case 'owner':
          case 'admin':
          case 'agency':
            return (
              <div className="d-flex justify-content-end my-1">
                <div className="form-check form-check-primary">
                  <input type="checkbox" className="form-check-input" id={`comment-private-event-${event.id}`} onChange={(e) => setIsPrivate(e.target.checked)} />
                  <label className="form-check-label" htmlFor={`comment-private-event-${event.id}`}>{locale.COMMENT_VISIBLE_ONLY_FOR_AGENCY_ROLE}</label>
                </div>
              </div>
            )
          default:
            return (
              <p></p>
            )
        }
      };

    return (
        <>
            <label className="fw-bolder">{locale.COMMENTS}</label>
            <CommentList comments={comments} deleteComment={deleteComment} />
            <div className="editor" onClick={focus}>
                <Editor
                    editorState={editorState}
                    onChange={onChange}
                    plugins={plugins}
                    ref={editor}
                />
                <EmojiSuggestions />
                <MentionSuggestions
                    open={open}
                    onOpenChange={onOpenChange}
                    suggestions={suggestions}
                    onSearchChange={onSearchChange}
                    onAddMention={() => {
                        // get the mention object selected
                    }}
                />
            </div>
            <div className="options">
                <EmojiSelect closeOnEmojiSelect />
            </div>
            {renderPrivateOption()}
            <div className="d-flex justify-content-end">
                <button
                    className="btn btn-success"
                    type="button"
                    onClick={addComment}
                >
                    {locale.ADD_COMMENT}
                </button>
            </div>
        </>
    )
}