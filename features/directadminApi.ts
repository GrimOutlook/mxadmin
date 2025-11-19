import { BaseQueryFn, createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from "@/app/store"
import { GET_DOMAINS_ENDPOINT, getDomainsResponseSchema } from "../lib/directadmin"
import * as z from 'zod';

const dynamicBaseQuery: BaseQueryFn = async (args, api, extraOptions) => {
  // Get the necessary information from the store
  const { directadmin_url: url, directadmin_user: user, directadmin_password: pass } = (api.getState() as RootState).settings;

  const rawBaseQuery = fetchBaseQuery({
    baseUrl: url || '',
    prepareHeaders: (headers) => {
      // This should always be true if this is hit. API callers are responsible
      // for verifying user has submitted all required information before
      // executing.
      if (user && pass) {
        headers.set('Authorization', 'Basic ' + btoa(`${user}:${pass}`))
      }
      return headers
    },
    timeout: 10000, // 10 Seconds
  });

  return rawBaseQuery(args, api, extraOptions);
};

export const directadminApi = createApi({
  reducerPath: 'directadmin_api',
  baseQuery: dynamicBaseQuery,
  endpoints: (builder) => ({
    getDomains: builder.query<z.infer<typeof getDomainsResponseSchema>, void>({
      query: () => GET_DOMAINS_ENDPOINT,
      responseSchema: getDomainsResponseSchema,
    }),
  }),

})

export const { useGetDomainsQuery } = directadminApi;
