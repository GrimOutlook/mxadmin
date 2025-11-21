import { RootState } from '@/lib/store';
import { BaseQueryFn, createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import * as z from 'zod';
import { GET_DOMAINS_ENDPOINT, getDomainsResponseSchema } from '../lib/directadmin';
import { basic_auth } from '@/lib/utils';
import { SetupInfo } from './setup';

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
    // TODO: Figure out if `GET_DOMAINS_ENDPOINT` can be removed since this is
    // only used to verify connection and login capability
    trySetup: builder.query<void, SetupInfo>({
      query: (info) => ({
        url: info.url + GET_DOMAINS_ENDPOINT,
        headers: {
          Authorization: basic_auth(info.username, info.password),
        },
      }),
    }),
    getDomains: builder.query<z.infer<typeof getDomainsResponseSchema>, void>({
      query: () => GET_DOMAINS_ENDPOINT,
      responseSchema: getDomainsResponseSchema,
    }),
  }),
});

export const { useLazyTrySetupQuery, useGetDomainsQuery } = directadminApi;
