import { ES, EN } from './locale';

export const actions = {
  SET_EVENTS: 'SET_EVENTS',
  SET_CURRENT_EVENT: 'SET_CURRENT_EVENT',
  SET_TYPE_EVENT_ACTION: 'SET_TYPE_EVENT_ACTION',
  IS_NEW_EVENT: 'IS_NEW_EVENT',
  IS_EXISTING_EVENT: 'IS_EXISTING_EVENT',
  IS_DELETE_EVENT: 'IS_DELETE_EVENT',
  CALLBACK_AFTER_ADD_EVENT: 'CALLBACK_AFTER_ADD_EVENT',
  CALLBACK_AFTER_UPDATE_EVENT: 'CALLBACK_AFTER_UPDATE_EVENT',
  SET_ERRORS_EVENT: 'SET_ERRORS_EVENT',
  RESET_DATA: 'RESET_DATA',
  SET_EVENT_TYPES: 'SET_EVENT_TYPES',
  ADD_EVENT_FILES: 'ADD_EVENT_FILES',
  DELETE_EVENT_FILE: 'DELETE_EVENT_FILE',
  DELETE_EVENT: 'DELETE_EVENT',
  ADD_EVENT_TAG: 'ADD_EVENT_TAG',
  DELETE_EVENT_TAG: 'DELETE_EVENT_TAG',
  ADD_EVENT_TAG_FORMAT: 'ADD_EVENT_TAG_FORMAT',
  DELETE_EVENT_TAG_FORMAT: 'DELETE_EVENT_TAG_FORMAT',
  SET_TAGS_FORMAT: 'SET_TAGS_FORMAT',
  ADD_FILTER_TAG_FORMAT: 'ADD_FILTER_TAG_FORMAT',
  DELETE_FILTER_TAG_FORMAT: 'DELETE_FILTER_TAG_FORMAT',
  SET_EVENT_STATUSES: 'SET_EVENT_STATUSES',
  SET_EXTERNAL_EVENTS: 'SET_EXTERNAL_EVENTS',
  ADD_EXTERNAL_EVENT: 'ADD_EXTERNAL_EVENT',
  DELETE_EXTERNAL_EVENT: 'DELETE_EXTERNAL_EVENT',
  SET_SAVE_ON_TYPING: 'SET_SAVE_ON_TYPING',
  SET_INDEX_EVENTS: 'SET_INDEX_EVENTS',
  ADD_INDEX_EVENT: 'ADD_INDEX_EVENT',
  DELETE_INDEX_EVENT: 'DELETE_INDEX_EVENT',
  ADD_INDEX_TO_EVENT: 'ADD_INDEX_TO_EVENT',
  DELETE_INDEX_FROM_EVENT: 'DELETE_INDEX_FROM_EVENT',
  ADD_FILTER_EVENT_TYPES: 'ADD_FILTER_EVENT_TYPES',
  ADD_FILTER_EVENT_STATUSES: 'ADD_FILTER_EVENT_STATUSES',
  DELETE_FILTER_EVENT_TYPES: 'DELETE_FILTER_EVENT_TYPES',
  DELETE_FILTER_EVENT_STATUSES: 'DELETE_FILTER_EVENT_STATUSES',
  SET_FILTER_START_DATE: 'SET_FILTER_START_DATE',
  SET_FILTER_END_DATE: 'SET_FILTER_END_DATE',
  ADD_FILTER_INDEXES: 'ADD_FILTER_INDEXES',
  DELETE_FILTER_INDEXES: 'DELETE_FILTER_INDEXES',
  ADD_FILTER_EXTERNAL_EVENT: 'ADD_FILTER_EXTERNAL_EVENT',
  DELETE_FILTER_EXTERNAL_EVENT: 'DELETE_FILTER_EXTERNAL_EVENT',
  ADD_FILTER_CALENDARS: 'ADD_FILTER_CALENDARS',
  DELETE_FILTER_CALENDARS: 'DELETE_FILTER_CALENDARS',
  SET_EVENT_COMMENTS: 'SET_EVENT_COMMENTS',
  ADD_EVENT_COMMENTS: 'ADD_EVENT_COMMENTS',
  DELETE_EVENT_COMMENTS: 'DELETE_EVENT_COMMENTS',
  SET_SOLVED_COMMENT: 'SET_SOLVED_COMMENT',
  ADD_SELECTED_EVENTS: 'ADD_SELECTED_EVENTS',
  DELETE_SELECTED_EVENTS: 'DELETE_SELECTED_EVENTS',
  MASS_CHANGE_EVENT_DATES: 'MASS_CHANGE_EVENT_DATES',
  SET_ACCOUNTS_USER: 'SET_ACCOUNTS_USER',
  SET_RECURRENT_EVENT: 'SET_RECURRENT_EVENT',
  SET_CURRENT_EVENT_DATES: 'SET_CURRENT_EVENT_DATES',
  SET_OBJECTIVES: 'SET_OBJECTIVES',
  ADD_OBJECTIVE: 'ADD_OBJECTIVE',
  DELETE_OBJECTIVE: 'DELETE_OBJECTIVE',
  SET_CURRENT_START_DATE: 'SET_CURRENT_START_DATE',
  SET_CURRENT_END_DATE: 'SET_CURRENT_END_DATE'
};

