interface SettingsState {
  default_domain: string | null;
  default_forward_target: [
    {
      domain: string;
      target: string;
    },
  ];
}
