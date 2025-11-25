import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import * as z from 'zod';

// NOTE: No, you cannot include this in the header instead of in the URL. I
// tried that and I'm upset it didn't work. This now needs to be added to every
// endpoint I implement, or I need to find some function that can be used to
// catch every API call before it's sent and append this to the URL.
export const JSON = '?json=yes';
export const DIRECTADMIN_URL_STORAGE_KEY = 'DirectAdminUrl';
export const DIRECTADMIN_USERNAME_STORAGE_KEY = 'DirectAdminUsername';
export const DIRECTADMIN_API_TOKEN_STORAGE_KEY = 'DirectAdminApiToken';

// https://docs.directadmin.com/changelog/version-1.21.3.html#cmd-api-show-domains
export const GET_DOMAINS_ENDPOINT = '/CMD_API_SHOW_DOMAINS' + JSON;
// Returns a list of strings according to
// [the docs](https://docs.directadmin.com/developer/api/legacy-api.html#user-apis)
export const getDomainsResponseSchema = z.string().array();
export type GetDomainsResponseType = z.infer<typeof getDomainsResponseSchema>;

// https://docs.directadmin.com/changelog/version-1.21.3.html#cmd-api-show-domains
export const GET_FORWARDERS_ENDPOINT = '/CMD_API_EMAIL_FORWARDERS' + JSON;
export const getForwardersResponseSchema = z.record(z.string(), z.array(z.string()));
export type GetForwardersResponseType = z.infer<typeof getForwardersResponseSchema>;

// https://docs.directadmin.com/changelog/version-1.22.3.html#cmd-api-email-forwarders
export type AddForwarderProps = {
  // Domain that this forwarder belongs to
  domain: string;
  // Forwarder alias (front part of the email address)
  user: string;
  // Email that gets forwarded to
  email: string;
};

// https://docs.directadmin.com/changelog/version-1.22.3.html#cmd-api-email-forwarders
export type DeleteForwarderProps = {
  // Domain to remove forwarder from
  domain: string;
  // Forwarder alias (front part of the email address) to delete
  select0: string;
};

export function errorText(query_error: FetchBaseQueryError, domain: string): string {
  switch (query_error.status) {
    case 'TIMEOUT_ERROR':
      return (
        query_error.status + ': Failed to connect to ' + domain + '. Verify domain is correct.'
      );
    case 'FETCH_ERROR':
      return query_error.status + ':\n' + query_error.error;
    default:
      return 'Unknown error. Verify connection is online and credentials are correct and try again.';
  }
}
