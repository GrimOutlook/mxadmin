import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

import { newForwarder } from '@/features/newForwarder';
import { setup } from '@/features/setup';
import { settings } from '@/features/settings';
import { directadminApi } from '@/features/directadminApi';
import { demo } from '@/features/demo';

// NOTE: `redux-persist` tries to use keys with `:` in them which is not
// allowed. Need to convert them to use a different character.
const sanitizedKey = (key: string) => key.replace(/:/g, '_');
const secureStorage = {
  async setItem(key: string, value: string) {
    await SecureStore.setItemAsync(sanitizedKey(key), value);
  },
  async getItem(key: string) {
    return await SecureStore.getItemAsync(sanitizedKey(key));
  },
  async removeItem(key: string) {
    await SecureStore.deleteItemAsync(sanitizedKey(key));
  },
};

const securePersistConfig = {
  key: 'secure',
  storage: secureStorage,
};

const persistConfig = {
  key: 'regular',
  storage: AsyncStorage,
};

const persistedSettings = persistReducer(persistConfig, settings.reducer);
const persistedSetup = persistReducer(securePersistConfig, setup.reducer);

const rootReducer = combineReducers({
  demo: demo.reducer,
  directadmin_api: directadminApi.reducer,
  new_forwarder: newForwarder.reducer,
  settings: persistedSettings,
  setup: persistedSetup,
});

export const store = configureStore({
  /*
   * Adding the api middleware enables caching, invalidation, polling,
   * and other useful features of `rtk-query`.
   */
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(directadminApi.middleware),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
