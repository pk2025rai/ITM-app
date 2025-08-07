import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.resolute.ITM',
  appName: 'ITM APP',
  webDir: 'build',
  server: {
    url: 'https://itm-app.vercel.app/',  // Replace with your actual Vercel URL
    cleartext: false                     // Ensures HTTPS is used
  }
};

export default config;
