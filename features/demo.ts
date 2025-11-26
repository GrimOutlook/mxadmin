import { demoDomains, demoForwarders, defaultDemoSettings, DemoSettings } from '@/lib/demo';
import { AddForwarderProps, DeleteForwarderProps } from '@/lib/directadmin';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DemoState {
  enabled: boolean;
  domains: string[];
  forwarders: Record<string, Record<string, string[]>>;
  // Settings to use for the demo instance
  settings: DemoSettings;
}

const initialState: DemoState = {
  enabled: false,
  domains: demoDomains,
  forwarders: demoForwarders,
  settings: defaultDemoSettings,
};

export const demo = createSlice({
  name: 'demo',
  initialState,
  reducers: {
    setDemoMode: (state, action: PayloadAction<boolean>) => {
      state.enabled = action.payload;
    },
    setDemoSettings: (state, action: PayloadAction<DemoSettings>) => {
      state.settings = action.payload;
    },
    addDemoForwarder: (state, action: PayloadAction<AddForwarderProps>) => {
      const props = action.payload;
      // TODO: Make this work
    },
    deleteDemoForwarder: (state, action: PayloadAction<DeleteForwarderProps>) => {
      const props = action.payload;
      delete state.forwarders[props.domain][props.select0];
    },
  },
  selectors: {
    getDemoMode: (state) => state.enabled,
    getDemoSettings: (state) => state.settings,
  },
});

export const { setDemoMode, setDemoSettings, addDemoForwarder, deleteDemoForwarder } = demo.actions;
export const { getDemoMode, getDemoSettings } = demo.selectors;
