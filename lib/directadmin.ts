import * as z from 'zod';

export const DIRECTADMIN_API_TOKEN_STORAGE_KEY = "DirectAdminApiToken"
export const GET_DOMAINS_ENDPOINT = '/CMD_API_SHOW_DOMAINS'
// Returns a list of strings according to
// [the docs](https://docs.directadmin.com/developer/api/legacy-api.html#user-apis)
export const getDomainsResponseSchema = z.string().array()
