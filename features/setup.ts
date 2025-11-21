import { Nullable } from '@/lib/utils';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export type SetupInfo = {
  // WARN: This is not to be saved like the other items. Probably need to move
  // this to it's own slice but this keeps things slightly cleaner.
  password: string;
  url: string;
  username: string;
};

type NullableSetupInfo = Nullable<SetupInfo>;

export interface SetupState {
  setupInfo: NullableSetupInfo;

  // Is true when all setup information has been provided, and a successful
  // query to the provided Directadmin instance is achieved.
  isSetup: boolean;
}

const initialState: SetupState = {
  setupInfo: { password: null, url: null, username: null },
  isSetup: false,
};

export const setup = createSlice({
  name: 'setup',
  initialState,
  reducers: {
    setSetupInfo: (state, action: PayloadAction<SetupInfo>) => {
      state.setupInfo = action.payload;
      state.isSetup = true;
    },

    // Take in the setup info, and verify that the information can be used to
    // connect to the specified Directadmin URL.
    reset: (state) => {
      state = initialState;
    },

    resetIsSetup: (state) => {
      state.isSetup = initialState.isSetup;
    },
  },
  selectors: {
    selectSetupInfo: (state) => state.setupInfo,
    selectIsSetup: (state) => state.isSetup,
  },
});

export const { setSetupInfo, reset, resetIsSetup } = setup.actions;
export const { selectSetupInfo, selectIsSetup } = setup.selectors;
