import { combineReducers, combineSlices, configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

import { newForwarderForm } from '@/features/newForwarderForm';
import { setup } from '@/features/setup';
import { settings } from '@/features/settings';
import { directadminApi } from '@/features/directadminApi';

const secureStorage = {
  async setItem(key: string, value: string) {
    await SecureStore.setItemAsync(key, value);
  },
  async getItem(key: string) {
    return await SecureStore.getItemAsync(key);
  },
  async removeItem(key: string) {
    await SecureStore.deleteItemAsync(key);
  },
};

const securePersistConfig = {
  key: 'secure',
  storage: secureStorage,
  whitelist: ['setup'],
};

const persistConfig = {
  key: 'regular',
  storage: AsyncStorage,
  whitelist: ['settings'],
};

const persistedSettings = persistReducer(persistConfig, settings.reducer);
const persistedSetup = persistReducer(securePersistConfig, setup.reducer);

const rootReducer = combineReducers([
  combineSlices(directadminApi, newForwarderForm),
  persistedSettings,
  persistedSetup,
]);

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
