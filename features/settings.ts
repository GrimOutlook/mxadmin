import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SettingsState {
  // Domain to show on startup. Null, means the last one that was open if a
  // domain was previously shown, or the first alphabetically when first loaded.
  // TODO: Need to add a slice that handles the selected domain so that
  // redux-persist can persist the selected domain if desired
  default_domain: string | null;

  // Email that new forwarders will forward to by default when creating a new
  // forwarder.
  default_forward_target: { domain: string; target: string }[];
}

const initialState: SettingsState = {
  default_domain: null,
  default_forward_target: [],
};

export const settings = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setDefaultTargetForDomain: (
      state,
      action: PayloadAction<{ target: string; domain: string }>
    ) => {
      state.default_forward_target = state.default_forward_target
        // Remove the old default
        .filter((item) => item.domain != action.payload.domain)
        // Add the new one
        .concat(action.payload);
    },
  },
  selectors: {
    selectDefaultForwardTargets: (state) => state.default_forward_target,
    selectDefaultDomain: (state) => state.default_domain,
  },
});

export const { setDefaultTargetForDomain } = settings.actions;
export const { selectDefaultForwardTargets, selectDefaultDomain } = settings.selectors;
