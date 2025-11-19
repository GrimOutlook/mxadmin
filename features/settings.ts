import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface SettingsState {
  directadmin_url: string | null
  directadmin_user: string | null
  // WARN: This is not to be saved like the other items. Probably need to move
  // this to it's own slice but this keeps things slightly cleaner.
  directadmin_password: string | null
}

const initialState: SettingsState = {
  directadmin_url: null,
  directadmin_user: null,
  directadmin_password: null,
}

export const settings = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setDirectadminUrl: (state, action: PayloadAction<string>) => {
      state.directadmin_url = action.payload
    },

    setDirectadminUser: (state, action: PayloadAction<string>) => {
      state.directadmin_user = action.payload
    },

    setDirectadminPassword: (state, action: PayloadAction<string>) => {
      // TODO: Add this to the native keystore. It will not be saved to the same
      // place as the other settings.
      state.directadmin_password = action.payload
    },

    reset: (state) => {
      state = initialState
    }
  },
  selectors: {
    selectDirectadminPassword: (state) => state.directadmin_password,
    selectDirectadminUrl: (state) => state.directadmin_url,
    selectDirectadminUser: (state) => state.directadmin_user,
  }
})

export const { setDirectadminUrl, setDirectadminUser, reset } = settings.actions
export const { selectDirectadminPassword, selectDirectadminUrl, selectDirectadminUser } = settings.selectors
