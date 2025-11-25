import { RootState } from '@/lib/store';
import {
  BaseQueryFn,
  createApi,
  fetchBaseQuery,
  QueryReturnValue,
} from '@reduxjs/toolkit/query/react';
import {
  AddForwarderProps,
  DeleteForwarderProps,
  forwardersActionResponseSchema,
  ForwardersActionResponseType,
  GET_DOMAINS_ENDPOINT,
  GET_FORWARDERS_ENDPOINT,
  getDomainsResponseSchema,
  GetDomainsResponseType,
  getForwardersResponseSchema,
  GetForwardersResponseType,
} from '@/lib/directadmin';
import { basic_auth } from '@/lib/utils';
import { SetupInfo } from './setup';
import { addDemoForwarder, deleteDemoForwarder, demoDomains } from '@/features/demo';

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
        // Check if demo is enabled. If it is, return an empty array (since we
        // don't use it anyway). This will return a valid return-code and act as
        // if the request succeeded.
        const state = api.getState() as RootState;
        if (state.demo.enabled) {
          return { data: {} };
        }

        // If not in demo mode run the query as usual
        const result = await baseQuery({
          url: info.url + GET_DOMAINS_ENDPOINT,
          headers: {
            Authorization: basic_auth(info.username, info.password),
          },
        });

        return result as QueryReturnValue<{}, SetupInfo, undefined>;
      },
    }),
    getDomains: builder.query<GetDomainsResponseType, void>({
      queryFn: async (_, api, _extraOptions, baseQuery) => {
        // Check if demo is enabled. If it is, return the demo array of domains
        const state = api.getState() as RootState;
        if (state.demo.enabled) {
          return { data: demoDomains };
        }

        // If not in demo mode run the query as usual
        const result = await baseQuery({
          url: GET_DOMAINS_ENDPOINT,
        });

        return result as QueryReturnValue<GetDomainsResponseType, void, undefined>;
      },
      responseSchema: getDomainsResponseSchema,
    }),
    getForwardersForDomain: builder.query<GetForwardersResponseType, string>({
      queryFn: async (
        domain,
        api,
        _extraOptions,
        baseQuery
      ): Promise<QueryReturnValue<GetForwardersResponseType, string, undefined>> => {
        // Check if demo is enabled. If it is, return the demo array of
        // forwarders
        const state = api.getState() as RootState;
        if (state.demo.enabled) {
          return { data: state.demo.forwarders[domain] };
        }

        // If not in demo mode run the query as usual
        const result = await baseQuery({
          url: GET_FORWARDERS_ENDPOINT + '&domain=' + domain,
        });

        return result as QueryReturnValue<GetForwardersResponseType, string, undefined>;
      },
      responseSchema: getForwardersResponseSchema,
    }),

    // TODO: Determine the actual return type of this query. The documentation
    // doesn't say but it's likely just the full list of forwarders for the
    // domain
    addForwarderToDomain: builder.mutation<ForwardersActionResponseType, AddForwarderProps>({
      queryFn: async (
        props,
        api,
        _extraOptions,
        baseQuery
        // Typescript gets mad if we don't specify the return type since we
        // reference the state
      ): Promise<QueryReturnValue<ForwardersActionResponseType, AddForwarderProps, undefined>> => {
        // Check if demo is enabled. If it is, return the demo array of
        // forwarders
        const state: RootState = api.getState() as RootState;
        if (state.demo.enabled) {
          api.dispatch(addDemoForwarder(props));
          // FIXME: This will probably not work as my guess is the state in the
          // variable isn't updated when the dispatch is sent. Probably need to
          // do getState() again.
          return {
            data: {
              result: `Alias ${props.user}@${props.domain} -> ${props.email} has been created\n`,
              success: 'Forwarder Created',
            },
          };
        }

        // If not in demo mode run the query as usual
        const result = await baseQuery({
          url:
            GET_FORWARDERS_ENDPOINT +
            Object.keys({ ...props, action: 'create' })
              .map((prop) => `&${prop}=${(props as Record<string, string>)[prop]}`)
              .join(''),
        });

        return result as QueryReturnValue<
          ForwardersActionResponseType,
          AddForwarderProps,
          undefined
        >;
      },
      responseSchema: forwardersActionResponseSchema,
    }),
    // TODO: Determine the actual return type of this query. The documentation
    // doesn't say but it's likely just the full list of forwarders for the
    // domain
    deleteForwarderFromDomain: builder.mutation<ForwardersActionResponseType, DeleteForwarderProps>(
      {
        queryFn: async (
          props,
          api,
          _extraOptions,
          baseQuery
          // Typescript gets mad if we don't specify the return type since we
          // reference the state
        ): Promise<
          QueryReturnValue<ForwardersActionResponseType, DeleteForwarderProps, undefined>
        > => {
          // Check if demo is enabled. If it is, return the demo array of
          // forwarders
          const state: RootState = api.getState() as RootState;
          if (state.demo.enabled) {
            api.dispatch(deleteDemoForwarder(props));
            // FIXME: This will probably not work as my guess is the state in the
            // variable isn't updated when the dispatch is sent. Probably need to
            // do getState() again.
            return {
              data: {
                result: '',
                success: 'Forwarders Deleted',
              },
            };
          }

          // If not in demo mode run the query as usual
          const result = await baseQuery({
            url:
              GET_FORWARDERS_ENDPOINT +
              Object.keys({ ...props, action: 'delete' })
                .map((prop) => `&${prop}=${(props as Record<string, string>)[prop]}`)
                .join(''),
          });

          return result as QueryReturnValue<
            ForwardersActionResponseType,
            DeleteForwarderProps,
            undefined
          >;
        },
        responseSchema: forwardersActionResponseSchema,
      }
    ),
  }),
});

export const {
  useLazyTrySetupQuery,
  useGetDomainsQuery,
  useGetForwardersForDomainQuery,
  useAddForwarderToDomainMutation,
  useDeleteForwarderFromDomainMutation,
} = directadminApi;
