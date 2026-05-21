import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.biblecast.app',
  appName: 'BibleCast',
  webDir: 'dist',
  server: {
    url: 'http://192.168.1.45:3000',  // Termux IP
    cleartext: true
  }
};

export default config;