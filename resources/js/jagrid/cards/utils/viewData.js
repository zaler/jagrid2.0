import { ES, EN } from './locale';

export const account_id = $('input[name=account_id]').val();
export const account_url = $('input[name=account_url]').val();
export const account_name = $('input[name=account_name]').val();
export const user_id = $('input[name=user_id]').val();
export const user_role = $('input[name=user_role]').val();
export const locale = $('input[name=locale]').val() == 'es' ? ES : EN;
export const base_url = $('input[name=base_url]').val();