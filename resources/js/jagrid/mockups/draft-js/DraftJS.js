import {
    useCallback,
    useMemo,
    useRef,
    useState,
} from 'react';
import Editor, { createEditorStateWithText } from '@draft-js-plugins/editor';
import createMentionPlugin, {
    defaultSuggestionsFilter,
} from '@draft-js-plugins/mention';
import '@draft-js-plugins/mention/lib/plugin.css';

import createEmojiPlugin from '@draft-js-plugins/emoji';
import '@draft-js-plugins/emoji/lib/plugin.css';

import createHashtagPlugin from '@draft-js-plugins/hashtag';
import '@draft-js-plugins/hashtag/lib/plugin.css';

const mentions = [
    {
        name: 'Matthew Russell',
        link: 'https://twitter.com/mrussell247',
        avatar:
            'https://pbs.twimg.com/profile_images/517863945/mattsailing_400x400.jpg',
    },
    {
        name: 'Julian Krispel-Samsel',
        link: 'https://twitter.com/juliandoesstuff',
        avatar: 'https://avatars2.githubusercontent.com/u/1188186?v=3&s=400',
    },
    {
        name: 'Jyoti Puri',
        link: 'https://twitter.com/jyopur',
        avatar: 'https://avatars0.githubusercontent.com/u/2182307?v=3&s=400',
    },
    {
        name: 'Max Stoiber',
        link: 'https://twitter.com/mxstbr',
        avatar: 'https://avatars0.githubusercontent.com/u/7525670?s=200&v=4',
    },
    {
        name: 'Nik Graf',
        link: 'https://twitter.com/nikgraf',
        avatar: 'https://avatars0.githubusercontent.com/u/223045?v=3&s=400',
    },
    {
        name: 'Pascal Brandt',
        link: 'https://twitter.com/psbrandt',
        avatar:
            'https://pbs.twimg.com/profile_images/688487813025640448/E6O6I011_400x400.png',
    },
];

const text =  `Cool, we can have all sorts of Emojis here. 🙌🌿☃️🎉🙈 aaaand maybe a few more here 🐲☀️🗻 Quite fun! Cool, we can have all sorts of Emojis here. 🙌🌿☃️🎉🙈 aaaand maybe a few more here 🐲☀️🗻 Quite fun!`;

export default function DraftJS() {

    const ref = useRef(null);
    const [editorState, setEditorState] = useState(() =>
        createEditorStateWithText(text)
    );
    const [open, setOpen] = useState(false);
    const [suggestions, setSuggestions] = useState(mentions);

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


    return (
        <div className="py-1">
            <Editor
                editorKey={'editor'}
                editorState={editorState}
                onChange={setEditorState}
                plugins={plugins}
                ref={ref}
            />
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
    );
}