import * as z from 'zod';

// NOTE: No, you cannot include this in the header instead of in the URL. I
// tried that and I'm upset it didn't work. This now needs to be added to every
// endpoint I implement, or I need to find some function that can be used to
// catch every API call before it's sent and append this to the URL.
export const JSON = '?json=yes';
export const DIRECTADMIN_URL_STORAGE_KEY = 'DirectAdminUrl';
export const DIRECTADMIN_USERNAME_STORAGE_KEY = 'DirectAdminUsername';
export const DIRECTADMIN_API_TOKEN_STORAGE_KEY = 'DirectAdminApiToken';

export const GET_DOMAINS_ENDPOINT = '/CMD_API_SHOW_DOMAINS' + JSON;
// Returns a list of strings according to
// [the docs](https://docs.directadmin.com/developer/api/legacy-api.html#user-apis)
export const getDomainsResponseSchema = z.string().array();

export const GET_FORWARDERS_ENDPOINT = '/CMD_API_EMAIL_FORWARDERS' + JSON;
export const getForwardersResponseSchema = z.record(z.string(), z.array(z.string()));
