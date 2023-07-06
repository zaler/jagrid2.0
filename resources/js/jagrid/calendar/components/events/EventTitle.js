import React, { useState, useRef, useEffect, useContext, useMemo, useCallback } from 'react';
import Editor, { createEditorStateWithText } from '@draft-js-plugins/editor';
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';
import createEmojiPlugin from '@draft-js-plugins/emoji';
import createHashtagPlugin from '@draft-js-plugins/hashtag';
import '@draft-js-plugins/emoji/lib/plugin.css';
import '@draft-js-plugins/hashtag/lib/plugin.css';
import { useAppState } from '../../contexts/appState';
import { actions } from '../../utils/utils';

export default function EventTitle() {

    const [state, dispatch] = useAppState();

    const { currentEvent } = state.calendar;

    const [loaded, setLoaded] = useState(false);

    const [editorState, setEditorState] = useState(EditorState.createEmpty());

    const { EmojiSuggestions, EmojiSelect, plugins } = useMemo(() => {
        const emojiPlugin = createEmojiPlugin();
        const hashtagPlugin = createHashtagPlugin();

        const { EmojiSuggestions, EmojiSelect } = emojiPlugin;

        const plugins = [emojiPlugin, hashtagPlugin];
        return { EmojiSuggestions, EmojiSelect, plugins };
    }, []);

    const editor = useRef(null);

    const onChange = (newEditorState) => {
        setEditorState(newEditorState);
        if (editorState.getCurrentContent().getPlainText() != newEditorState.getCurrentContent().getPlainText()) {
            if(newEditorState.getCurrentContent().getPlainText().trim() !== ''){
                handleChangeInputEvent({
                    name: 'title',
                    value: JSON.stringify(convertToRaw(newEditorState.getCurrentContent()))
                });
            }
        }
    };

    const focus = () => {
        editor.current.focus();
    };

    useEffect(() => {
        if (currentEvent.title && !loaded) {
            setEditorState(createEditorState(currentEvent.title));
            setLoaded(true);
        }
    }, [currentEvent.title]);

    const createEditorState = (eventTitle) => {
        let _editorState;

        try {
            _editorState = EditorState.createWithContent(convertFromRaw(JSON.parse(eventTitle)));
        } catch (error) {
            _editorState = createEditorStateWithText(eventTitle);
        }

        return _editorState;
    };

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
    )
}