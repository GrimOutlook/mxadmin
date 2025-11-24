import { createSlice } from '@reduxjs/toolkit';

interface SettingsState {
  default_domain: string | null;
  default_forward_target: {
    domain: string;
    target: string;
  }[];
}

const initialState: SettingsState = {
  default_domain: null,
  default_forward_target: [],
};

export const settings = createSlice({
  name: 'setup',
  initialState,
  reducers: {},
  selectors: {},
});

export const {} = settings.actions;
export const {} = settings.selectors;
