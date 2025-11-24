import { RootState } from '@/lib/store';
import {
  BaseQueryFn,
  createApi,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import * as z from 'zod';
import {
  GET_DOMAINS_ENDPOINT,
  GET_FORWARDERS_ENDPOINT,
  getDomainsResponseSchema,
  getForwardersResponseSchema,
} from '@/lib/directadmin';
import { basic_auth } from '@/lib/utils';
import { SetupInfo } from './setup';
import { demoDomains, demoForwarders } from './demo';

const dynamicBaseQuery: BaseQueryFn = async (args, api, extraOptions) => {
  // Get the necessary information from the store
  const { url, username, password } = (api.getState() as RootState).setup.setupInfo;

  const rawBaseQuery = fetchBaseQuery({
    baseUrl: url || '',
    prepareHeaders: (headers) => {
      // This should always be true if this is hit. API callers are responsible
      // for verifying user has submitted all required information before
      // executing.
      if (username && password) {
        headers.set('Authorization', basic_auth(username, password));
      }
      return headers;
    },
    timeout: 10000, // 10 Seconds
  });

  return rawBaseQuery(args, api, extraOptions);
};

export const directadminApi = createApi({
  reducerPath: 'directadmin_api',
  baseQuery: dynamicBaseQuery,
  endpoints: (builder) => ({
    trySetup: builder.query<{}, SetupInfo>({
      queryFn: async (info, api, _extraOptions, baseQuery) => {
        const state = api.getState() as RootState;

        if (state.demo.enabled) {
          return { data: {} };
        }

        const result = baseQuery({
          url: info.url + GET_DOMAINS_ENDPOINT,
          headers: {
            Authorization: basic_auth(info.username, info.password),
          },
        });

        if ('error' in result) {
          return { error: result.error };
        }

        return { data: {} };
      },
    }),
    getDomains: builder.query<z.infer<typeof getDomainsResponseSchema>, void>({
      queryFn: async (_, api, _extraOptions, baseQuery) => {
        const state = api.getState() as RootState;

        if (state.demo.enabled) {
          return { data: demoDomains };
        }

        const result = await baseQuery({
          url: GET_DOMAINS_ENDPOINT,
        });

        if ('error' in result) {
          return { error: result.error as FetchBaseQueryError };
        }

        return { data: result.data as z.infer<typeof getDomainsResponseSchema> };
      },
      responseSchema: getDomainsResponseSchema,
    }),
    getForwardersForDomain: builder.query<z.infer<typeof getForwardersResponseSchema>, string>({
      queryFn: async (domain, api, _extraOptions, baseQuery) => {
        const state = api.getState() as RootState;

        if (state.demo.enabled) {
          return { data: demoForwarders[domain] };
        }

        const result = await baseQuery({
          url: GET_FORWARDERS_ENDPOINT + '&domain=' + domain,
        });

        if ('error' in result) {
          return { error: result.error as FetchBaseQueryError };
        }

        return { data: result.data as z.infer<typeof getForwardersResponseSchema> };
      },
      responseSchema: getForwardersResponseSchema,
    }),
  }),
});

export const { useLazyTrySetupQuery, useGetDomainsQuery, useGetForwardersForDomainQuery } =
  directadminApi;