export const plainObjectEvent = (value) => {
  if (value) {
    if (value.extendedProps) {
      return {
        id: value.id ? value.id : '',
        title: value.title ? value.title : '',
        start: value.startStr ? value.startStr : '',
        end: value.endStr ? value.endStr : '',
        allDay: value.allDay ? value.allDay : '',
        url: value.url ? value.url : '',
        description: value.extendedProps.description ? value.extendedProps.description : '',
        event_type_id: value.extendedProps.event_type_id ? value.extendedProps.event_type_id : '',
        objective: value.extendedProps.objective ? value.extendedProps.objective : '',
        copy: value.extendedProps.copy ? value.extendedProps.copy : '',
        copy_image: value.extendedProps.copy_image ? value.extendedProps.copy_image : '',
        instructions: value.extendedProps.instructions ? value.extendedProps.instructions : '',
        files: value.extendedProps.files ? value.extendedProps.files : [],
        tags: value.extendedProps.tags ? value.extendedProps.tags : [],
        tags_format: value.extendedProps.tags_format ? value.extendedProps.tags_format : [],
        event_status_id: value.extendedProps.event_status_id ? value.extendedProps.event_status_id : '',
        isIndex: value.extendedProps.isIndex ? value.extendedProps.isIndex : '',
        indexes: value.extendedProps.indexes ? value.extendedProps.indexes.split(',') : [],
        isExternalEvent: value.extendedProps.isExternalEvent ? value.extendedProps.isExternalEvent : '',
        external_event_id: value.extendedProps.external_event_id ? value.extendedProps.external_event_id : '',
        accounts: value.extendedProps.accounts ? value.extendedProps.accounts : '',
        is_recurrent: value.extendedProps.is_recurrent ? value.extendedProps.is_recurrent : '',
        created_at: value.extendedProps.created_at ? value.extendedProps.created_at : '',
        updated_at: value.extendedProps.updated_at ? value.extendedProps.updated_at : ''
      }
    }
    return {
      id: value.id ? value.id : '',
      title: value.title ? value.title : '',
      start: value.start ? value.start : '',
      end: value.end ? value.end : '',
      allDay: value.allDay ? value.allDay : '',
      url: value.url ? value.url : '',
      description: value.description ? value.description : '',
      event_type_id: value.event_type_id ? value.event_type_id : '',
      objective: value.objective ? value.objective : '',
      copy: value.copy ? value.copy : '',
      copy_image: value.copy_image ? value.copy_image : '',
      instructions: value.instructions ? value.instructions : '',
      files: value.files ? value.files : [],
      tags: value.tags ? value.tags : [],
      tags_format: value.tags_format ? value.tags_format : [],
      event_status_id: value.event_status_id ? value.event_status_id : '',
      isIndex: value.isIndex ? value.isIndex : '',
      indexes: value.indexes ? value.indexes.split(',') : [],
      isExternalEvent: value.isExternalEvent ? value.isExternalEvent : '',
      external_event_id: value.external_event_id ? value.external_event_id : '',
      accounts: value.accounts ? value.accounts : '',
      is_recurrent: value.is_recurrent ? value.is_recurrent : '',
      created_at: value.created_at ? value.created_at : '',
      updated_at: value.updated_at ? value.updated_at : ''
    }
  }

  return {
    id: '',
    title: '',
    start: '',
    end: '',
    allDay: '',
    url: '',
    description: '',
    account_id: '',
    event_type_id: '',
    objective: '',
    copy: '',
    copy_image: '',
    instructions: '',
    files: [],
    tags: [],
    tags_format: [],
    event_status_id: '',
    isIndex: '',
    indexes: [],
    isExternalEvent: '',
    external_event_id: '',
    accounts: '',
    is_recurrent: '',
    created_at: '',
    updated_at: '',
    recurringEventRepeat: '', //only for setErrorsEvent
    recurringEventEnd: '',     //only for setErrorsEvent
  }
};

export const account_id = $('input[name=account_id]').val();
export const account_url = $('input[name=account_url]').val();
export const account_name = $('input[name=account_name]').val();
export const isSingleEvent = $('input[name=isSingleEvent]').val() == 1 ? true : false;
export const event_id = $('input[name=event_id]').val();
export const locale = $('input[name=locale]').val() == 'es' ? ES : EN;
export const user_id = $('input[name=user_id]').val();
export const user_role = $('input[name=user_role]').val();
export const base_url = $('input[name=base_url]').val();

export function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes;
  var strTime = hours + ':' + minutes + ampm;
  return strTime;
}

export function getSearchParameters() {
  var prmstr = window.location.search.substring(1);
  return prmstr != null && prmstr != "" ? transformToAssocArray(prmstr) : {};
}

function transformToAssocArray(prmstr) {
  var params = {};
  var prmarr = prmstr.split("&");
  for (var i = 0; i < prmarr.length; i++) {
    var tmparr = prmarr[i].split("=");
    params[tmparr[0]] = tmparr[1];
  }
  return params;
}

export const _time = (fromDate, toDate) => {
  var d = fromDate;
  var hoy = toDate;

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

export const _timeHistory = (fromDate, toDate) => {
  var d = fromDate;
  var hoy = toDate;

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
            return `Se cambio el status en ${segundos} segundos`;
          } else {
            return `Se cambio el status en ${minutos} minutos`;
          }
        } else {
          return `Se cambio el status en ${horas} horas`;
        }
      } else {
        return `Se cambio el status en ${dias} dias`;
      }
    } else {
      return `Se cambio el status en ${meses} meses`;
    }
  } else {
    return `Se cambio el status en ${anos} años`;
  }
};

export const isValidImageFormat = (value) => {
  const imageFormats = ['png', 'jpg', 'jpeg', 'gif', 'svg'];
  return imageFormats.includes(value);
};