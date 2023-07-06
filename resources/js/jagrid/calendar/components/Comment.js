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
import axios from 'axios';

import { locale, account_id, user_role, actions } from '../utils/utils';
import CommentList from './comments/CommentList';
import { useAppState } from '../contexts/appState';

export default function Comment() {

  const [state, dispatch] = useAppState();

  const { currentEvent, eventComments } = state.calendar;

  const [isPrivate, setIsPrivate] = useState(false);

  const [editorState, setEditorState] = useState(createEditorStateWithText(''));

  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

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
    //setSuggestions(defaultSuggestionsFilter(data.value, mentions));
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

  const addComment = () => {
    let comment = editorState.getCurrentContent().getPlainText().trim();
    if (comment) {

      comment = JSON.stringify(convertToRaw(editorState.getCurrentContent()));

      axios.post('/comments', {
        data: comment,
        entity: 'events',
        entity_id: currentEvent.id,
        account_id: account_id,
        is_private: isPrivate
      })
        .then(function (response) {
          addEventComments(response.data);
          setEditorState(createEditorStateWithText(''));
        })
        .catch(function (error) {

        })
        .then(function () {

        });
    }
  };

  const renderPrivateOption = () => {
    switch (user_role) {
      case 'owner':
      case 'admin':
      case 'agency':
        return (
          <div className="d-flex justify-content-end my-1">
            <div className="form-check form-check-primary">
              <input type="checkbox" className="form-check-input" id="comment-private" onChange={(e) => setIsPrivate(e.target.checked)} />
              <label className="form-check-label" htmlFor="comment-private">{locale.COMMENT_VISIBLE_ONLY_FOR_AGENCY_ROLE}</label>
            </div>
          </div>
        )
      default:
        return (
          <p></p>
        )
    }
  };

  useEffect(() => {
    if (currentEvent.id) {
      axios.get('/comments', { params: { entity: 'events', entity_id: currentEvent.id } })
        .then(function (response) {
          setEventComments(response.data);
        })
        .catch(function (error) {

        })
        .then(function () {

        });
    }
  }, [currentEvent]);

  //Dispatch
  function setEventComments(data) {
    dispatch({
      type: actions.SET_EVENT_COMMENTS,
      payload: data
    })
  }

  function addEventComments(data) {
    dispatch({
      type: actions.ADD_EVENT_COMMENTS,
      payload: data
    })
  }

  return (
    <div>
      <label className="fw-bolder">{locale.COMMENTS}</label>
      <CommentList comments={eventComments} />
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
    </div>
  );
}