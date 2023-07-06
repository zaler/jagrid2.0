import { useState, useRef, useMemo, useEffect } from 'react';

import Editor from '@draft-js-plugins/editor';
import { EditorState, convertFromRaw } from 'draft-js';
import createEmojiPlugin from '@draft-js-plugins/emoji';
import createHashtagPlugin from '@draft-js-plugins/hashtag';
import '@draft-js-plugins/emoji/lib/plugin.css';
import '@draft-js-plugins/hashtag/lib/plugin.css';
import '@draft-js-plugins/mention/lib/plugin.css';
import createMentionPlugin from '@draft-js-plugins/mention';
import axios from 'axios';

import { locale, user_id, user_role } from '../../utils/viewData';

export default function CommentItem(props) {

  const { comment, deleteComment } = props;

  const [isPrivate, setIsPrivate] = useState( comment.is_private );
  const [isSolved, setIsSolved] = useState( comment.solved );
  const [saveOnChange, setSaveOnChange] = useState(false);

  const [editorState, setEditorState] = useState(EditorState.createWithContent(convertFromRaw(JSON.parse(comment.data))));

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

  const onChange = (newEditorState) => {
    setEditorState(newEditorState);
  };

  const time = () => {
    var d = new Date(comment.created_at)
    var hoy = new Date()

    var tiempoPasado = hoy - d
    var segs = 1000;
    var mins = segs * 60;
    var hours = mins * 60;
    var days = hours * 24;
    var months = days * 30.416666666666668;
    var years = months * 12;

    //calculo 
    var anos = Math.floor(tiempoPasado / years);

    tiempoPasado = tiempoPasado - (anos * years);
    var meses = Math.floor(tiempoPasado / months)

    tiempoPasado = tiempoPasado - (meses * months);
    var dias = Math.floor(tiempoPasado / days)

    tiempoPasado = tiempoPasado - (dias * days);
    var horas = Math.floor(tiempoPasado / hours)

    tiempoPasado = tiempoPasado - (horas * hours);
    var minutos = Math.floor(tiempoPasado / mins)

    tiempoPasado = tiempoPasado - (minutos * mins);
    var segundos = Math.floor(tiempoPasado / segs)

    if (anos == 0) {
      if (meses == 0) {
        if (dias == 0) {
          if (horas == 0) {
            if (minutos == 0) {
              return `Hace unos segundos`;
            } else {
              return `Hace ${minutos} minutos`;
            }
          } else {
            return `Hace ${horas} horas`;
          }
        } else {
          return `Hace ${dias} dias`;
        }
      } else {
        return `Hace ${meses} meses`;
      }
    } else {
      return `Hace ${anos} años`;
    }
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

    if(e.target.name == 'comment-private'){
      setIsPrivate(e.target.checked);
    }

    if(e.target.name == 'comment-solved'){
      setIsSolved(e.target.checked);
    }

    setSaveOnChange(true);
  };

  useEffect(() => {
    if(saveOnChange){
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

  return (
    <div className={comment.user.id == user_id ? "chat" : "chat-left"}>
      <div className="chat-avatar">
        <span className="avatar box-shadow-1 cursor-pointer">
          <img src={comment.user.profile_photo_url} alt="avatar" height={36} width={36} />
        </span>
      </div>
      <div className="chat-body">
        <div className="chat-content">
          <div className="card mb-0 card-shadow">
            <div className="card-header">
              <h6 className="mb-0">{comment.user.name}</h6>
              {comment.user.id == user_id ?
                <div className="heading-elements">
                  <ul className="list-inline mb-0">
                    <li>
                      <a onClick={() => { deleteComment(comment.id) }}><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></a>
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
              <div className="mt-1"><small>{time()}</small></div>
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
  )
}