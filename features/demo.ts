import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DemoState {
  enabled: boolean;
}

const initialState: DemoState = {
  enabled: false,
};

export const demo = createSlice({
  name: 'demo',
  initialState,
  reducers: {
    setDemoMode: (state, action: PayloadAction<boolean>) => {
      state.enabled = action.payload;
    },
  },
  selectors: {
    getDemoMode: (state) => state.enabled,
  },
});

export const { setDemoMode } = demo.actions;
export const { getDemoMode } = demo.selectors;

export const demoSetupInfo = {
  username: 'demo',
  password: 'demo',
  url: 'https://demo.local',
};

export const demoDomains = ['example.com', 'demo.org'];
export const demoForwarders: Record<string, Record<string, string[]>> = {
  'example.com': {
    jobs: ['test@demo.org'], // jobs@example.com -> test@demo.org
    spam: ['example@gmail.com'], // spam@example.com -> example@gmail.com
  },
  'demo.org': {
    example: ['example@example.com'], // example@demo.org -> example@example.com
  },
};
