// Credentials to use for the demo instance.
// NOTE: These are just to display the user the allowed format and are not used
// to "login" anywhere.
export const demoSetupInfo = {
  url: 'https://demo.local',
  username: 'demo',
  password: 'demo',
};

// Domains to use for the demo instance
export const demoDomains = ['example.com', 'demo.org'];

// Forwarders to return for the demo instance
export const demoForwarders: Record<string, Record<string, string[]>> = {
  'example.com': {
    jobs: ['test@demo.org'], // jobs@example.com -> test@demo.org
    spam: ['example@gmail.com'], // spam@example.com -> example@gmail.com
  },
  'demo.org': {
    example: ['example@example.com'], // example@demo.org -> example@example.com
  },
};

// Default forwarder for the demo instance
export const demoDefaultForwarders = [{ domain: 'example.com', target: 'catchall@example.com' }];

// Settings that can be set for the demo instance
export const defaultDemoSettings = {
  default_target: false,
};
export type DemoSettings = typeof defaultDemoSettings;
