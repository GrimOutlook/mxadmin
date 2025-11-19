import {
  combineSlices,
  configureStore,
} from "@reduxjs/toolkit";

import { newForwarderForm } from '../features/newForwarderForm'
import { settings } from '../features/settings'
import { directadminApi } from "@/features/directadminApi";

/*
 * `combineSlices` automatically combines the reducers using
 * their `reducerPath`s, therefore we no longer need to call `combineReducers`.
 */
const rootReducer = combineSlices(
  directadminApi,
  newForwarderForm,
  settings,
);

export const store = configureStore({
  /*
   * Adding the api middleware enables caching, invalidation, polling,
   * and other useful features of `rtk-query`.
   */
  reducer: rootReducer,
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
