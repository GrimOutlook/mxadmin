import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface NewForwarderState {
  // Forwarder name to show immediately after adding forwarder. Null otherwise.
  show_forwarder: string | null;
}

const initialState: NewForwarderState = {
  show_forwarder: null,
};

export const newForwarder = createSlice({
  name: 'new_forwarder',
  initialState,
  reducers: {
    showForwarder: (state, action: PayloadAction<string>) => {
      state.show_forwarder = action.payload;
    },
    resetShownForwarder: (state) => {
      state.show_forwarder = null;
    },
  },
  selectors: {
    shownForwarder: (state) => state.show_forwarder,
  },
});

export const { showForwarder, resetShownForwarder } = newForwarder.actions;
export const { shownForwarder } = newForwarder.selectors;
