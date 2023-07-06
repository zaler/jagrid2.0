import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';
import Editor, { createEditorStateWithText } from '@draft-js-plugins/editor';
import createMentionPlugin, {
    defaultSuggestionsFilter,
} from '@draft-js-plugins/mention';
import '@draft-js-plugins/mention/lib/plugin.css';

import createEmojiPlugin from '@draft-js-plugins/emoji';
import '@draft-js-plugins/emoji/lib/plugin.css';

import createHashtagPlugin from '@draft-js-plugins/hashtag';
import '@draft-js-plugins/hashtag/lib/plugin.css';
import axios from 'axios';

const mentions = [];

export default function RichText({ event, data, label, name }) {
    const editor = useRef(null);
    const [editorState, setEditorState] = useState(() =>
        createEditorStateWithText('')
    );
    const [open, setOpen] = useState(false);
    const [suggestions, setSuggestions] = useState(mentions);
    const [saveOnTyping, setSaveOnTyping] = useState(false);

    const { MentionSuggestions, plugins, EmojiSuggestions, EmojiSelect } = useMemo(() => {
        const mentionPlugin = createMentionPlugin();
        const emojiPlugin = createEmojiPlugin();
        const hashtagPlugin = createHashtagPlugin();
        // eslint-disable-next-line no-shadow
        const { MentionSuggestions } = mentionPlugin;
        const { EmojiSuggestions, EmojiSelect } = emojiPlugin;
        // eslint-disable-next-line no-shadow
        const plugins = [mentionPlugin, emojiPlugin, hashtagPlugin];
        return { plugins, MentionSuggestions, EmojiSuggestions, EmojiSelect };
    }, []);

    const onOpenChange = useCallback((_open) => {
        setOpen(_open);
    }, []);
    const onSearchChange = useCallback(({ value }) => {
        setSuggestions(defaultSuggestionsFilter(value, mentions));
    }, []);

    const onChange = (newEditorState) => {
        setEditorState(newEditorState);
        if (editorState.getCurrentContent().getPlainText() != newEditorState.getCurrentContent().getPlainText()) {
            if (newEditorState.getCurrentContent().getPlainText().trim() !== '') {
                setSaveOnTyping(true);
            }
        }
    };

    useEffect(() => {
        if (data) {
            setEditorState(EditorState.createWithContent(convertFromRaw(JSON.parse(data))));
        }
    }, []);

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

    const updateEvent = () => {
        axios.put('/events/' + event.id, {
            title: event.title,
            start: event.start,
            account_id: event.account_id,
            [name]: JSON.stringify(convertToRaw(editorState.getCurrentContent()))
        })
            .then(function (response) {

            })
            .catch(function (error) {

            })
            .then(function () {

            });
    };

    return (
        <>
            <label className="fw-bolder">{label}</label>
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
        </>
    );
}