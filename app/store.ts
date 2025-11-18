import {
  combineSlices,
  configureStore,
} from "@reduxjs/toolkit";

import { newForwarderFormSlice } from '../features/newForwarderFormSlice'
import { settingsSlice } from '../features/settingsSlice'
import { directadminApiSlice } from "@/features/directadminApiSlice";

/*
 * `combineSlices` automatically combines the reducers using
 * their `reducerPath`s, therefore we no longer need to call `combineReducers`.
 */
const rootReducer = combineSlices(
  directadminApiSlice,
  newForwarderFormSlice,
  settingsSlice
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
