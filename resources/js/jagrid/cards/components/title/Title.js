import React, { useState, useRef, useEffect, useContext, useMemo, useCallback } from 'react';
import Editor, { createEditorStateWithText } from '@draft-js-plugins/editor';
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';
import createEmojiPlugin from '@draft-js-plugins/emoji';
import createHashtagPlugin from '@draft-js-plugins/hashtag';
import '@draft-js-plugins/emoji/lib/plugin.css';
import '@draft-js-plugins/hashtag/lib/plugin.css';
import axios from 'axios';

export default function Title(props) {

    const { event } = props;

    const [loaded, setLoaded] = useState(false);
    const [saveOnTyping, setSaveOnTyping] = useState(false);

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
            if (newEditorState.getCurrentContent().getPlainText().trim() !== '') {
                setSaveOnTyping(true);
            }
        }
    };

    const focus = () => {
        editor.current.focus();
    };

    useEffect(() => {
        if (saveOnTyping) {
            const timerId = setTimeout(() => {
                updateEvent();
            }, 1000);

            return () => {
                clearTimeout(timerId);
            };
        }
    }, [editorState]);

    useEffect(() => {
        if (event.title && !loaded) {
            setEditorState(createEditorState(event.title));
            setLoaded(true);
        }
    }, [event.title]);

    const createEditorState = (eventTitle) => {
        let _editorState;

        try {
            _editorState = EditorState.createWithContent(convertFromRaw(JSON.parse(eventTitle)));
        } catch (error) {
            _editorState = createEditorStateWithText(eventTitle);
        }

        return _editorState;
    };

    const updateEvent = () => {
        axios.put('/events/' + event.id, {
            title: JSON.stringify(convertToRaw(editorState.getCurrentContent())),
            start: event.start,
            account_id: event.account_id
        })
            .then(function (response) {

            })
            .catch(function (error) {

            })
            .then(function () {

            });
    };

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