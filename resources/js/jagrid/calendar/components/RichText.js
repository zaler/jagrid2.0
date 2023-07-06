import React, { useState, useRef, useEffect, useContext, useMemo, useCallback } from 'react';
import Editor, { createEditorStateWithText } from '@draft-js-plugins/editor';
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';
import createEmojiPlugin from '@draft-js-plugins/emoji';
import createHashtagPlugin from '@draft-js-plugins/hashtag';
import '@draft-js-plugins/emoji/lib/plugin.css';
import '@draft-js-plugins/hashtag/lib/plugin.css';
import { actions, isSingleEvent } from '../utils/utils';
import { useAppState } from '../contexts/appState';

export default function RichText(props) {

  const { name } = props;
  const [state, dispatch] = useAppState();

  const { currentEvent } = state.calendar;

  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  const [wasFirstTime, setWasFirstTime] = useState(false);

  const { EmojiSuggestions, EmojiSelect, plugins } = useMemo(() => {
    const emojiPlugin = createEmojiPlugin();
    const hashtagPlugin = createHashtagPlugin();

    const { EmojiSuggestions, EmojiSelect } = emojiPlugin;

    const plugins = [emojiPlugin, hashtagPlugin];
    return { plugins, EmojiSuggestions, EmojiSelect };
  }, []);

  const editor = useRef(null);

  const onChange = (newEditorState) => {
    setEditorState(newEditorState);
    if (editorState.getCurrentContent().getPlainText() != newEditorState.getCurrentContent().getPlainText()) {
      handleChangeInputEvent({
        name: name,
        value: JSON.stringify(convertToRaw(newEditorState.getCurrentContent()))
      });
    }

  };

  const focus = () => {
    editor.current.focus();
  };

  useEffect(() => {
    if(isSingleEvent){
      setWasFirstTime(true);
    }
  }, []);
  
  useEffect(() => {
    if(isSingleEvent && currentEvent[name] && wasFirstTime){
      setEditorState( EditorState.createWithContent(convertFromRaw(JSON.parse(currentEvent[name]))) );
    }
    return () => {
      setWasFirstTime(false);
    }
  }, [currentEvent[name]]);

  useEffect(() => {
    if (currentEvent[name]) {
      setEditorState(
        EditorState.createWithContent(convertFromRaw(JSON.parse(currentEvent[name])))
      );
    }
  }, []);

  //Dispatch
  function handleChangeInputEvent(data) {
    dispatch({
      type: actions.HANDLE_CHANGE_INPUT_EVENT,
      payload: data
    });
  }

  return (
    <div>
      <div className="editor" onClick={focus}>
        <Editor
          editorState={editorState}
          onChange={onChange}
          plugins={plugins}
          ref={editor}
        />
        <EmojiSuggestions />
      </div>
      <div className="options">
        <EmojiSelect closeOnEmojiSelect />
      </div>
    </div>
  );
}