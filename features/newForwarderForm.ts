import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface NewForwarderFormState {
  new_forwarder: string | null;
  forward_to: string | null;
}

const initialState: NewForwarderFormState = {
  new_forwarder: null,
  forward_to: null,
};

export const newForwarderForm = createSlice({
  name: 'new_forwarder',
  initialState,
  reducers: {
    setNewForwarder: (state, action: PayloadAction<string>) => {
      // TODO: Validate that the given string is a valid email
      state.new_forwarder = action.payload;
    },

    setForwardTo: (state, action: PayloadAction<string>) => {
      // TODO: Validate that the given string is a valid email
      state.forward_to = action.payload;
    },

    resetForm: (state) => {
      state = initialState;
    },
  },
  selectors: {
    getNewForwarder: (state) => state.new_forwarder,
    getForwardTo: (state) => state.forward_to,
  },
});

export const { setNewForwarder, setForwardTo, resetForm } = newForwarderForm.actions;
export const { getNewForwarder, getForwardTo } = newForwarderForm.selectors;
