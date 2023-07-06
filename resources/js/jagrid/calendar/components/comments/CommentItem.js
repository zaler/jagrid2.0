import React, { useState, useRef, useEffect, useContext, useMemo, useCallback } from 'react';

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
import Swal from 'sweetalert2';
import axios from 'axios';

import { user_id, getSearchParameters, locale, _time, user_role } from '../../utils/utils';
import { useAppState } from '../../contexts/appState';

export default function CommentItem(props) {

  const { comment } = props;

  const [state, dispatch] = useAppState();

  const [isPrivate, setIsPrivate] = useState(comment.is_private);
  const [isSolved, setIsSolved] = useState(comment.solved);
  const [saveOnChange, setSaveOnChange] = useState(false);

  const [editorState, setEditorState] = useState(EditorState.createWithContent(convertFromRaw(JSON.parse(comment.data))));

  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState();

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
    setSuggestions(defaultSuggestionsFilter(data.value, mentions));
  }, []);

  const onChange = (newEditorState) => {
    setEditorState(newEditorState);
  };

  const deleteComment = () => {
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
        axios.delete(`/comments/${comment.id}`)
          .then(function (response) {
            deleteEventComments(comment.id);
          })
          .catch(function (error) {

          })
          .then(function () {

          });
      }
    })
  };

  const updateComment = () => {
    axios.put(`/comments/${comment.id}`, {
      id: comment.id,
      solved: isSolved,
      is_private: isPrivate
    })
      .then(function (response) {

      })
      .catch(function (error) {

      })
      .then(function () {
        setSaveOnChange(false);
      });
  };

  const handleChange = (e) => {

    if (e.target.name == 'comment-private') {
      setIsPrivate(e.target.checked);
    }

    if (e.target.name == 'comment-solved') {
      setIsSolved(e.target.checked);
    }

    setSaveOnChange(true);
  };

  useEffect(() => {
    if (saveOnChange) {
      updateComment();
    }
  }, [saveOnChange]);

  const renderPrivateOption = (comment) => {
    switch (user_role) {
      case 'owner':
      case 'admin':
      case 'agency':
        return (
          <div className="form-check form-check-primary">
            <input type="checkbox" className="form-check-input" name="comment-private" id={`comment-private-${comment.id}`} onChange={handleChange} checked={isPrivate} />
            <label className="form-check-label" htmlFor={`comment-private-${comment.id}`}><small>{locale.COMMENT_VISIBLE_ONLY_FOR_AGENCY_ROLE}</small></label>
          </div>
        )
      default:
        return (
          <p></p>
        )
    }
  };

  //Dispatches
  function deleteEventComments(data) {
    dispatch({
      type: actions.DELETE_EVENT_COMMENTS,
      payload: data
    })
  }

  return (
    <div className={comment.user.id == user_id ? "chat" : "chat-left"}>
      <div className="chat-avatar">
        <span className="avatar box-shadow-1 cursor-pointer">
          <img src={comment.user.profile_photo_url} alt="avatar" height={36} width={36} />
        </span>
      </div>
      <div className="chat-body">
        <div className="chat-content">
          <div className={getSearchParameters().comment == comment.id ? "card bg-primary mb-0" : "card mb-0"}>
            <div className="card-header">
              <h6 className="mb-0">{comment.user.name}</h6>
              {comment.user.id == user_id ?
                <div className="heading-elements">
                  <ul className="list-inline mb-0">
                    <li>
                      <a onClick={deleteComment}><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></a>
                    </li>
                  </ul>
                </div>
                : ""}
            </div>
            <div className="card-body">
              <Editor
                editorState={editorState}
                onChange={onChange}
                plugins={plugins}
                ref={editor}
                readOnly
              />
              <div className="mt-1"><small>{_time(new Date(comment.created_at), new Date())}</small></div>
              {comment.user.id == user_id ?
                <>
                  <div className="mt-1">
                    <div className="form-check form-check-inline">
                      <input className="form-check-input" type="checkbox" name="comment-solved" id={`comment-solved-${comment.id}`} checked={isSolved} onChange={handleChange} />
                      <label className="form-check-label" htmlFor={`comment-solved-${comment.id}`}><small>{locale.SOLVED}</small></label>
                    </div>
                  </div>
                  {renderPrivateOption(comment)}
                </>
                : ""}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}